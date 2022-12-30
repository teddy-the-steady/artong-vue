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
      <button class="address white-btn" @click="copy">
        {{ member ? member.wallet_address : '' }}
        <img src="../../assets/icons/copy.svg" />
      </button>
    </div>
    <textarea v-model="address" ref="address"></textarea>
    <button v-if="this.member.isFollowing" class="follow-btn" @click="follow">
      Follow
    </button>
    <button v-else class="unfollow-btn" @click="follow">unfollow</button>
    <div class="follow-static-box">
      <div class="title">Follwer</div>
      <div class="number">{{ member.follower }}</div>
    </div>
    <div class="follow-static-box">
      <div class="title">Follow</div>
      <div class="number">{{ member.following }}</div>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { makeS3Path } from '../../util/commonFunc'
import ProfileImageBig from './ProfileImageBig.vue'
import { postMemberFollower } from '../../api/member'

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
      address: '',
      errorMessage: '',
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
    getAddress() {
      this.address = this.member.wallet_address
    },
    copy() {
      this.getAddress()
      const element = this.$refs.address
      element.select()
      document.execCommand('copy')
      alert('주소 복사 완료')
    },

    async follow() {
      console.log(this.member)
      try {
        await postMemberFollower({
          isFollowRequest: true,
          targetMemberId: this.member.id,
        })
        this.follower = this.member.follower
        console.log(this.member.follower)
        alert('followed')
      } catch (error) {
        this.errorMessage = error
      }
      // try {
      //   await postMemberFollower({
      //     isFollowRequest: false,
      //     targetMemberId: this.member.id,
      //   })
      //   this.follower = this.member.follower
      //   console.log(this.member.follower)
      //   alert('unfollowed')
      // } catch (error) {
      //   this.errorMessage = error
      // }
      // if (true) {

      // } else {
      //
      // }
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
textarea {
  opacity: 0;
  height: 0px;
  width: 0px;
}
.profile {
  display: flex;
  margin-left: 15%;

  .info {
    text-align: center;
    word-break: break-all;

    .username {
      font-size: 1.5em;
    }
    .address {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      border: 1px solid #f2f2f2;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
      border-radius: 999px;
      padding-left: 16px;
      padding-right: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      img {
        width: 20px;
        height: 20px;
        transform: translateY(3px);
      }
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
