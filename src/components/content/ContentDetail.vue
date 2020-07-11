<template>
  <div>
    <div v-if="image" class="detail">
      <img :src="require(`../../assets/images/gogh${image.url}.jpg`)" alt=""/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentDetail',
  props: {
    image: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.detail {
  display: inline-block;
  margin: 0.5rem;
  width: 200%;

  img {
    width: 100%;
    height: auto;
    cursor: pointer;
    border-radius: 10px
  }
}
</style>
