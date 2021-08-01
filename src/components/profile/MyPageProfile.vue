<template>
  <div class="profile">
    <div class="image">
      <img v-if="profileImage" :src="profileImage" @click="$refs.fileInput.click()"/>
      <div v-else class="basicProfilePicture" @click="$refs.fileInput.click()"></div>
      <input ref="fileInput" type="file" @change="onFileChange">
    </div>
    <div class="info">
      <div class="username">
        {{ $route.params.id }}
      </div>
      <div class="display-name">
        {{ currentUser.profile.display_name }}
      </div>
      <div class="intro">
        {{ currentUser.email }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Storage } from 'aws-amplify'
import { parseS3Path } from '../../util/commonFunc'

export default {
  name: 'MyPageProfile',
  data() {
    return {
      profileImage: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files[0]
      await this.uploadProfileImage(file)
    },
    async uploadProfileImage(file) {
      // TODO] 프론트에서 올리고 lambda 트리거
      // full path를 db에 insert. 전후처리는? 사진 가공 등등
      // 프론트에서 PUT전에 미리 확인할게 뭐가 있을까? 타입, 용량?
      await Storage.put(`${this.currentUser.username}/profile/${file.name}`, file, {
        level: 'public',
        contentType: file.type
      })
      // TODO] 업로드 이후에 람다 trigger가 실패했으면?
      // 프사 바꾸고 나면 currentUser에서도 업데이트 해줘야함 store commit? currentAuthenticatedUser 활용?
    },
    async getProfileImage() {
      if (!this.currentUser || !this.currentUser.profile.profile_pic) {
        return null
      }
      const s3Path = parseS3Path(this.currentUser.profile.profile_pic)
      const profileUrl = await Storage.get(`${s3Path.username}/${s3Path.type}/${s3Path.file}`)
      return profileUrl
    }
  },
  async mounted() {
    console.log('MyPageProfile mounted')
    this.profileImage = await this.getProfileImage()
  },
  watch: {
    async currentUser() {
      this.profileImage = await this.getProfileImage()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    display: flex;
    width: 70%;

    .image {
        background-color: $artong-white;
        width: 150px;
        height: 150px;
        min-width: 100px;
        min-height: 100px;
        margin-right: 30px;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          cursor: pointer;
        }

        div {
          height: 150px;
          border-radius: 50%;

          &.basicProfilePicture {
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
          }
        }

        input {
          display: none;
        }
    }

    .info {
      display: flex;
      flex-direction: column;
      text-align: left;

      .username {
        font-size: 1.5em;
      }
    }
}

@media only screen and (max-width: 599px) {
  .profile {
    .image {
      width: 100px;
      height: 100px;
      margin-right: 10px;
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
