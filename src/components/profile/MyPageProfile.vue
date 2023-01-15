<template>
  <div class="profile">
    <div class="profile-image-wrapper" @click="$refs.fileInput.click()">
      <ProfileImageBig
        :profileImageUrl="profileImageUrl"
        :isFirstLoading="isFirstLoading"
        class="profile-image"
      ></ProfileImageBig>
    </div>
    <input ref="fileInput" type="file" @change="onFileChange" />
    <div v-if="innerWidth < 1080" class="top1">
      <div class="info">
        <div class="username">@{{ currentUser.username }}</div>

        <button class="address white-button" @click="copy">
          {{ this.shortAddress }}
          <img src="../../assets/icons/copy.svg" />
        </button>
      </div>
      <div class="follow-static-container">
        <div class="follow-static">
          <div class="title">Follower</div>
          <div class="number">{{ currentUser.follower }}</div>
        </div>
        <div class="follow-static">
          <div class="title">Following</div>
          <div class="number">{{ currentUser.following }}</div>
        </div>
      </div>
      <div class="introduction">
        <div class="title">Introduction</div>
        <div class="text">{{ currentUser.profile.introduction }}</div>
      </div>
    </div>
    <div v-else class="top2">
      <div class="info">
        <div class="username">@{{ currentUser.username }}</div>

        <button class="address white-button" @click="copy">
          {{ this.shortAddress }}
          <img src="../../assets/icons/copy.svg" />
        </button>
      </div>
      <div class="introduction">
        <div class="title">Introduction</div>
        <div class="text">{{ currentUser.profile.introduction }}</div>
      </div>
      <div class="follow-static-container">
        <div class="follow-static">
          <div class="title">Follwer</div>
          <div class="number">{{ currentUser.follower }}</div>
        </div>
        <div class="follow-static">
          <div class="title">Following</div>
          <div class="number">{{ currentUser.following }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Storage from '@aws-amplify/storage'
import { makeS3Path, shortenAddress } from '../../util/commonFunc'
import { patchMemberProfileS3key } from '../../api/member'
import ProfileImageBig from './ProfileImageBig.vue'

export default {
  name: 'MyPageProfile',
  components: {
    ProfileImageBig,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      profileImageUrl: state =>
        state.user.currentUser.profile.profile_image_url,
      innerWidth: state => state.menu.innerWidth,
    }),
  },
  data() {
    return {
      isFirstLoading: true,
      S3_PRIVACY_LEVEL: 'public',
      hasErrorGettingImage: false,
      address: '',
      shortAddress: '',
    }
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files[0]
      await this.uploadProfileImage(file)
    },
    async uploadProfileImage(file) {
      const result = await Storage.put(
        `profile/${this.currentUser.id}/${file.name}`,
        file,
        {
          level: this.S3_PRIVACY_LEVEL,
          contentType: file.type,
        },
      )
      if (result) {
        await patchMemberProfileS3key(`${this.S3_PRIVACY_LEVEL}/${result.key}`)
        this.$store.commit(
          'CURRENT_USER_PROFILE_IMAGE_URL',
          makeS3Path(`${this.S3_PRIVACY_LEVEL}/${result.key}`),
        )
      }
    },
    copy() {
      navigator.clipboard
        .writeText(`${this.currentUser.wallet_address}`)
        .then(() => {
          alert('주소 복사 완료')
        })
        .catch(() => {
          alert('주소 복사 실패')
        })
    },
  },
  mounted() {
    this.isFirstLoading = false
    this.shortAddress = shortenAddress(this.currentUser.wallet_address)
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
  text-align: initial;
  margin-left: 16px; // 840이상부터 24px;
  .profile-image-wrapper {
    width: 120px;
    .profile-image {
      margin-left: 8px;
    }
  }

  input {
    display: none;
  }
  .top1 {
    .info {
      .username {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 700;
        font-size: 32px;
        color: $artong-black;
        overflow: hidden;
        text-overflow: ellipsis;
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
}
@media (min-width: 840px) and(max-width:1079px) {
  .profile {
    margin-left: 24px;
    .profile-image {
      margin-left: 0px;
    }
  }
}
</style>
