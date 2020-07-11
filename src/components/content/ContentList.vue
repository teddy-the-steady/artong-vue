<template>
  <div>
    <upper-container class="container" :upperImages="upperContents" @image-selected="upperImageSelected"></upper-container>
    <content-detail class="container" :image="selectedImage" ref="detail"></content-detail>
    <lower-container class="container" :lowerImages="lowerContents" @image-selected="lowerImageSelected"></lower-container>
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
      selectedImage: null
    }
  },
  created () {
    this.findUser()
    this.pushContentList(20, true)
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
      for (let i = 0; i < count; i++) {
        this.contents.push({
          index: i,
          url: this.getRandomIntInclusive(1, 4)
        })
      }
      isUpper ? this.upperContents = this.contents : this.lowerContents = this.contents
    },
    lowerImageSelected (index, upperThanIndex) { // TODO] 위에 붙여야할 순서 유지 되어야 함(높이랑 배열순서 계산 필요). 지금은 배열 뒤에 push..
      let lowerContainer = JSON.parse(JSON.stringify(this.lowerContents))
      this.upperContents = this.pushImageToContainer(this.upperContents, this.selectedImage) // TODO] 위에 붙일때 순서 고려하기
      this.setSelectedImage(this.lowerContents[index])
      this.splitUpperContentsToContainers(index, upperThanIndex, this.lowerContents, this.upperContents, lowerContainer)
    },
    upperImageSelected (index, upperThanIndex) {
      let upperContainer = []
      let lowerContainer = JSON.parse(JSON.stringify(this.contents))
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
      for (let i in containerToPush) {
        containerToPush[i].index = i
      }
      for (let i in containerToSplice) {
        containerToSplice[i].index = i
      }
      this.upperContents = containerToPush
      this.lowerContents = containerToSplice
    },
    setSelectedImage (image) {
      this.selectedImage = image
    },
    pushImageToContainer (container, image) {
      container.push(image)
      return container
    },
    infiniteHandler ($state) {
      this.pushContentList(10, false)
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
