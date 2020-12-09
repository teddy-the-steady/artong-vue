<template>
  <div>
    <top-container class="container" :topImages="topContents"
      @image-selected="onTopImageSelected"></top-container>
    <center-container class="container" :image="selectedImage" ref="center"></center-container>
    <bottom-container class="container" v-if="bottomContents" :bottomImages="bottomContents"
      @image-selected="onBottomImageSelected"></bottom-container>
    <infinite-loading @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import InfiniteLoading from 'vue-infinite-loading'
import CenterContainer from './CenterContainer'
import TopContainer from './TopContainer'
import BottomContainer from './BottomContainer'

export default {
  name: 'ContentList',
  components: {
    CenterContainer, TopContainer, BottomContainer, InfiniteLoading
  },
  data() {
    return {
      topContents: [],
      bottomContents: [],
      selectedImage: null,
      FIRST_LOAD_NUM: 20,
      SCROLL_LOAD_NUM: 10
    }
  },
  methods: {
    async findUser() {
      try {
        const user = await Auth.currentAuthenticatedUser()
        this.$store.state.signedIn = true
        this.$store.state.user = user
      } catch (err) {
        this.$store.state.signedIn = false
        this.$store.state.user = null
      }
    },
    infiniteHandler($state) {
      if (this.bottomContents.length > 0) {
        this.pushContentToBottom(this.SCROLL_LOAD_NUM)
      } else if (this.selectedImage) {
        this.pushContentToBottom(this.SCROLL_LOAD_NUM)
      } else {
        this.pushContentToTop(this.SCROLL_LOAD_NUM)
      }
      setTimeout(function() { $state.loaded() }, 2000)
    },
    pushContentToTop(numOfImages) {
      const imageArrayToPush = this.makeImageArray(numOfImages)
      this.pushImages(imageArrayToPush, this.topContents)
    },
    pushContentToBottom(numOfImages) {
      const imageArrayToPush = this.makeImageArray(numOfImages)
      this.pushImages(imageArrayToPush, this.bottomContents)
    },
    getRandomIntInclusive(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      const result = Math.floor(Math.random() * (max - min + 1)) + min
      return result
    },
    makeImageArray(numOfImages) {
      const imageArrayToPush = []
      for (let i = 0; i < numOfImages; i++) {
        const randomInt = this.getRandomIntInclusive(11, 20)
        imageArrayToPush.push({
          index: i,
          url: randomInt
        })
      }
      return imageArrayToPush
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
    prependImages(images, destContainer) {
      for (let i = images.length - 1; i >= 0; i--) {
        this.prependImage(images[i], destContainer)
      }
      this.resetImageIndex(destContainer)
    },
    resetImageIndex(container) {
      for (let i in container) {
        container[i].index = i
      }
    },
    prependImage(image, destContainer) {
      destContainer.unshift(image)
    },
    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    onBottomImageSelected(selectedIndex) {
      const topContentsTail = this.bottomContents.slice(0, selectedIndex)
      const selectedImage = this.bottomContents[selectedIndex]
      this.bottomContents.splice(0, selectedIndex + 1)
      this.resetImageIndex(this.bottomContents)
      this.pushImage(this.selectedImage, this.topContents)
      this.pushImages(topContentsTail, this.topContents)
      this.setSelectedImage(selectedImage)
    },
    onTopImageSelected(selectedIndex) {
      const bottomContentsHead = this.topContents.slice(selectedIndex + 1)
      const selectedImage = this.topContents[selectedIndex]
      this.topContents.splice(selectedIndex)
      if (this.selectedImage) {
        this.prependImage(this.selectedImage, this.bottomContents)
      }
      this.prependImages(bottomContentsHead, this.bottomContents)
      this.setSelectedImage(selectedImage)
    },
    setSelectedImage(image) {
      this.selectedImage = image
    }
  },
  created() {
    this.findUser()
    this.pushContentToTop(this.FIRST_LOAD_NUM)
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
            option.behavior = 'smooth' // TODO] 안드로이드 스크롤 이상함
            window.scrollTo(option)
            return
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
.container {
  display: inline-block;
}
</style>
