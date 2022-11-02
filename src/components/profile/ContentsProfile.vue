<template>
  <div>
    <div v-if="isFirstLoading" class="profile">
      <div class="image">
        <skeleton-box style="width:30px;height:30px;"></skeleton-box>
      </div>
      <skeleton-box class="username" style="width:70%;height:70%;"></skeleton-box>
    </div>
    <div v-else class="profile">
      <div class="image">
        <img v-if="member"
          :src="getImageUrl(member.profile_thumbnail_s3key)"
          @error="hasErrorGettingImage = true"
          class="profileImage"
          :class="{error: hasErrorGettingImage}"
        />
        <img v-else src="../../assets/images/profile.svg" alt="">
      </div>
      <a class="username">{{member.username}}</a>
    </div>
  </div>
</template>

<script>
import SkeletonBox from '../util/SkeletonBox'
import { makeS3Path } from '../../util/commonFunc'

export default {
  name: 'ContentsProfile',
  components: {
    SkeletonBox
  },
  props: {
    member: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isFirstLoading: true,
      hasErrorGettingImage: false
    }
  },
  methods: {
    getImageUrl(path) {
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
      height: 100%;

      .profileImage {
        &.error {
          background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
          text-indent: -10000px;
        }
      }

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
