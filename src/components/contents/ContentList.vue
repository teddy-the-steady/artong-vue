<template>
  <div>
    <top-container :topImages="topContents" :selectedImage="selectedImage"
      @image-selected="onTopImageSelect"></top-container>
    <center-container class="center-container" v-show="selectedImage" :image="selectedImage" ref="center"></center-container>
    <bottom-container v-if="bottomContents" :bottomImages="bottomContents"
      @image-selected="onBottomImageSelect"></bottom-container>
    <infinite-loading :identifier="$route.params.id" @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import CenterContainer from './CenterContainer'
import TopContainer from './TopContainer'
import BottomContainer from './BottomContainer'
import axios from 'axios'
import { mapState } from 'vuex'
import { makeS3Path, deepCopy } from '../../util/commonFunc'

export default {
  name: 'ContentList',
  components: {
    CenterContainer, TopContainer, BottomContainer, InfiniteLoading
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  props: {
    contentsApi: {
      type: Object,
      default: null
    },
    numberOfContentsToLoad: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      topContents: [],
      bottomContents: [],
      selectedImage: null,
      lastLoadedId: null,
      noMoreDataToLoad: false
    }
  },
  methods: {
    async infiniteHandler($state) {
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      if (this.bottomContents.length > 0 || this.selectedImage) {
        await this.pushContentToBottom()
      } else {
        await this.pushContentToTop()
      }
      setTimeout(function() { $state.loaded() }, 1000)
    },
    async pushContentToBottom() {
      const imageArrayToPush = await this.makeImageArray()
      this.pushImages(imageArrayToPush, this.bottomContents)
    },
    async pushContentToTop() {
      const imageArrayToPush = await this.makeImageArray()
      this.pushImages(imageArrayToPush, this.topContents)
    },
    async makeImageArray() {
      const imageArrayToPush = []
      if (this.contentsApi) {
        let results = null
        results = await this.getContents(this.contentsApi, this.numberOfContentsToLoad)

        if (results) {
          for (let i = 0; i < results.length; i++) {
            imageArrayToPush.push({
              index: i,
              id_pk: results[i].id,
              url: this.getImageUrl(results[i].thumbnail_url),
              profileUrl: results[i].profile_pic ? this.getImageUrl(results[i].profile_pic) : '',
              username: results[i].username,
              like: results[i].like
            })
          }
        }
      } else { // TODO] 일단은 임시 컨텐츠들. content-list props으로 contentsApi가 안넘어오면 결국은 No contents 보여줘야 할듯
        for (let i = 0; i < this.numberOfContentsToLoad; i++) {
          const randomInt = this.getRandomIntInclusive(11, 20)
          imageArrayToPush.push({
            index: i,
            url: randomInt,
            username: 'qhqoxogh',
            like: false
          })
        }
      }
      return imageArrayToPush
    },
    getRandomIntInclusive(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      const result = Math.floor(Math.random() * (max - min + 1)) + min
      return result
    },
    async getContents(contentsApi, numOfImages) {
      let results = await axios.get(contentsApi.url, {
        params: {
          username: contentsApi.params.id ? contentsApi.params.id : null,
          pageSize: numOfImages,
          lastId: this.lastLoadedId
        }
      })
      this.lastLoadedId = results.length > 0 ? results[results.length - 1].id : null
      this.noMoreDataToLoad = results.length < numOfImages
      return results
    },
    getImageUrl(path) {
      return makeS3Path(path)
    },
    pushImages(images, destContainer) {
      let lastImageOfContainer = destContainer[destContainer.length - 1]
      if (lastImageOfContainer) this.resetImageIndexBeforePush(images, lastImageOfContainer)
      for (let i in images) {
        this.pushImage(images[i], destContainer)
      }
    },
    resetImageIndexBeforePush(images, lastImageOfContainer) {
      let lastImageOfContainerCopy = deepCopy(lastImageOfContainer)
      for (let i in images) {
        images[i].index = ++lastImageOfContainerCopy.index
      }
    },
    pushImage(image, destContainer) {
      destContainer.push(image)
    },
    onBottomImageSelect(selectedIndex) {
      const topContentsTail = this.bottomContents.slice(0, selectedIndex)
      const selectedImage = this.bottomContents[selectedIndex]
      this.bottomContents.splice(0, selectedIndex + 1)
      this.resetImageIndex(this.bottomContents)
      this.pushImages([this.selectedImage], this.topContents)
      this.pushImages(topContentsTail, this.topContents)
      this.setSelectedImage(selectedImage)
    },
    resetImageIndex(container) {
      for (let i in container) {
        container[i].index = i
      }
    },
    setSelectedImage(image) {
      this.selectedImage = image
    },
    onTopImageSelect(selectedIndex) {
      const bottomContentsHead = this.topContents.slice(selectedIndex + 1)
      const selectedImage = this.topContents[selectedIndex]
      this.topContents.splice(selectedIndex)
      if (this.selectedImage) {
        this.prependImage(this.selectedImage, this.bottomContents)
      }
      this.prependImages(bottomContentsHead, this.bottomContents)
      this.setSelectedImage(selectedImage)
    },
    prependImages(images, destContainer) {
      for (let i = images.length - 1; i >= 0; i--) {
        this.prependImage(images[i], destContainer)
      }
      this.resetImageIndex(destContainer)
    },
    prependImage(image, destContainer) {
      destContainer.unshift(image)
    },
    emptyContentsLists() {
      this.topContents = []
      this.bottomContents = []
      this.selectedImage = null
    }
  },
  mounted() {
    this.$watch(
      () => { return this.$refs.center.image },
      () => {
        const center = this.$refs.center.$el
        const centerPosition = center.offsetTop
        const headerOffset = 55
        const offsetPosition = centerPosition - headerOffset
        let option = {
          top: offsetPosition
        }
        if (navigator.userAgent.indexOf('Mobile') !== -1) {
          if (navigator.userAgent.indexOf('iPhone') !== -1) {
            option.behavior = 'auto'
          } else if (navigator.userAgent.indexOf('Android') !== -1) {
            option.behavior = 'smooth' // TODO] 안드로이드 스크롤 이상함
          }
        } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
          option.behavior = 'smooth'
        } else {
          option.behavior = 'auto'
        }
        window.scrollTo(option)
        setTimeout(function() {
          const centerTop = center.getBoundingClientRect().top
          if (centerTop < 54 || centerTop > 56) {
            window.scrollTo({
              top: centerPosition + centerTop - 110,
              behavior: 'smooth'
            })
          }
        }, 400)
      }
    )
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.center-container {
  margin: 10px;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 1px 1px 4px 0 rgb(0 0 0 / 15%);
}
</style>
