<template>
  <div>
    <div v-if="image" class="center">
      <!-- <img :src="image.url" alt=""/> -->
      <img :src="require(`../../assets/images/art${image.url}.jpg`)" alt=""/>
      <div class="contentLayer" v-bind:class="{active: isActive}" @click="onLayerClick()"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CenterContainer',
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    onLayerClick() {
      this.isActive = !this.isActive
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

  img {
    width: 100%;
    height: auto;
    cursor: pointer;
    border-radius: 20px;
  }

  .contentLayer {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: 20px;
    background-color: $artong-black;
    opacity: 0;
    cursor: pointer;
    &.active {
      opacity: .3;
    }
  }
}
</style>
