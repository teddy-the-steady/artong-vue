<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box
        style="width: 100%; height: 100%; border-radius: 50%"
      ></skeleton-box>
    </div>
    <div v-else class="image">
      <img
        v-if="profileImageUrl"
        :src="profileImageUrl"
        @click="$refs.fileInput.click()"
        @error="hasErrorGettingImage = true"
        class="profileImage"
        :class="{ error: hasErrorGettingImage }"
      />
      <div
        v-else
        class="basicProfileImage"
        @click="$refs.fileInput.click()"
      ></div>
      <input ref="fileInput" type="file" @change="onFileChange" />
    </div>
    <div class="info">
      <div class="username">
        {{ currentUser.username }}
      </div>
      <div class="intro">
        {{ currentUser.email }}
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
import SkeletonBox from '../util/SkeletonBox.vue'

export default {
  name: 'MyPageProfile',
  components: {
    SkeletonBox,
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      profileImageUrl: (state) =>
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

  .image {
    display: inline-block;
    background-color: $artong-white;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 2px solid $artong-white;
    cursor: pointer;

    .profileImage {
      &.error {
        background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
        text-indent: -10000px;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .basicProfileImage {
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
    flex-direction: column;
    align-items: center;
    margin-left: 0;

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
