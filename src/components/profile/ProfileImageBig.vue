<template>
  <div class="profileImage">
    <div class="image">
      <img
        v-if="profileImageUrl"
        :src="profileImageUrl"
        @error="hasErrorGettingImage = true"
        :class="{ error: hasErrorGettingImage }"
      />
      <div
        v-else
        class="basicProfileImage"
        :style="{ background: backgroundColor }"
      ></div>
    </div>
  </div>
</template>

<script>
import { backgroundColor } from '../../mixin'

export default {
  name: 'ProfileImageBig',
  mixins: [backgroundColor],
  props: {
    profileImageUrl: {
      type: String,
      default: '',
    },
    userWalletAddress: {
      type: String,
      default: '',
    },
    isFirstLoading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    backgroundColor() {
      return this.generateGradientBackground(this.userWalletAddress)
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
      text-indent: -10000px;
    }
  }

  .basicProfileImage {
    height: 100%;
    border-radius: 50%;
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
