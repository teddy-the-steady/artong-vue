<template>
  <div>
    <div class="content" v-for="(val, i) in lowerImages" :key="i" ref="content">
      <content-box :image="val" @image-selected="imageSelected"></content-box>
    </div>
  </div>
</template>

<script>
import ContentBox from './ContentBox'
export default {
  name: 'LowerContainer',
  components: {
    ContentBox
  },
  props: {
    lowerImages: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      upperThanSelected: [],
      bottoms: [],
      tops: []
    }
  },
  methods: {
    imageSelected (index) {
      this.upperThanSelected = []
      const selectedTop = this.$refs.content[index].getBoundingClientRect().top
      for (let i in this.lowerImages) {
        let contentTop = this.$refs.content[i].getBoundingClientRect().top
        if (selectedTop > contentTop) {
          this.upperThanSelected.push(i)
        }
      }
      this.$emit('image-selected', index, this.upperThanSelected)
    },
    getBottoms () {
      this.bottoms = []
      this.getTops()
      for (let i = 1; i < this.tops.length; i++) {
        this.bottoms.push(this.tops[i] - 1)
      }
      this.bottoms.push(-2)
      this.$emit('lower-bottom-images', this.bottoms)
    },
    getTops () {
      this.tops = []
      if (this.lowerImages.length > 0) {
        const firstTop = this.$refs.content[0].getBoundingClientRect().top
        for (let i in this.lowerImages) {
          let contentTop = this.$refs.content[i].getBoundingClientRect().top
          if (firstTop === contentTop) {
            this.tops.push(i)
          }
        }
      }
    }
  },
  updated () {
    this.getBottoms()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.content {
  display: inline-block;
  overflow: hidden;
  border-radius: 10px;
  margin: 0.5rem;
  max-height: 300px
}
</style>
