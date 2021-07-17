<template>
  <div class="profile">
      <img v-if="currentUser.profile.profile_pic" :src="profileImage"/>
      <div v-else class="basicProfilePicture"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Storage } from 'aws-amplify'
export default {
  name: 'HeaderProfile',
  data() {
    return {
      profileImage: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    async getProfileImage() {
      const profileUrl = await Storage.get(`${this.currentUser.username}/profile/${this.currentUser.profile.profile_pic}`)
      return profileUrl
    }
  },
  created() {
    console.log('HeaderProfile created')
  },
  async mounted() {
    this.profileImage = await this.getProfileImage()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    background-color: $artong-white;
    width: 30px;
    height: 30px;
    border-radius: 50%;

    img {
        width: 30px;
    }

    div {
        height: 100%;
        border-radius: 50%;

        &.basicProfilePicture {
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
        }
    }
}
</style>
