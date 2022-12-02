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
      <div class="address">
        {{ currentUser.wallet_address }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Storage from '@aws-amplify/storage'
import { makeS3Path } from '../../util/commonFunc'
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
  },
  mounted() {
    this.isFirstLoading = false
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

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
