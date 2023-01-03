<template>
  <div class="profile">
    <span @click="$refs.fileInput.click()">
      <ProfileImageBig
        :profileImageUrl="profileImageUrl"
        :isFirstLoading="isFirstLoading"
      ></ProfileImageBig>
    </span>
    <input ref="fileInput" type="file" @change="onFileChange" />
    <div class="info">
      <div class="username">
        {{ currentUser.username }}
      </div>
      <div class="introduction">
        {{ currentUser.profile.introduction }}
      </div>
      <button class="address white-btn" @click="copy">
        {{ this.shortAddress }}
        <img src="../../assets/icons/copy.svg" />
      </button>
    </div>
    <textarea v-model="address" ref="address"></textarea>
    <div class="follow-static-box">
      <div class="title">Follwer</div>
      <div class="number">299</div>
    </div>
    <div class="follow-static-box">
      <div class="title">Follow</div>
      <div class="number">300</div>
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
    getAddress() {
      this.address = this.currentUser.wallet_address
    },
    copy() {
      navigator.clipboard
        .writeText(`${this.address}`)
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
    this.getAddress()
    this.shortAddress = shortenAddress(this.address)
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

  input {
    display: none;
  }

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

    input {
      display: none;
    }
  }
}
</style>
