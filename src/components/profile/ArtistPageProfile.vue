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
        {{ member ? shortenAddress(member.wallet_address) : '' }}
        <img src="../../assets/icons/copy.svg" />
      </button>
    </div>
    <button
      v-if="this.member.is_follower"
      class="unfollow-btn"
      @click="unfollow"
    >
      unfollow
    </button>
    <button v-else class="follow-btn" @click="follow">follow</button>
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
import { makeS3Path, shortenAddress } from '../../util/commonFunc'
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
      shortAddress: '',
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
    shortenAddress(address) {
      return shortenAddress(address)
    },

    copy() {
      this.address = this.member.wallet_address
      navigator.clipboard
        .writeText(`${this.address}`)
        .then(() => {
          alert('주소 복사 완료')
        })
        .catch(() => {
          alert('주소 복사 실패')
        })
    },
    async follow() {
      try {
        this.member = await postMemberFollower({
          isFollowRequest: true,
          targetMemberId: this.member.id,
        })
        this.$emit('changeFollower', this.member)
      } catch (error) {
        this.errorMessage = error
      }
    },
    async unfollow() {
      try {
        this.member = await postMemberFollower({
          isFollowRequest: false,
          targetMemberId: this.member.id,
        })
        this.$emit('changeFollower', this.member)
      } catch (error) {
        this.errorMessage = error
      }
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
