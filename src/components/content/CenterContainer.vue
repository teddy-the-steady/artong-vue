<template>
  <div>
    <div v-if="image" class="center">
      <!-- <img :src="image.url" alt=""/> -->
      <img :src="require(`../../assets/images/art${image.url}.jpg`)" alt=""/>
      <content-layer :image="image" class="content-layer"></content-layer>
    </div>
  </div>
</template>

<script>
import ContentLayer from './ContentLayer'

export default {
  name: 'CenterContainer',
  components: {
    ContentLayer
  },
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

.center {
  display: inline-grid;
  margin: 0.5rem;
  width: 200%;
  position: relative;
  user-select: none;

  img {
    width: 100%;
    height: auto;
    cursor: pointer;
    border-radius: 20px;
  }
}

.content-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
