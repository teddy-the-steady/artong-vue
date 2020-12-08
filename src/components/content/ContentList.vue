<template>
  <div>
    <top-container class="container" :topImages="topContents"
      @image-selected="onTopImageSelected" @set-top-lowest-images="setTopLowestImages"
      @set-upper-than-selected="setUpperThanSelected" @set-lower-than-selected="setLowerThanSelected"></top-container>
    <center-container class="container" :image="selectedImage" ref="center"></center-container>
    <bottom-container class="container" v-if="bottomContents" :bottomImages="bottomContents"
      @image-selected="onBottomImageSelected" @set-bottom-end-images="setBottomEndImages"
      @set-upper-than-selected="setUpperThanSelected" @set-lower-than-selected="setLowerThanSelected"></bottom-container>
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
      contents: [],
      topContents: [],
      bottomContents: [],
      selectedImage: null,
      topLowest: [],
      bottomLowest: [],
      bottomHighest: [],
      upperThanSelected: [],
      lowerThanSelected: [],
      FIRST_LOAD_NUM: 20,
      SCROLL_LOAD_NUM: 10,
      LAST_OF_LOWEST: -2,
      page: 0,
      scrollPosition: 0
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
        this.resetImageIndex(this.bottomContents)
      } else if (this.selectedImage) {
        this.pushContentToBottom(this.SCROLL_LOAD_NUM)
        this.resetImageIndex(this.bottomContents)
      } else {
        this.pushContentToTop(this.SCROLL_LOAD_NUM)
        this.resetImageIndex(this.topContents)
      }
      setTimeout(function() { $state.loaded() }, 2000)
    },
    pushContentToTop(numOfImages) {
      const imageArrayToPush = this.makeImageArray(numOfImages)
      this.pushImagesToTopLowest(imageArrayToPush, this.contents)
      this.topContents = this.deepCopy(this.contents)
    },
    pushContentToBottom(numOfImages) {
      const imageArrayToPush = this.makeImageArray(numOfImages)
      this.pushImagesToTopLowest(imageArrayToPush, this.contents)
      this.pushImagesToBottomLowest(imageArrayToPush, this.bottomContents)
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
    pushImagesFromSourceToDest(images, sourceContainer, destContainer) {
      sourceContainer.forEach((image) => {
        destContainer.push(images[image])
      })
    },
    pushImage(images, destContainer) {
      destContainer.push(images)
    },
    pushImagesToTopLowest(images, destContainer) {
      this.attachImageToContainerTail(images, destContainer, this.topLowest)
    },
    pushImagesToBottomLowest(images, destContainer) {
      this.attachImageToContainerTail(images, destContainer, this.bottomLowest)
    },
    pushImagesToBottomHighest(images, destContainer) {
      this.attachImageToContainerHead(images, destContainer, this.bottomHighest)
    },
    attachImageToContainerTail(images, container, lowest) {
      for (let i = 0; i < images.length; i++) {
        this.pushImage(images[i], container)
      }
    },
    attachImageToContainerHead(images, container, highest) {
      console.log(highest)
    },
    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    setUpperThanSelected(upperThanSelected) {
      this.upperThanSelected = upperThanSelected
    },
    setLowerThanSelected(lowerThanSelected) {
      this.lowerThanSelected = lowerThanSelected
    },
    // TODO] 소스공사 많이 해야할듯..
    // a1
    // a23
    // b23 bottomHighest에 붙여야
    // c4
    // c45
    // d2
    // d23
    onBottomImageSelected(selectedIndex) {
      console.log('a')
      const bottomContainer = this.deepCopy(this.bottomContents)
      const topContainer = this.deepCopy(this.topContents)
      this.pushImage(this.selectedImage, topContainer)
      this.setSelectedImage(this.bottomContents[selectedIndex])
      this.splitUpperContents(this.bottomContents, selectedIndex, topContainer, bottomContainer)
    },
    onTopImageSelected(selectedIndex) {
      const topContainer = this.deepCopy(this.topContents)
      const bottomContainer = this.deepCopy(this.bottomContents)
      if (this.selectedImage) {
        if (this.isHighestImage()) {
          console.log('b')
          this.pushImage(this.selectedImage, bottomContainer)
          this.setSelectedImage(this.topContents[selectedIndex])
          this.splitUpperContents(this.topContents, selectedIndex, bottomContainer, topContainer)
        } else {
          console.log('c')
          let containerToPush = []
          this.pushImage(this.selectedImage, containerToPush)
          this.setSelectedImage(this.topContents[selectedIndex])
          this.splitLowerContents(this.topContents, selectedIndex, containerToPush, topContainer)
        }
      } else {
        console.log('d')
        this.setSelectedImage(this.topContents[selectedIndex])
        this.splitUpperContents(this.topContents, selectedIndex, bottomContainer, topContainer)
      }
    },
    splitUpperContents(contents, selectedIndex, containerToPush, containerToSplice) {
      const isContainerToPushEmpty = containerToPush.length === 0
      if (!isContainerToPushEmpty && !this.isHighestImage()) {
        console.log('1')
        let images = []
        this.pushImagesFromSourceToDest(contents, this.upperThanSelected, images)
        this.pushImagesToTopLowest(images, containerToPush)
        for (let i = 0; i < this.upperThanSelected.length; i++) {
          if (selectedIndex > this.upperThanSelected[this.upperThanSelected.length - (i + 1)]) {
            containerToSplice.splice(selectedIndex, 1)
            selectedIndex = -1
          }
          containerToSplice.splice(this.upperThanSelected[this.upperThanSelected.length - (i + 1)], 1)
        }
      } else {
        console.log('2')
        for (let i = 0; i < this.upperThanSelected.length; i++) {
          this.pushImage(contents[this.upperThanSelected[i]], containerToPush)
          if (selectedIndex > this.upperThanSelected[this.upperThanSelected.length - (i + 1)]) {
            containerToSplice.splice(selectedIndex, 1)
            selectedIndex = -1
          }
          containerToSplice.splice(this.upperThanSelected[this.upperThanSelected.length - (i + 1)], 1)
        }
        if (this.isHighestImage()) {
          console.log('3')
          containerToSplice.splice(selectedIndex, 1)
          if (this.lowerThanSelected !== null && this.lowerThanSelected.length >= 0) {
            contents.splice(selectedIndex, 1)
            this.pushImagesToBottomLowest(contents, containerToPush) // TODO] b23으로 타는 경우 attachImageToContainerHead를 태울것인가.. lowerThanSelected 아래에 pushImageToContainer 할것인가
            this.resetImageIndex(containerToPush)
            this.resetImageIndex(containerToSplice)
            this.setTopContents([])
            this.setBottomContents(containerToPush)
            return
          }
        }
      }
      this.resetImageIndex(containerToPush)
      this.resetImageIndex(containerToSplice)
      this.setTopContents(containerToPush)
      this.setBottomContents(containerToSplice)
    },
    splitLowerContents(contents, selectedIndex, containerToPush, containerToSplice) {
      console.log('4')
      for (let i = 0; i < this.lowerThanSelected.length; i++) {
        this.pushImage(contents[this.lowerThanSelected[i]], containerToPush)
        containerToSplice.splice(this.lowerThanSelected[this.lowerThanSelected.length - (i + 1)], 1)
        if (selectedIndex > this.lowerThanSelected[this.lowerThanSelected.length - (i + 1)] ||
            selectedIndex === this.lowerThanSelected[this.lowerThanSelected.length - (i + 1)] - 1) {
          containerToSplice.splice(selectedIndex, 1)
          selectedIndex = -1
        }
      }
      if (this.isLowestImage()) {
        console.log('5')
        containerToSplice.splice(selectedIndex, 1)
      }
      this.pushImagesToBottomLowest(this.bottomContents, containerToPush)

      this.resetImageIndex(containerToPush)
      this.resetImageIndex(containerToSplice)
      this.setBottomContents(containerToPush)
      this.setTopContents(containerToSplice)
    },
    setTopContents(container) {
      this.topContents = container
    },
    setBottomContents(container) {
      this.bottomContents = container
    },
    isHighestImage() {
      return this.upperThanSelected.length === 0
    },
    isLowestImage() {
      return this.lowerThanSelected.length === 0
    },
    setSelectedImage(image) {
      this.selectedImage = image
    },
    resetImageIndex(container) {
      for (let i in container) {
        container[i].index = i
      }
    },
    setTopLowestImages(lowest) {
      this.topLowest = lowest // TODO] topContainer mounted시 100ms timeout이상 주면 정상작동.. 왜지???
    },
    setBottomEndImages(lowest, highest) {
      this.bottomLowest = lowest
      this.bottomHighest = highest
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
</style>
