<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box style="width:100%;height:100%;border-radius:50%;"></skeleton-box>
    </div>
    <div v-else class="image" @error="isFirstLoading = true">
      <img v-if="profileImage" :src="profileImage"/>
      <div v-else class="basicProfilePicture"></div>
    </div>
    <div class="info">
      <div class="username">
        {{ $route.params.id }}
      </div>
      <div class="display-name">
        {{ member? member.display_name : '' }}
      </div>
      <div class="intro">
        {{ member? member.introduction : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { makeS3Path } from '../../util/commonFunc'
import SkeletonBox from '../util/SkeletonBox'
import { getMembers } from '../../api/member'

export default {
  name: 'ArtistPageProfile',
  components: {
    SkeletonBox
  },
  mixins: [headerActivate],
  data() {
    return {
      profileImage: '',
      member: '',
      isFirstLoading: true
    }
  },
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  methods: {
    async getMember(username) {
      const member = await getMembers(username)
      if (member.length === 1) {
        return member[0]
      }
      return null
    },
    getProfileImage(member) {
      if (!member || !member.profile_pic) {
        return null
      }
      return makeS3Path(member.profile_pic)
    }
  },
  watch: {
    username: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.member = await this.getMember(val)
          this.profileImage = this.getProfileImage(this.member)
          this.isFirstLoading = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    transform: translateY(-40%);
    display: flex;
    flex-direction: column;
    align-items: center;
    .image {
        display: inline-block;
        background-color: $artong-white;
        width: 150px;
        height: 150px;
        min-width: 100px;
        min-height: 100px;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);

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

        input {
          display: none;
        }
    }

    .info {
      text-align: center;
      word-break: break-all;

      .username {
        font-size: 1.5em;
      }
    }
}

@media only screen and (max-width: 599px) {
  .profile {
    transform: translateY(-30%);
    .image {
      width: 100px;
      height: 100px;
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