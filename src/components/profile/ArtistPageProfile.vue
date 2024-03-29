<template>
  <div class="profile">
    <ProfileImageBig
      :profileImageUrl="profileImageUrl"
      :userWalletAddress="member.wallet_address"
      :isFirstLoading="isFirstLoading"
      class="profile-image"
    ></ProfileImageBig>
    <div v-if="innerWidth < 1080" class="top1">
      <div class="info">
        <div class="username">@{{ member ? member.username : '' }}</div>
        <button class="address white-button" @click="copy">
          {{ shortenAddress(member.wallet_address) }}
          <img src="../../assets/icons/copy.svg" />
        </button>
      </div>
      <div class="follow-static-container">
        <div class="follow-static">
          <div class="title">{{ $t('views.user.profile.follower') }}</div>
          <div class="number">{{ member.follower }}</div>
        </div>
        <div class="follow-static">
          <div class="title">{{ $t('views.user.profile.following') }}</div>
          <div class="number">{{ member.following }}</div>
        </div>
      </div>
      <div class="introduction">
        <div class="title">{{ $t('views.user.profile.introduction') }}</div>
        <div class="text">{{ member ? member.introduction : '' }}</div>
      </div>
    </div>
    <div v-else class="top2">
      <div class="info">
        <div class="username">@{{ member ? member.username : '' }}</div>
        <button class="address white-button" @click="copy">
          {{ shortenAddress(member.wallet_address) }}
          <img src="../../assets/icons/copy.svg" />
        </button>
      </div>
      <div class="introduction">
        <div class="title">{{ $t('views.user.profile.introduction') }}</div>
        <div class="text">{{ member ? member.introduction : '' }}</div>
      </div>
      <div class="follow-static-container">
        <div class="follow-static">
          <div class="title">{{ $t('views.user.profile.follower') }}</div>
          <div class="number">{{ member.follower }}</div>
        </div>
        <div class="follow-static">
          <div class="title">{{ $t('views.user.profile.following') }}</div>
          <div class="number">{{ member.following }}</div>
        </div>
      </div>
    </div>
    <button
      v-if="this.member.is_follower"
      class="follow-n-unfollow-btn"
      @click="unfollow"
      v-ripple
    >
      {{ $t('views.user.button.unfollow') }}
    </button>
    <button v-else class="follow-n-unfollow-btn" @click="follow" v-ripple>
      {{ $t('views.user.button.follow') }}
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import {
  makeS3Path,
  shortenAddress,
  isSessionValid,
} from '../../util/commonFunc'
import ProfileImageBig from './ProfileImageBig.vue'
import Ripple from '../../directives/ripple/Ripple'

export default {
  name: 'ArtistPageProfile',
  components: {
    ProfileImageBig,
  },
  mixins: [headerActivate],
  computed: {
    ...mapState({
      innerWidth: state => state.menu.innerWidth,
    }),
  },
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
      if (address) {
        return shortenAddress(address)
      }
    },

    copy() {
      this.address = this.member.wallet_address
      navigator.clipboard
        .writeText(`${this.address}`)
        .then(() => {
          alert(this.$i18n.t('common.alert.copy'))
        })
        .catch(() => {
          alert(this.$i18n.t('common.alert.error'))
        })
    },
    async follow() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }
      this.$emit('follow')
    },
    async unfollow() {
      this.$emit('unfollow')
    },
  },
  watch: {
    member: {
      deep: true,
      handler(val) {
        if (val) {
          this.isFirstLoading = true
          this.profileImageUrl = this.getProfileImageUrl(this.member)
          this.isFirstLoading = false
        }
      },
    },
  },
  directives: {
    ripple: Ripple,
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.profile {
  text-align: initial;
  padding-left: 16px;
  padding-right: 16px;
  .profile-image {
    margin-left: 8px;
  }
  .info {
    .username {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 700;
      font-size: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: $artong-black;
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
      img {
        width: 20px;
        height: 20px;
        transform: translateY(3px);
      }
    }
  }
  .follow-static-container {
    display: flex;
    margin-top: 16px;
    .follow-static {
      margin-right: 24px;
      font-family: 'Pretendard';
      font-style: normal;
      font-size: 18px;
      color: $artong-black;
      .title {
        font-weight: 600;
      }
      .number {
        margin-top: 8px;
        font-weight: 400;
      }
    }
  }
  .introduction {
    margin-top: 16px;
    margin-bottom: 16px;
    .title {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      color: $artong-black;
    }
    .text {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: #4d4d4d;
      margin-top: 8px;
      word-break: break-all;
    }
  }
  .follow-n-unfollow-btn {
    height: 48px;
    width: 100%;
  }
}
@media (min-width: 840px) {
  .profile {
    padding-right: 24px;
    padding-left: 24px;
  }
}
.top2 {
  display: flex;
  flex-direction: row;
  .info {
    width: 382px;
    margin-right: 24px;
    .username {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 700;
      font-size: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      color: $artong-black;
    }
    .address {
      margin-top: 8px;
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      border: 1px solid #f2f2f2;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
      border-radius: 999px;
      padding-left: 16px;
      padding-right: 16px;
      img {
        width: 20px;
        height: 20px;
        transform: translateY(3px);
      }
    }
  }
  .introduction {
    font-family: 'Pretendard';
    font-style: normal;
    width: 472px;
    margin-bottom: 0px;
    .title {
      font-weight: 600;
      font-size: 18px;
      color: $artong-black;
    }
    .text {
      margin-top: 8px;
      font-weight: 400;
      font-size: 16px;
      color: #4d4d4d;
      word-break: break-all;
    }
  }
  .follow-static-container {
    display: flex;
    margin-right: 24px;
    margin-left: auto;
    .follow-static {
      font-family: 'Pretendard';
      font-style: normal;
      color: $artong-black;
      margin-left: 24px;
      .title {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 8px;
      }
      .number {
        font-weight: 400;
        font-size: 18px;
      }
    }
  }
}
@media only screen and (min-width: 1080px) {
  .profile {
    .follow-n-unfollow-btn {
      width: 96px;
      margin-left: auto;
      margin-bottom: 8px;
      display: block;
    }
  }
}
</style>
