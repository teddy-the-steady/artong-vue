<template>
  <div class="profile">
    <div class="image">
      <img v-if="profileImage" :src="profileImage"/>
      <div v-else class="basicProfilePicture"></div>
    </div>
    <div class="info">
      <div class="username">
        {{ $route.params.id }}
      </div>
      <div class="display-name">
        {{ member.display_name }}
      </div>
      <div class="intro">
        {{ member.introduction }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { headerActivate } from '../../mixin'
import { parseS3Path } from '../../util/commonFunc'
import { CLOUDFRONT_URL } from '../../constants/url'

export default {
  name: 'ArtistPageProfile',
  mixins: [headerActivate],
  data() {
    return {
      profileImage: '',
      member: ''
    }
  },
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    async getMember() {
      const member = await axios.get(`/member?username=${this.$route.params.id}`)
      this.member = member.data.data
      return member.data.data
    },
    async getProfileImage(member) {
      if (!member || !member.profile_pic) {
        return null
      }
      const s3Path = parseS3Path(member.profile_pic)
      return `${CLOUDFRONT_URL}/${s3Path.level}/${s3Path.username}/${s3Path.type}/${s3Path.file}`
    }
  },
  async mounted() {
    const member = await this.getMember()
    this.profileImage = await this.getProfileImage(member)
  },
  watch: {
    async username() {
      const member = await this.getMember()
      this.profileImage = await this.getProfileImage(member)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    display: flex;
    width: 70%;

    .image {
        background-color: $artong-white;
        width: 150px;
        height: 150px;
        min-width: 100px;
        min-height: 100px;
        margin-right: 30px;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        div {
          height: 150px;
          border-radius: 50%;

          &.basicProfilePicture {
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
          }
        }

        input {
          display: none;
        }
    }

    .info {
      display: flex;
      flex-direction: column;
      text-align: left;

      .username {
        font-size: 1.5em;
      }
    }
}

@media only screen and (max-width: 599px) {
  .profile {
    .image {
      width: 100px;
      height: 100px;
      margin-right: 10px;
      div {
        height: 100px;
      }
      input {
        display: none;
      }
    }
  }
}
</style>
