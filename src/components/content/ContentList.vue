<template>
  <div>
    <top-container class="container" :upperImages="topContents" @image-selected="upperImageSelected" @bottom-images="getUpperBottomImages"></top-container>
    <content-detail class="container" :image="selectedImage" ref="detail"></content-detail>
    <bottom-container class="container" v-if="bottomContents" :lowerImages="bottomContents" @image-selected="lowerImageSelected" @bottom-images="getLowerBottomImages"></bottom-container>
    <infinite-loading @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import InfiniteLoading from 'vue-infinite-loading'
import ContentDetail from './ContentDetail'
import TopContainer from './TopContainer'
import BottomContainer from './BottomContainer'

export default {
  name: 'ContentList',
  components: {
    ContentDetail, TopContainer, BottomContainer, InfiniteLoading
  },
  data () {
    return {
      contents: [],
      topContents: [],
      bottomContents: [],
      selectedImage: null,
      upperBottoms: [],
      lowerBottoms: [],
      FIRST_LOAD_NUM: 20,
      SCROLL_LOAD_NUM: 10
    }
  },
  created () {
    this.findUser()
    this.pushContentList(this.FIRST_LOAD_NUM, true)
  },
  methods: {
    async findUser () {
      try {
        const user = await Auth.currentAuthenticatedUser()
        this.$store.state.signedIn = true
        this.$store.state.user = user
      } catch (err) {
        this.$store.state.signedIn = false
        this.$store.state.user = null
      }
    },
    getRandomIntInclusive (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      const result = Math.floor(Math.random() * (max - min + 1)) + min
      return result
    },
    pushContentList (count, isUpper) {
      const imageArrayToPush = []
      for (let i = 0; i < count; i++) {
        const randomInt = this.getRandomIntInclusive(1, 10)
        imageArrayToPush.push({
          index: i,
          url: randomInt
        })
      }
      this.pushImageToContainer(imageArrayToPush, this.contents)
      if (!isUpper) {
        this.pushImageToContainer(imageArrayToPush, this.bottomContents)
      }
      if (isUpper) {
        this.topContents = JSON.parse(JSON.stringify(this.contents))
      }
    },
    lowerImageSelected (selectedIndex, upperThanSelected) {
      const bottomContainer = JSON.parse(JSON.stringify(this.bottomContents))
      let topContainer = JSON.parse(JSON.stringify(this.topContents))
      topContainer = this.pushImageToContainer(this.selectedImage, topContainer)
      this.setSelectedImage(this.bottomContents[selectedIndex])
      this.splitUpperContentsToContainers(this.bottomContents, selectedIndex, upperThanSelected, topContainer, bottomContainer)
    },
    upperImageSelected (selectedIndex, lowerThanSelected, upperThanSelected) { // TODO] 이미지 하나씩 컨테이너 끝에 푸시 말고 배열로 컨테이너 위에 붙여야함
      let topContainer = JSON.parse(JSON.stringify(this.topContents))
      let bottomContainer = JSON.parse(JSON.stringify(this.bottomContents))
      if (this.selectedImage) {
        if (upperThanSelected.length === 0) {
          topContainer = JSON.parse(JSON.stringify(this.contents))
          bottomContainer = []
          this.setSelectedImage(this.topContents[selectedIndex])
          this.splitUpperContentsToContainers(this.topContents, selectedIndex, upperThanSelected, bottomContainer, topContainer)
        } else {
          bottomContainer = this.pushImageToContainer(this.selectedImage, bottomContainer)
          this.setSelectedImage(this.topContents[selectedIndex])
          this.splitLowerContentsToContainers(this.topContents, selectedIndex, lowerThanSelected, bottomContainer, topContainer)
        }
      } else {
        this.setSelectedImage(this.topContents[selectedIndex])
        this.splitUpperContentsToContainers(this.topContents, selectedIndex, upperThanSelected, bottomContainer, topContainer)
      }
    },
    splitUpperContentsToContainers (contents, selectedIndex, upperThanSelected, containerToPush, containerToSplice) {
      for (let i = 0; i < upperThanSelected.length; i++) {
        containerToPush = this.pushImageToContainer(contents[upperThanSelected[i]], containerToPush)
        if (parseInt(selectedIndex) > parseInt(upperThanSelected[upperThanSelected.length - (i + 1)])) {
          containerToSplice.splice(selectedIndex, 1)
          selectedIndex = -1
        }
        containerToSplice.splice(upperThanSelected[upperThanSelected.length - (i + 1)], 1)
      }
      if (upperThanSelected.length === 0) {
        containerToSplice.splice(selectedIndex, 1)
      }
      containerToPush = this.resetImageIndex(containerToPush)
      containerToSplice = this.resetImageIndex(containerToSplice)
      this.topContents = containerToPush
      this.bottomContents = containerToSplice
    },
    splitLowerContentsToContainers (contents, selectedIndex, lowerThanSelected, containerToPush, containerToSplice) {
      for (let i = 0; i < lowerThanSelected.length; i++) {
        containerToPush = this.pushImageToContainer(contents[lowerThanSelected[i]], containerToPush)
        containerToSplice.splice(lowerThanSelected[lowerThanSelected.length - (i + 1)], 1)
        if (parseInt(selectedIndex) > parseInt(lowerThanSelected[lowerThanSelected.length - (i + 1)]) ||
            parseInt(selectedIndex) === parseInt(lowerThanSelected[lowerThanSelected.length - (i + 1)]) - 1) {
          containerToSplice.splice(selectedIndex, 1)
          selectedIndex = -1
        }
      }
      if (lowerThanSelected.length === 0) {
        containerToSplice.splice(selectedIndex, 1)
      }
      containerToPush = this.resetImageIndex(containerToPush)
      containerToSplice = this.resetImageIndex(containerToSplice)
      this.bottomContents = containerToPush
      this.topContents = containerToSplice
    },
    setSelectedImage (image) {
      this.selectedImage = image
    },
    pushImageToContainer (images, container) {
      if (images instanceof Array) {
        if (container !== this.bottomContents) {
          this.attachImageToContainerTail(container, images, this.upperBottoms)
        } else {
          this.attachImageToContainerTail(container, images, this.lowerBottoms)
        }
      } else {
        container.push(images)
      }
      return container
    },
    attachImageToContainerTail (container, images, bottoms) {
      for (let i = 0; i < images.length; i++) {
        if (bottoms.length === 0 || bottoms[i % bottoms.length] === -2) { // TODO] 붙일때 미세 조정 필요. 바닥쪽 들쭉날쭉한 순서대로 테트리스??
          this.pushImageToContainer(images[i], container)
        } else {
          container.splice(bottoms[i % bottoms.length] + 1, 0, images[i])
        }
      }
    },
    resetImageIndex (container) {
      for (let i in container) {
        container[i].index = i
      }
      return container
    },
    getUpperBottomImages (bottoms) {
      this.upperBottoms = bottoms // TODO] topContainer mounted시 80ms timeout이상 주면 정상작동.. 왜지???
    },
    getLowerBottomImages (bottoms) {
      this.lowerBottoms = bottoms
    },
    infiniteHandler ($state) {
      if (this.bottomContents.length > 0) {
        this.pushContentList(this.SCROLL_LOAD_NUM, false)
        this.resetImageIndex(this.bottomContents)
      } else if (this.selectedImage) {
        this.pushContentList(this.SCROLL_LOAD_NUM, false)
        this.resetImageIndex(this.bottomContents)
      } else {
        this.pushContentList(this.SCROLL_LOAD_NUM, true)
        this.resetImageIndex(this.topContents)
      }
      setTimeout(function () { $state.loaded() }, 2000)
    }
  },
  mounted () {
    this.$watch(
      () => { return this.$refs.detail.image },
      (val) => { this.$refs.detail.$el.scrollIntoView({behavior: 'smooth', block: 'center'}) }
    )
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  column-width: 200px;
  padding: 0 1rem;
}

@media only screen and (max-width: 599px) {
  .container {
    column-width: 130px;
  }
}
</style>
