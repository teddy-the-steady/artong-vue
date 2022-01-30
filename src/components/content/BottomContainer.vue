<template>
  <masonry :cols="{default: 7, 1500:6, 1300: 5, 1100: 4, 850: 3, 570: 2, 310: 1}">
    <div class="content" v-for="(val, i) in bottomImages" :key="i">
      <content-box :image="val" @image-selected="onImageSelected"></content-box>
    </div>
  </masonry>
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
  margin: 7px;
  width: 90%;
  max-height: 300px;
  animation: fadeInOpacity .3s;
  box-shadow: 1px 1px 4px 0 rgb(0 0 0 / 15%);
  &:hover {
    box-shadow: 1px 1px .5em $darkgrey, -1px -1px .5em $darkgrey;
  }
}

@keyframes fadeInOpacity {
    0% {
        opacity: 0;
        width: 60%;
    }
    100% {
        opacity: 1;
        width: 90%;
    }
}
</style>
