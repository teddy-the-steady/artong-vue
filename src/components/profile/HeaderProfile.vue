<template>
  <div class="profile">
    <div v-if="isFirstLoading">
      <div>
        <skeleton-box style="width:100%;height:100%;"></skeleton-box>
      </div>
    </div>
    <div v-else>
      <img v-if="profileImage" :src="profileImage" @error="isFirstLoading = true"/>
      <div v-else class="basicProfilePicture"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { parseS3Path } from '../../util/commonFunc'
import SkeletonBox from '../util/SkeletonBox'

export default {
  name: 'HeaderProfile',
  components: {
    SkeletonBox
  },
  data() {
    return {
      profileImage: '',
      isFirstLoading: true
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    getProfileImage() {
      if (this.currentUser.profile.profile_pic) {
        return parseS3Path(this.currentUser.profile.profile_pic)
      }
    }
  },
  created() {
    console.log('HeaderProfile created')
  },
  mounted() {
    this.profileImage = this.getProfileImage()
    this.isFirstLoading = false
  },
  watch: {
    currentUser() {
      this.profileImage = this.getProfileImage()
      this.isFirstLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    background-color: $artong-white;
    width: 35px;
    height: 35px;
    border-radius: 50%;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    div, span {
        height: 100%;
        border-radius: 50%;

        &.basicProfilePicture {
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
        }
    }
}
</style>
