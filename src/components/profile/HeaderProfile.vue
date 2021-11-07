<template>
  <div class="profile">
      <img v-if="currentUser.profile.profile_pic" :src="profileImage"/>
      <div v-else class="basicProfilePicture"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { parseS3Path } from '../../util/commonFunc'

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
      if (this.currentUser.profile.profile_pic) {
        const s3Path = parseS3Path(this.currentUser.profile.profile_pic)
        return `https://images.4rtong.com/${s3Path.level}/${s3Path.username}/${s3Path.type}/${s3Path.file}`
      }
    }
  },
  created() {
    console.log('HeaderProfile created')
  },
  async mounted() {
    this.profileImage = await this.getProfileImage()
  },
  watch: {
    async currentUser() {
      this.profileImage = await this.getProfileImage()
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

    div {
        height: 100%;
        border-radius: 50%;

        &.basicProfilePicture {
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
        }
    }
}
</style>
