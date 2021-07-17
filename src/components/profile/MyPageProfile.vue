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
      // full path를 db에 넣을건지 파일명만 넣을건지. 현재 path로는 파일명만 넣어도 가능, 중간에 파일 위치가 바뀌면?
      // 프론트가 path를 짜맞춰야 하니까 key는 통째로 넣어주는게 나을지도??
      await Storage.put(`${this.currentUser.username}/profile/${file.name}`, file, {
        level: 'public',
        contentType: file.type
      })
    }
  },
  async mounted() {
    console.log('MyPageProfile mounted')
    this.profileImage = await Storage.get(`${this.currentUser.username}/profile/${this.currentUser.profile.profile_pic}`)
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
