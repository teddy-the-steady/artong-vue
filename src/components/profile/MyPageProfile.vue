<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box style="width:100%;height:100%;border-radius:50%;"></skeleton-box>
    </div>
    <div v-else class="image">
      <img v-if="profilePic" :src="profilePic" @click="$refs.fileInput.click()" @error="isFirstLoading = true"/>
      <div v-else class="basicProfilePicture" @click="$refs.fileInput.click()"></div>
      <input ref="fileInput" type="file" @change="onFileChange">
    </div>
    <div class="info">
      <div class="username">
        {{ currentUser.username }}
      </div>
      <div class="intro">
        {{ currentUser.email }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Storage from '@aws-amplify/storage'
import { makeS3Path } from '../../util/commonFunc'
import SkeletonBox from '../util/SkeletonBox'

export default {
  name: 'MyPageProfile',
  components: {
    SkeletonBox
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      profilePic: state => state.user.currentUser.profile.profile_pic
    })
  },
  data() {
    return {
      isFirstLoading: true
    }
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files[0]
      await this.uploadProfileImage(file)
    },
    async uploadProfileImage(file) {
      // TODO] 전후처리는? 사진 가공 등등
      // 프론트에서 PUT전에 미리 확인할게 뭐가 있을까? 타입, 용량?
      const result = await Storage.put(`profile/${this.currentUser.id}/${file.name}`, file, {
        level: 'public',
        contentType: file.type
      })
      if (result) {
        this.$store.commit('CURRENT_USER_PROFILE_PIC', makeS3Path(`public/${result.key}`))
      }
    }
  },
  mounted() {
    this.isFirstLoading = false
  }
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
