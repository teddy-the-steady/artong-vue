<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box style="width:100%;height:100%;border-radius:50%"></skeleton-box>
    </div>
    <div v-else class="image">
      <img v-if="profilePic" :src="profilePic" @error="isFirstLoading = true"/>
      <div v-else class="basicProfilePicture"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SkeletonBox from '../util/SkeletonBox'

export default {
  name: 'HeaderProfile',
  components: {
    SkeletonBox
  },
  data() {
    return {
      isFirstLoading: true
    }
  },
  computed: {
    ...mapState({
      profilePic: state => state.user.currentUser.profile.profile_pic
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

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .basicProfilePicture {
            height: 100%;
            border-radius: 50%;
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
        }
    }
}
</style>
