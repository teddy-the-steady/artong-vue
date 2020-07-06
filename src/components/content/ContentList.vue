<template>
  <div>
    <upper-container class="container" :upperImages="upperContents" @image-selected="upperImageSelected"></upper-container>
    <content-detail class="container" v-if="selectedImage" :image="selectedImage" ref="detail"></content-detail>
    <lower-container class="container" :lowerImages="lowerContents" @image-selected="lowerImageSelected"></lower-container>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import ContentDetail from './ContentDetail'
import UpperContainer from './UpperContainer'
import LowerContainer from './LowerContainer'
export default {
  name: 'ContentList',
  components: {
    ContentDetail, UpperContainer, LowerContainer
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
    this.pushContentList()
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
    pushContentList () {
      for (let i = 0; i < 50; i++) {
        this.contents.push({
          index: i,
          url: this.getRandomIntInclusive(1, 4)
        })
      }
      this.upperContents = this.contents
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
          selectedIndex = -1 // if문 한번만 타기위함
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
    }
  },
  updated () {
    this.$refs.detail.$el.scrollIntoView({behavior: 'smooth', block: 'center'})
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
