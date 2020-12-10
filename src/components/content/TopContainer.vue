<template>
  <div v-masonry transition-duration="0.3s" fit-width="true" destroy-delay="0" item-selector=".content">
    <div v-masonry-tile class="content" v-for="(val, i) in topImages" :key="i" ref="content">
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
  margin: 14px;
  width: 210px;
  max-height: 300px;
  &:hover {
    box-shadow: 1px 1px .5em $darkgrey, -1px -1px .5em $darkgrey;
  }
}

@media only screen and (max-width: 599px) {
  .content {
    margin: 7px;
    width: 168px;
  }
}

@media only screen and (max-width: 360px) {
  .content {
    margin: 7px;
    width: 154px;
  }
}

@media only screen and (max-width: 320px) {
  .content {
    margin: 7px;
    width: 140px;
  }
}
</style>
