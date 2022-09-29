<template>
  <div class="box" @click="imageSelect()">
    <img v-if="isNaN(image.url)" :src="image.url" alt="" ref="box"/>
    <img v-else :src="require(`../../assets/images/art${image.url}.jpg`)" alt=""/>
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
    imageSelect() {
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
  overflow: hidden;
  border-radius: 20px;
  max-height: 500px;
  box-shadow: 1px 1px 4px 0 rgb(0 0 0 / 15%);
  &:hover {
    box-shadow: 1px 1px .5em $darkgray, -1px -1px .5em $darkgray;
  }

 img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
}

</style>
