<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox style="width:100%;height:100%"></SkeletonBox>
    </div>
    <div v-else @error="isFirstLoading=true" class="image">
      <img v-if="member" :src="makeS3Path(member.profile_thumbnail_s3key)" @error="hasErrorGettingImage = true" class="profileImage"
          :class="{error: hasErrorGettingImage}"/>
      <img v-else src="../../assets/images/profile.svg"/>
    </div>
    <div class="info" v-if="needUserName&&!isFirstLoading">
      <a class="username">
        <!-- {{member.username}} -->
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
import { makeS3Path } from '../../util/commonFunc'
import SkeletonBox from '../util/SkeletonBox.vue'

//import internal from 'stream'

export default {
  name: 'ContentsProfile',
  components: {
    SkeletonBox
  },
  props: {
    member: {
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
      isFirstLoading: false,
      hasErrorGettingImage: false
    }
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    }
  },
  watch: {
    member: {
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
      width: 30px;
      height: 30px;
      object-fit:cover;
      border-radius: 50%;
      overflow:hidden;
      background-color: $artong-white;

      .profileImage { 
        width: 100%;
        height:100%;
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
        font-family: $item-font;
        font-style: $item-font-style;
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
