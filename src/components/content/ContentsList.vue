<template>
  <div>
    <div v-for="(value, i) in containers" :key="i" ref="container">
      <div id="hi" class="container">
        <div v-for="(val, j) in value" :key="j" class="content" :class="i===1?'big':''" ref="content">
          <content-box :image="val" @image-selected="imageSelected"></content-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import ContentBox from './ContentBox'
export default {
  name: 'ContentsList',
  components: {
    ContentBox
  },
  data () {
    return {
      containers: [],
      images: [],
      selectedImage: [],
      upperImages: [],
      lowerImages: []
    }
  },
  created () {
    this.findUser()
    this.pushImageList()
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
    pushImageList () {
      for (let i = 0; i < 50; i++) {
        this.images.push({
          index: i,
          url: this.getRandomIntInclusive(1, 4)
        })
      }
      this.containers.push(this.images)
    },
    imageSelected (index, top) {
      this.containers = [this.images]
      this.upperImages = []
      this.selectedImage = []
      this.lowerImages = []
      this.splitImages(index, top)
    },
    splitImages (index, top) {
      for (let i = 0; i < this.$refs.content.length; i++) {
        if (i === index) {
          this.selectedImage.push(this.images[i])
        } else {
          if (top <= this.$refs.content[i].getBoundingClientRect().top) {
            this.lowerImages.push(this.images[i])
          } else if (top > this.$refs.content[i].getBoundingClientRect().top) {
            this.upperImages.push(this.images[i])
          }
        }
      }
      this.containers[0] = this.upperImages
      this.containers[1] = this.selectedImage
      this.containers[2] = this.lowerImages
    }
  },
  updated () {
    this.$refs.container[1].scrollIntoView({behavior: 'smooth', block: 'center'})
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  column-width: 200px;
  padding: 0 1rem;
}

.content {
  display: inline-block;
  overflow: hidden;
  border-radius: 10px;
  margin: 0.5rem;
  max-height: 300px
}

.big {
  width: 200%;
  max-height: 100%;
}

@media only screen and (max-width: 599px) {
  .container {
    column-width: 130px;
  }
}
</style>
