<template>
  <div>
    <upper-container class="container" :upperImages="upperContents" @image-selected="upperImageSelected" @upper-bottom-images="getUpperBottomImages"></upper-container>
    <content-detail class="container" :image="selectedImage" ref="detail"></content-detail>
    <lower-container class="container" v-if="lowerContents" :lowerImages="lowerContents" @image-selected="lowerImageSelected" @lower-bottom-images="getLowerBottomImages"></lower-container>
    <infinite-loading @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import InfiniteLoading from 'vue-infinite-loading'
import ContentDetail from './ContentDetail'
import UpperContainer from './UpperContainer'
import LowerContainer from './LowerContainer'

export default {
  name: 'ContentList',
  components: {
    ContentDetail, UpperContainer, LowerContainer, InfiniteLoading
  },
  data () {
    return {
      contents: [],
      upperContents: [],
      lowerContents: [],
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
      this.pushImageToContainer(this.contents, imageArrayToPush)
      if (!isUpper) {
        this.pushImageToContainer(this.lowerContents, imageArrayToPush)
      }
      if (isUpper) {
        this.upperContents = JSON.parse(JSON.stringify(this.contents))
      }
    },
    lowerImageSelected (index, upperThanIndex) {
      const lowerContainer = JSON.parse(JSON.stringify(this.lowerContents))
      let upperContainer = JSON.parse(JSON.stringify(this.upperContents))
      upperContainer = this.pushImageToContainer(upperContainer, this.selectedImage)
      this.setSelectedImage(this.lowerContents[index])
      this.splitUpperContentsToContainers(index, upperThanIndex, this.lowerContents, upperContainer, lowerContainer)
    },
    upperImageSelected (index, upperThanIndex) {
      const upperContainer = []
      const lowerContainer = JSON.parse(JSON.stringify(this.contents))
      if (this.selectedImage !== null) {
        this.setSelectedImage(this.upperContents[index])
        this.splitUpperContentsToContainers(index, upperThanIndex, this.upperContents, upperContainer, lowerContainer)
      } else {
        this.setSelectedImage(this.contents[index])
        this.splitUpperContentsToContainers(index, upperThanIndex, this.contents, upperContainer, lowerContainer)
      }
    },
    splitUpperContentsToContainers (selectedIndex, upperThanIndex, contents, containerToPush, containerToSplice) {
      for (let i = 0; i < upperThanIndex.length; i++) {
        containerToPush = this.pushImageToContainer(containerToPush, contents[upperThanIndex[i]])
        if (selectedIndex >= upperThanIndex[upperThanIndex.length - (i + 1)]) {
          containerToSplice.splice(selectedIndex, 1)
          selectedIndex = -1
        }
        containerToSplice.splice(upperThanIndex[upperThanIndex.length - (i + 1)], 1)
      }
      if (upperThanIndex.length === 0) {
        containerToSplice.splice(selectedIndex, 1)
      }
      containerToPush = this.resetImageIndex(containerToPush)
      containerToSplice = this.resetImageIndex(containerToSplice)
      this.upperContents = containerToPush
      this.lowerContents = containerToSplice
    },
    setSelectedImage (image) {
      this.selectedImage = image
    },
    pushImageToContainer (container, images) {
      if (images instanceof Array) {
        if (container !== this.lowerContents) {
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
        console.log(i % bottoms.length)
        if (bottoms[i % bottoms.length] === -2) { // TODO] 붙일때 미세 조정 필요. 바닥쪽 들쭉날쭉한 순서대로 테트리스??
          this.pushImageToContainer(container, images[i])
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
      this.upperBottoms = bottoms // TODO] upperContainer mounted시 80ms timeout이상 주면 정상작동.. 왜지???
    },
    getLowerBottomImages (bottoms) {
      this.lowerBottoms = bottoms
    },
    infiniteHandler ($state) {
      if (this.lowerContents.length > 0) {
        this.pushContentList(this.SCROLL_LOAD_NUM, false)
        this.resetImageIndex(this.lowerContents)
      } else {
        this.pushContentList(this.SCROLL_LOAD_NUM, true)
        this.resetImageIndex(this.upperContents)
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
