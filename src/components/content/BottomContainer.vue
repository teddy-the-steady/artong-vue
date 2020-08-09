<template>
  <div>
    <div class="content" v-for="(val, i) in bottomImages" :key="i" ref="content">
      <content-box :image="val" @image-selected="imageSelected"></content-box>
    </div>
  </div>
</template>

<script>
import ContentBox from './ContentBox'
export default {
  name: 'BottomContainer',
  components: {
    ContentBox
  },
  props: {
    bottomImages: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      upperThanSelected: [],
      lowest: [],
      highest: []
    }
  },
  methods: {
    imageSelected (index) {
      this.upperThanSelected = []
      const selectedTop = this.$refs.content[index].getBoundingClientRect().top
      for (let i in this.bottomImages) {
        let contentTop = this.$refs.content[i].getBoundingClientRect().top
        if (selectedTop > contentTop) {
          this.upperThanSelected.push(i)
        }
      }
      this.$emit('image-selected', index, this.upperThanSelected)
    },
    getLowest () {
      this.lowest = []
      this.getHighest()
      for (let i = 1; i < this.highest.length; i++) {
        this.lowest.push(this.highest[i] - 1)
      }
      this.lowest.push(-2)
      this.$emit('both-end-images', this.lowest, this.highest)
    },
    getHighest () {
      this.highest = []
      if (this.bottomImages.length > 0) {
        const firstTop = this.$refs.content[0].getBoundingClientRect().top
        for (let i in this.bottomImages) {
          let contentTop = this.$refs.content[i].getBoundingClientRect().top
          if (firstTop === contentTop) {
            this.highest.push(i)
          }
        }
      }
    }
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
  border-radius: 10px;
  margin: 0.5rem;
  max-height: 300px
}
</style>
