<template>
    <div class="contentLayer" v-bind:class="{active: isActive}" @click="onLayerClick()">
    </div>
</template>

<script>
export default {
  name: 'ContentLayer',
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
</style>
