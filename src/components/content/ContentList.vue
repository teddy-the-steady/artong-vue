<template>
  <div> <!-- TODO] 컨테이너에 컨텐츠 붙여야할 순서 유지 되어야 함(높이랑 배열순서 계산 필요). 지금은 간단히 배열 뒤에 push중 -->
    <upper-container class="container" :upperImages="upperContents" @image-selected="upperImageSelected"></upper-container>
    <content-detail class="container" :image="selectedImage" ref="detail"></content-detail>
    <lower-container class="container" v-if="lowerContents" :lowerImages="lowerContents" @image-selected="lowerImageSelected"></lower-container>
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
    this.pushContentList(30, true)
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
        let randomInt = this.getRandomIntInclusive(1, 4)
        this.contents.push({
          index: i,
          url: randomInt
        })
        if (!isUpper) {
          this.lowerContents.push({
            index: i,
            url: randomInt
          })
        }
      }
      if (isUpper) {
        this.upperContents = JSON.parse(JSON.stringify(this.contents))
      }
    },
    lowerImageSelected (index, upperThanIndex) {
      const lowerContainer = JSON.parse(JSON.stringify(this.lowerContents))
      let upperContainer = JSON.parse(JSON.stringify(this.upperContents))
      this.setSelectedImage(this.lowerContents[index])
      upperContainer = this.pushImageToContainer(upperContainer, this.selectedImage)
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
      this.resetImageIndex(containerToPush)
      this.resetImageIndex(containerToSplice)
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
    resetImageIndex (container) {
      for (let i in container) {
        container[i].index = i
      }
      return container
    },
    infiniteHandler ($state) {
      if (this.lowerContents.length > 0) {
        this.pushContentList(10, false)
        this.resetImageIndex(this.lowerContents)
      } else {
        this.pushContentList(10, true)
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
