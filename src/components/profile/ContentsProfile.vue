<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
    </div>
    <div v-else @error="isFirstLoading = true" class="image">
      <img
        v-if="member ? member.profile_thumbnail_s3key : ''"
        :src="makeS3Path(member.profile_thumbnail_s3key)"
        @error="hasErrorGettingImage = true"
        class="profileImage"
        :class="{ error: hasErrorGettingImage }"
      />
      <div
        v-else-if="member ? member.wallet_address : ''"
        alt=""
        :style="{ background: backgroundColor }"
      />
      <img v-else src="../../assets/images/profile.svg" />
    </div>
    <div class="info" v-if="member && needUserName && !isFirstLoading">
      <a class="username">
        {{ member.username }}
      </a>
    </div>
    <div class="info" v-else-if="member && needUserName && isFirstLoading">
      <div class="username_box">
        <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
      </div>
    </div>
    <div class="price" v-if="price">
      <img :src="require('@/assets/icons/ethereum.svg')" />
      {{ price }}
    </div>
  </div>
</template>

<script>
import { backgroundColor } from '../../mixin'
import { makeS3Path } from '../../util/commonFunc'
import SkeletonBox from '../util/SkeletonBox.vue'

export default {
  name: 'ContentsProfile',
  mixins: [backgroundColor],
  components: {
    SkeletonBox,
  },
  props: {
    member: {
      type: Object,
      default: null,
    },
    needUserName: {
      type: Boolean,
      default: true,
    },
    price: {
      type: String,
      default: null,
    },
    isFirstLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    backgroundColor() {
      return this.generateGradientBackground(this.member?.wallet_address)
    },
  },
  data() {
    return {
      hasErrorGettingImage: false,
    }
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    },
  },
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
    border-radius: 50%;
    overflow: hidden;
    background-color: $artong-white;
    display: grid;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      &.error {
        text-indent: -10000px;
      }
    }
  }

  .info {
    margin-left: 8px;
    height: 32px;
    .username {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      line-height: 32px;
      display: inline-block;
      max-width: 80px;
      white-space: nowrap;
      overflow: hidden !important;
      text-overflow: ellipsis;
      color: inherit;
    }
    .username_box {
      margin-top: 7.5px;
      width: 77px;
      height: 17px;
      border-radius: 4px;
      overflow: hidden;
    }
  }

  .price {
    width: 20px;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
