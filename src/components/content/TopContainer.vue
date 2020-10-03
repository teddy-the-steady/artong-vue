<template>
  <div>
    <div class="content" v-for="(val, i) in topImages" :key="i" ref="content">
      <content-box :image="val" @image-selected="onImageSelected"></content-box>
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
      highest: [],
      LAST_OF_LOWEST: -2
    }
  },
  methods: {
    onImageSelected (index) {
      this.lowerThanSelected = []
      this.upperThanSelected = []
      const selectedTop = this.$refs.content[index].getBoundingClientRect().top
      for (let i in this.topImages) {
        let contentTop = this.$refs.content[i].getBoundingClientRect().top
        if (selectedTop < contentTop) {
          this.lowerThanSelected.push(parseInt(i))
        } else if (selectedTop > contentTop) {
          this.upperThanSelected.push(parseInt(i))
        }
      }
      this.$emit('set-upper-than-selected', this.upperThanSelected)
      this.$emit('set-lower-than-selected', this.lowerThanSelected)
      this.$emit('image-selected', parseInt(index))
    },
    getLowest () {
      this.lowest = []
      for (let i = 1; i < this.highest.length; i++) {
        this.lowest.push(this.highest[i] - 1)
      }
      this.lowest.push(this.LAST_OF_LOWEST)
      this.$emit('set-top-lowest-images', this.lowest)
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
    this.getHighest()
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
  &:hover {
    box-shadow: 1px 1px .5em $darkgrey, -1px -1px .5em $darkgrey;
  }
}
</style>
