<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox style="width:100%;height:100%"></SkeletonBox>
    </div>
    <div v-else @error="isFirstLoading=true" class="image">
      <img v-if="image" :src="image.profileImageUrl" @error="hasErrorGettingImage = true" class="profileImage"
          :class="{error: hasErrorGettingImage}"/>
      <img v-else src="../../assets/images/profile.svg"/>
    </div>
    <div class="info" v-if="needUserName&&!isFirstLoading">
      <a class="username">
        <!-- {{image.username}} -->
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
      default: true
    },
  },
  data() {
    return {
      isFirstLoading: true,
      hasErrorGettingImage: false
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
      width:30px;
      height: 30px;
      object-fit:cover;
      border-radius: 50%;
      overflow:hidden;
      background-color: white;

      .profileImage { //?
        &.error {
          background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
          text-indent: -10000px;
        }
      }
    }

    .info {
      margin-left:8px;
      height:32px;
      .username{
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 32px;
      }
      .username_box{
        margin-top:7.5px;
        width: 77px;
        height:17px;
        border-radius:4px;
        overflow:hidden;
      }
    }
}
</style>
