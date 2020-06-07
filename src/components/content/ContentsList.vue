<template>
  <div>
    <div v-for="(value, i) in containers" :key="i">
      <div class="container">
        <div v-for="(val, j) in value" :key="j" class="content">
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
    imageSelected (val) {
      // TODO] 포지션, 순서 계산해서 위치에 맞게 split해주기..
      this.containers = [this.images]
      this.splitImages(val)
      console.log(val)
      console.log(this.containers)
    },
    splitImages (val) {
      this.upperImages = this.images.slice(0, val)
      this.containers[0] = this.upperImages

      this.selectedImage = this.images.slice(val, val + 1)
      this.containers.push(this.selectedImage)

      this.lowerImages = this.images.slice(val + 1)
      this.containers.push(this.lowerImages)
    }
  },
  mounted () {
    this.$store.commit('setBrowserNavTrue')
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

@media only screen and (max-width: 599px) {
  .container {
    column-width: 130px;
  }
}
</style>
