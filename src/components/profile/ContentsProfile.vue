<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box style="width:30px;height:30px;"></skeleton-box>
      <skeleton-box class="username" style="width:70%;height:70%;"></skeleton-box>
    </div>
    <div v-else class="image" @error="isFirstLoading = true">
      <img v-if="image" :src="image.profileUrl" alt=""/>
      <img v-else src="../../assets/images/profile.svg" alt="">
      <a class="username">{{image.username}}</a>
    </div>
  </div>
</template>

<script>
import SkeletonBox from '../util/SkeletonBox'

export default {
  name: 'ContentsProfile',
  components: {
    SkeletonBox
  },
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isFirstLoading: true
    }
  },
  watch: {
    image: {
      immediate: true,
      handler(val) {
        if (val) {
          this.isFirstLoading = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    height: 30px;
    cursor: pointer;

    .image {
      overflow: hidden;
      display: flex;
      align-items: center;
      height: 100%;

      img, span {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgb(0 0 0 / 15%);
      }

      .username {
        border-radius: 0;
        margin-left: 5px;
      }
    }
}
</style>
