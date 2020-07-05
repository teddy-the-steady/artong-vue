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
      upperThanSelected: []
    }
  },
  methods: {
    imageSelected (index) {
      this.upperThanSelected = []
      for (let i in this.lowerImages) {
        this.lowerImages[i]['top'] = this.$refs.content[i].getBoundingClientRect().top
        if (this.$refs.content[index].getBoundingClientRect().top > this.lowerImages[i]['top']) {
          this.upperThanSelected.push(i)
        }
      }
      this.$emit('image-selected', index, this.upperThanSelected)
    }
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
