<template>
  <div class="profile">
    <ProfileImageBig
      :profileImageUrl="profileImageUrl"
      :isFirstLoading="isFirstLoading"
    ></ProfileImageBig>
    <div class="info">
      <div class="username">
        {{ member ? member.username : '' }}
      </div>
      <div class="introduction">
        {{ member ? member.introduction : '' }}
      </div>
      <div class="address">
        {{ member ? member.wallet_address : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { makeS3Path } from '../../util/commonFunc'
import ProfileImageBig from './ProfileImageBig.vue'

export default {
  name: 'ArtistPageProfile',
  components: {
    ProfileImageBig,
  },
  mixins: [headerActivate],
  data() {
    return {
      profileImageUrl: '',
      isFirstLoading: true,
      hasErrorGettingImage: false,
    }
  },
  props: {
    member: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    getProfileImageUrl(member) {
      return member.profile_thumbnail_s3key
        ? makeS3Path(member.profile_thumbnail_s3key)
        : makeS3Path(member.profile_s3key)
    },
  },
  watch: {
    member: {
      deep: true,
      handler(val) {
        if (val) {
          this.profileImageUrl = this.getProfileImageUrl(this.member)
          this.isFirstLoading = false
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
  display: flex;
  margin-left: 15%;

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
    flex-direction: column;
    align-items: center;
    margin-left: 0;
  }
}
</style>
