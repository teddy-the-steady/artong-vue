<template>
  <div class="profileImage">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox
        style="width: 100%; height: 100%; border-radius: 50%"
      ></SkeletonBox>
    </div>
    <div v-else class="image">
      <img
        v-if="profileImageUrl"
        :src="profileImageUrl"
        @error="hasErrorGettingImage = true"
        :class="{ error: hasErrorGettingImage }"
      />
      <div v-else class="basicProfileImage"></div>
    </div>
  </div>
</template>

<script>
import SkeletonBox from '../util/SkeletonBox.vue'

export default {
  name: 'ProfileImageBig',
  components: {
    SkeletonBox,
  },
  props: {
    profileImageUrl: {
      type: String,
      default: '',
    },
    isFirstLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hasErrorGettingImage: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.image {
  display: inline-block;
  background-color: $artong-white;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid $artong-white;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;

    &.error {
      background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
      text-indent: -10000px;
    }
  }

  .basicProfileImage {
    height: 100%;
    border-radius: 50%;
    background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
  }
}

@media only screen and (max-width: 599px) {
  .image {
    width: 100px;
    height: 100px;
    div {
      height: 100px;
    }
  }
}
</style>
