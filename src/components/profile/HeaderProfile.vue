<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox
        style="width: 100%; height: 100%; border-radius: 50%"
      ></SkeletonBox>
    </div>
    <div v-else class="image">
      <img
        v-if="currentUser.profile.profile_image_url"
        :src="currentUser.profile.profile_image_url"
        @error="hasErrorGettingImage = true"
        class="profileImage"
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
import SkeletonBox from '../util/SkeletonBox.vue'
import { backgroundColor } from '../../mixin'
import { mapState } from 'vuex'

export default {
  name: 'HeaderProfile',
  mixins: [backgroundColor],
  components: {
    SkeletonBox,
  },
  data() {
    return {
      isFirstLoading: true,
      hasErrorGettingImage: false,
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
    backgroundColor() {
      return this.generateGradientBackground(this.currentUser.wallet_address)
    },
  },
  mounted() {
    this.isFirstLoading = false
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
  display: inline;
  .image {
    display: inline;

    .profileImage {
      &.error {
        background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
        text-indent: -10000px;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .basicProfileImage {
      height: 100%;
      border-radius: 50%;
    }
  }
}
</style>
