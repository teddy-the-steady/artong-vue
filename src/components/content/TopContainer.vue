<template>
  <div>
    <div class="content" v-for="(val, i) in topImages" :key="i" ref="content">
      <content-box :image="val" @image-selected="imageSelected"></content-box>
    </div>
  </div>
</template>

<script>
import ContentBox from './ContentBox'
export default {
  name: 'TopContainer',
  components: {
    ContentBox
  },
  props: {
    topImages: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      upperThanSelected: [],
      lowerThanSelected: [],
      lowest: [],
      highest: []
    }
  },
  methods: {
    imageSelected (index) {
      this.lowerThanSelected = []
      this.upperThanSelected = []
      const selectedTop = this.$refs.content[index].getBoundingClientRect().top
      for (let i in this.topImages) {
        let contentTop = this.$refs.content[i].getBoundingClientRect().top
        if (selectedTop < contentTop) {
          this.lowerThanSelected.push(i)
        } else if (selectedTop > contentTop) {
          this.upperThanSelected.push(i)
        }
      }
      this.$emit('image-selected', index, this.lowerThanSelected, this.upperThanSelected)
    },
    getLowest () {
      this.lowest = []
      this.getHighest()
      for (let i = 1; i < this.highest.length; i++) {
        this.lowest.push(this.highest[i] - 1)
      }
      this.lowest.push(-2)
      this.$emit('low-end-images', this.lowest)
    },
    getHighest () {
      this.highest = []
      if (this.topImages.length > 0) {
        const firstTop = this.$refs.content[0].getBoundingClientRect().top
        for (let i in this.topImages) {
          let contentTop = this.$refs.content[i].getBoundingClientRect().top
          if (firstTop === contentTop) {
            this.highest.push(parseInt(i))
          }
        }
      }
    }
  },
  mounted () {
    setTimeout(() => { this.getLowest() }, 100)
  },
  updated () {
    this.getLowest()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.content {
  display: inline-block;
  overflow: hidden;
  border-radius: 20px;
  margin: 0.5rem;
  max-height: 300px;
}
</style>
