<template>
  <div>
    <top-container class="top-container" :topImages="topContents" :selectedImage="selectedImage"
      @image-selected="onTopImageSelect"></top-container>
    <center-container :image="selectedImage" ref="center"></center-container>
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
import { parseS3Path } from '../../util/commonFunc'
import { CLOUDFRONT_URL } from '../../constants/url'

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
  data() {
    return {
      SCROLL_LOAD_NUM: 10,
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
        await this.pushContentToBottom(this.SCROLL_LOAD_NUM)
      } else {
        await this.pushContentToTop(this.SCROLL_LOAD_NUM)
      }
      setTimeout(function() { $state.loaded() }, 1000)
    },
    async pushContentToBottom(numOfImages) {
      const imageArrayToPush = await this.makeImageArray(numOfImages)
      this.pushImages(imageArrayToPush, this.bottomContents)
    },
    async pushContentToTop(numOfImages) {
      const imageArrayToPush = await this.makeImageArray(numOfImages)
      this.pushImages(imageArrayToPush, this.topContents)
    },
    async makeImageArray(numOfImages) {
      const imageArrayToPush = []
      const isUserPage = Object.keys(this.$route.params).length > 0 && this.$route.params.id.indexOf('@') === -1
      if (isUserPage) {
        let results = null
        if (this.currentUser.id) { // TODO] 오래된 accessKey로 api call 하는 문제..Unauthorized 에러남ㅠ, currentAuthenticatedUser로 토큰 리프레시 필요?
          results = await this.getContents('/auth/uploads', numOfImages)
        } else {
          results = await this.getContents('/uploads', numOfImages)
        }

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
      } else { // TODO] 페이지별로 어떤 컨텐츠를 뿌려줄지 여기서 결정하기보단.. following이나 like부터 구현하고
        // api부터 어떻게 할지 정해야할듯. endpoint분리 / 쿼리 최대한 공유하고 queryparam으로 구분
        for (let i = 0; i < numOfImages; i++) {
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
    async getContents(url, numOfImages) {
      let results = await axios.get(url, {
        params: {
          username: this.$route.params.id ? this.$route.params.id : null,
          pageSize: numOfImages,
          lastId: this.lastLoadedId
        }
      })
      results = results.data.data
      this.lastLoadedId = results.length > 0 ? results[results.length - 1].id : null
      this.noMoreDataToLoad = results.length < this.SCROLL_LOAD_NUM
      return results
    },
    getImageUrl(path) {
      const s3Path = parseS3Path(path)
      return `${CLOUDFRONT_URL}/${s3Path.level}/${s3Path.username}/${s3Path.type}/${s3Path.file}`
    },
    pushImages(images, destContainer) {
      let lastImageOfContainer = destContainer[destContainer.length - 1]
      if (lastImageOfContainer) this.resetImageIndexBeforePush(images, lastImageOfContainer)
      for (let i in images) {
        this.pushImage(images[i], destContainer)
      }
    },
    resetImageIndexBeforePush(images, lastImageOfContainer) {
      let lastImageOfContainerCopy = this.deepCopy(lastImageOfContainer)
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
    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj))
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

.top-container {
  margin-top: 10px;
}
</style>
