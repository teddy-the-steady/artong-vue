<template>
  <div>
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox style="width:100%;height:100%"></SkeletonBox>
    </div>
    <div v-else class="image">
      <img v-if="image" :src="image.profileImageUrl" alt="" @error="isFirstLoading=true"/>
      <img v-else src="../../assets/images/profile.svg" alt="" @error="isFirstLoading=true"/>
    </div>
    <div class="info" v-if="needUserName&&!isFirstLoading">
      <a class="username">
        hello
        {{image.username}}
      </a>
    </div>
    <div class="info" v-else-if="needUserName&&isFirstLoading">
      <div class="username_box">
        <SkeletonBox style="width:100%;height:100%"></SkeletonBox>
      </div>
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
    },
    needUserName: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isFirstLoading: true,
      //needUserName: true, // 부모에서 props로 값 받아오기
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
  display: flex;
  align-items: center;
  height: 30px;
  cursor: pointer;

    .image {
      height: 100%;

      img, span {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgb(0 0 0 / 15%);
      }
    }

    .username {
      margin-left: 5px;
      overflow: hidden;
    }
}
</style>
