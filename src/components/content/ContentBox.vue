<template>
  <div class="box" @click="imageSelect()">
    <img :src="require(`../../assets/images/art${image.url}.jpg`)" alt="" ref="box"/>
  </div>
</template>

<script>
export default {
  name: 'ContentBox',
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  methods: {
    imageSelect () {
      this.$emit('image-selected', this.image.index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.box {
 display: flex;
 align-items: flex-start;

 img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
}
</style>
