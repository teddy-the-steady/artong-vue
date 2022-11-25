<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box style="width:100%;height:100%;border-radius:50%"></skeleton-box>
    </div>
    <div v-else class="image">
      <img v-if="profileImageUrl"
        :src="profileImageUrl"
        @error="hasErrorGettingImage = true"
        class="profileImage"
        :class="{error: hasErrorGettingImage}"
      />
      <div v-else class="basicProfileImage"></div>
    </div>
  </div>
</template>

<script>
import SkeletonBox from '../util/SkeletonBox.vue'
import { mapState } from 'vuex'

export default {
  name: 'HeaderProfile',
  components: {
    SkeletonBox
  },
  data() {
    return {
      isFirstLoading: true,
      hasErrorGettingImage: false
    }
  },
  computed: {
    ...mapState({
      profileImageUrl: state => state.user.currentUser.profile.profile_image_url
    })
  },
  mounted() {
    this.isFirstLoading = false
  }
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
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
        }
    }
}
</style>
