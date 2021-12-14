<template>
  <div>
    <top-container class="top-container" :topImages="topContents" :selectedImage="selectedImage"
      @image-selected="onTopImageSelect"></top-container>
    <center-container :image="selectedImage" ref="center"></center-container>
    <bottom-container v-if="bottomContents" :bottomImages="bottomContents"
      @image-selected="onBottomImageSelect"></bottom-container>
  </div>
</template>

<script>
import { Storage } from 'aws-amplify'
import axios from 'axios'
import CenterContainer from './CenterContainer'
import TopContainer from './TopContainer'
import BottomContainer from './BottomContainer'
import { parseS3Path } from '../../util/commonFunc'

export default {
  name: 'ContentListV2', // TODO] virtual-scroll 적용 https://github.com/Akryum/vue-virtual-scroller 혹은 https://github.com/tangbc/vue-virtual-scroll-list
  // 2021-09-20 masonry랑 virtual-scroll를 통합하는 문제로 중단
  components: {
    CenterContainer, TopContainer, BottomContainer
  },
  data() {
    return {
      topContents: [],
      bottomContents: [],
      selectedImage: null,
      SCROLL_LOAD_NUM: 20,
      lastLoadedId: null
    }
  },
  methods: {
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
      if (Object.keys(this.$route.params).length > 0 && this.$route.params.id.indexOf('@') === -1) {
        const results = await this.getContents(numOfImages)
        if (results) {
          for (let i = 0; i < results.length; i++) {
            imageArrayToPush.push({
              index: i,
              id: results[i].id,
              url: await this.getContentFromS3(results[i].thumbnail_url)
            })
          }
        }
      } else {
        for (let i = 0; i < numOfImages; i++) {
          const randomInt = this.getRandomIntInclusive(11, 20)
          imageArrayToPush.push({
            index: i,
            url: randomInt
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
    async getContents(numOfImages) {
      let results = await axios.get('/contents', {
        params: {
          username: this.$route.params.id,
          pageSize: numOfImages,
          lastId: this.lastLoadedId
        }
      })
      results = results.data.data
      this.lastLoadedId = results.length > 0 ? results[results.length - 1].id : null
      return results
    },
    async getContentFromS3(url) {
      const s3Path = parseS3Path(url)
      const content = await Storage.get(`${s3Path.username}/${s3Path.type}/${s3Path.file}`)
      return content
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
  async created() {
    await this.pushContentToTop(this.SCROLL_LOAD_NUM)
  },
  mounted() {
    this.$watch(
      () => { return this.$refs.center.image },
      (val) => {
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
            option.behavior = 'smooth'
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
