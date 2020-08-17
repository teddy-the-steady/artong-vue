<template>
  <div>
    <top-container class="container" :topImages="topContents" @image-selected="topImageSelected" @low-end-images="getTopEndImages"></top-container>
    <content-detail class="container" :image="selectedImage" ref="detail"></content-detail>
    <bottom-container class="container" v-if="bottomContents" :bottomImages="bottomContents" @image-selected="bottomImageSelected" @both-end-images="getBottomEndImages"></bottom-container>
    <infinite-loading @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import InfiniteLoading from 'vue-infinite-loading'
// import axios from 'axios'
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
      topLowest: [],
      bottomLowest: [],
      bottomHighest: [],
      FIRST_LOAD_NUM: 20,
      SCROLL_LOAD_NUM: 10,
      page: 0
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
      this.pushImageToContainer(imageArrayToPush, this.contents, 'topLowest')
      if (!isUpper) {
        this.pushImageToContainer(imageArrayToPush, this.bottomContents, 'bottomLowest')
      }
      if (isUpper) {
        this.topContents = JSON.parse(JSON.stringify(this.contents))
      }
    },
    // pushContentList (list, isUpper) {
    //   const imageArrayToPush = []
    //   for (let i = 0; i < list.length; i++) {
    //     imageArrayToPush.push({
    //       index: i,
    //       url: list[i].download_url
    //     })
    //   }
    //   this.pushImageToContainer(imageArrayToPush, this.contents, 'topLowest')
    //   if (!isUpper) {
    //     this.pushImageToContainer(imageArrayToPush, this.bottomContents, 'bottomLowest')
    //   }
    //   if (isUpper) {
    //     this.topContents = JSON.parse(JSON.stringify(this.contents))
    //   }
    // },
    bottomImageSelected (selectedIndex, upperThanSelected) {
      const bottomContainer = JSON.parse(JSON.stringify(this.bottomContents))
      let topContainer = JSON.parse(JSON.stringify(this.topContents))
      topContainer = this.pushImageToContainer(this.selectedImage, topContainer)
      this.setSelectedImage(this.bottomContents[selectedIndex])
      this.splitUpperContentsToContainers(this.bottomContents, selectedIndex, topContainer, bottomContainer, upperThanSelected)
    },
    topImageSelected (selectedIndex, lowerThanSelected, upperThanSelected) {
      const isTopImage = upperThanSelected.length === 0
      const topContainer = JSON.parse(JSON.stringify(this.topContents))
      let bottomContainer = JSON.parse(JSON.stringify(this.bottomContents))
      if (this.selectedImage) {
        if (isTopImage) {
          bottomContainer = this.pushImageToContainer(this.selectedImage, bottomContainer)
          this.setSelectedImage(this.topContents[selectedIndex])
          this.splitUpperContentsToContainers(this.topContents, selectedIndex, bottomContainer, topContainer, upperThanSelected, lowerThanSelected)
        } else {
          this.splitLowerContentsToContainers(this.topContents, selectedIndex, topContainer, lowerThanSelected)
        }
      } else {
        this.setSelectedImage(this.topContents[selectedIndex])
        this.splitUpperContentsToContainers(this.topContents, selectedIndex, bottomContainer, topContainer, upperThanSelected, lowerThanSelected)
      }
    },
    splitUpperContentsToContainers (contents, selectedIndex, containerToPush, containerToSplice, upperThanSelected, lowerThanSelected) {
      const isTopImage = upperThanSelected.length === 0
      const isContainerToPushEmpty = containerToPush.length === 0
      if (!isContainerToPushEmpty && !isTopImage) {
        const images = []
        upperThanSelected.forEach((image) => {
          images.push(contents[image])
        })
        containerToPush = this.pushImageToContainer(images, containerToPush, 'topLowest')
        for (let i = 0; i < upperThanSelected.length; i++) {
          if (parseInt(selectedIndex) > parseInt(upperThanSelected[upperThanSelected.length - (i + 1)])) {
            containerToSplice.splice(selectedIndex, 1)
            selectedIndex = -1
          }
          containerToSplice.splice(upperThanSelected[upperThanSelected.length - (i + 1)], 1)
        }
      } else {
        for (let i = 0; i < upperThanSelected.length; i++) {
          containerToPush = this.pushImageToContainer(contents[upperThanSelected[i]], containerToPush)
          if (parseInt(selectedIndex) > parseInt(upperThanSelected[upperThanSelected.length - (i + 1)])) {
            containerToSplice.splice(selectedIndex, 1)
            selectedIndex = -1
          }
          containerToSplice.splice(upperThanSelected[upperThanSelected.length - (i + 1)], 1)
        }
        if (isTopImage) {
          if (lowerThanSelected === undefined) {
            containerToSplice.splice(selectedIndex, 1)
          } else {
            containerToSplice.splice(selectedIndex, 1)
            contents.splice(selectedIndex, 1)
            containerToPush = this.pushImageToContainer(contents, containerToPush, 'bottomLowest') // TODO] attachImageToContainerHead를 태울것인가.. lowerThanSelected 아래에 pushImageToContainer 할것인가
            containerToPush = this.resetImageIndex(containerToPush)
            containerToSplice = this.resetImageIndex(containerToSplice)
            this.topContents = []
            this.bottomContents = containerToPush
            return
          }
        }
      }
      containerToPush = this.resetImageIndex(containerToPush)
      containerToSplice = this.resetImageIndex(containerToSplice)
      this.topContents = containerToPush
      this.bottomContents = containerToSplice
    },
    splitLowerContentsToContainers (contents, selectedIndex, containerToSplice, lowerThanSelected) {
      const isBottomImage = lowerThanSelected.length === 0
      let containerToPush = []
      containerToPush = this.pushImageToContainer(this.selectedImage, containerToPush)
      this.setSelectedImage(this.topContents[selectedIndex])
      for (let i = 0; i < lowerThanSelected.length; i++) {
        containerToPush = this.pushImageToContainer(contents[lowerThanSelected[i]], containerToPush)
        containerToSplice.splice(lowerThanSelected[lowerThanSelected.length - (i + 1)], 1)
        if (parseInt(selectedIndex) > parseInt(lowerThanSelected[lowerThanSelected.length - (i + 1)]) ||
            parseInt(selectedIndex) === parseInt(lowerThanSelected[lowerThanSelected.length - (i + 1)]) - 1) {
          containerToSplice.splice(selectedIndex, 1)
          selectedIndex = -1
        }
      }
      if (isBottomImage) {
        containerToSplice.splice(selectedIndex, 1)
      }
      containerToPush = this.pushImageToContainer(this.bottomContents, containerToPush, 'bottomLowest')

      containerToPush = this.resetImageIndex(containerToPush)
      containerToSplice = this.resetImageIndex(containerToSplice)
      this.bottomContents = containerToPush
      this.topContents = containerToSplice
    },
    setSelectedImage (image) {
      this.selectedImage = image
    },
    pushImageToContainer (images, container, topOrBottom) {
      if (images.length > 0) {
        switch (topOrBottom) {
          case 'topLowest':
            this.attachImageToContainerTail(images, container, this.topLowest)
            break
          case 'bottomLowest':
            this.attachImageToContainerTail(images, container, this.bottomLowest)
            break
          default:
            this.attachImageToContainerHead(images, container, this.bottomHighest)
            break
        }
      } else {
        container.push(images)
      }
      return container
    },
    attachImageToContainerTail (images, container, lowest) {
      for (let i = 0; i < images.length; i++) {
        if (lowest.length === 0 || lowest[i % lowest.length] === -2) { // TODO] 붙일때 미세 조정 필요. 바닥쪽 들쭉날쭉한 순서대로 테트리스??
          this.pushImageToContainer(images[i], container)
        } else {
          container.splice(lowest[i % lowest.length] + 1, 0, images[i])
        }
      }
    },
    attachImageToContainerHead (images, container, highest) {
      console.log(highest)
    },
    resetImageIndex (container) {
      for (let i in container) {
        container[i].index = i
      }
      return container
    },
    getTopEndImages (lowest) {
      this.topLowest = lowest // TODO] topContainer mounted시 100ms timeout이상 주면 정상작동.. 왜지???
    },
    getBottomEndImages (lowest, highest) {
      this.bottomLowest = lowest
      this.bottomHighest = highest
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
    // infiniteHandler ($state) {
    //   axios.get('https://picsum.photos/v2/list', {
    //     params: {
    //       page: this.page,
    //       limit: 20
    //     }
    //   }).then(({data}) => {
    //     if (data.length) {
    //       this.page += 1
    //       if (this.bottomContents.length > 0) {
    //         this.pushContentList(data, false)
    //         this.resetImageIndex(this.bottomContents)
    //       } else if (this.selectedImage) {
    //         this.pushContentList(data, false)
    //         this.resetImageIndex(this.bottomContents)
    //       } else {
    //         this.pushContentList(data, true)
    //         this.resetImageIndex(this.topContents)
    //       }
    //       $state.loaded()
    //     } else {
    //       $state.complete()
    //     }
    //   })
    // }
  },
  mounted () {
    this.$watch(
      () => { return this.$refs.detail.image },
      (val) => {
        const detail = this.$refs.detail.$el
        const detailPosition = detail.offsetTop
        const headerOffset = 55
        const offsetPosition = detailPosition - headerOffset
        let option = {
          top: offsetPosition
        }
        if (navigator.userAgent.indexOf('Mobile') !== -1) {
          detail.scrollIntoView({block: 'center', behavior: 'auto'})
        } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
          option.behavior = 'smooth'
          window.scrollTo(option)
        } else {
          option.behavior = 'auto'
          window.scrollTo(option)
        }
        setTimeout(function () {
          const detailTop = detail.getBoundingClientRect().top
          if (detailTop < 54 || detailTop > 56) {
            window.scrollTo({
              top: detailPosition + detailTop - 110,
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
  column-width: 200px;
  padding: 0 1rem;
}

@media only screen and (max-width: 599px) {
  .container {
    column-width: 130px;
  }
}
</style>
