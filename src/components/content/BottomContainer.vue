<template>
  <div v-masonry transition-duration="0.3s" fit-width="true" destroy-delay="0" item-selector=".content">
    <div v-masonry-tile class="content" v-for="(val, i) in bottomImages" :key="i" ref="content">
      <content-box :image="val" @image-selected="onImageSelected"></content-box>
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
  methods: {
    onImageSelected(index) {
      this.$emit('image-selected', parseInt(index))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.content {
  display: inline-block;
  overflow: hidden;
  border-radius: 20px;
  margin: 1rem;
  width: 15rem;
  max-height: 300px;
  &:hover {
    box-shadow: 1px 1px .5em $darkgrey, -1px -1px .5em $darkgrey;
  }
}

@media only screen and (max-width: 599px) {
  .content {
    margin: .5rem;
    width: 12rem;
  }
}

@media only screen and (max-width: 360px) {
  .content {
    margin: .5rem;
    width: 11rem;
  }
}

@media only screen and (max-width: 320px) {
  .content {
    margin: .5rem;
    width: 10rem;
  }
}
</style>
