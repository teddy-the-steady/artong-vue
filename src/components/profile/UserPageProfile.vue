<template>
  <div class="profile">
    <div class="image">
      <div v-if="profileImage" :src="profileImage" @click="$refs.fileInput.click()">
      </div>
      <div class="basicProfilePicture" v-else @click="$refs.fileInput.click()"></div>
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
        {{ currentUser.profile.profile_pic }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Storage } from 'aws-amplify'
export default {
  name: 'UserPageProfile',
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
    onFileChange(e) {
      const file = e.target.files[0]
      this.profileImage = URL.createObjectURL(file)
    },
    async uploadImage(file) {
      // TODO] 프론트에서 바로 올리고 lambda 트리거 할건지, velog처럼 signedUrl 받아올 건지
      // 후자는 최초에 signedUrl 받아올때 이미지 주소도 만들어서 받아옴
      // 전자는 플로우 설계하자
      await Storage.put('profile.png', file, {
        level: 'private',
        contentType: 'image/png'
      })
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
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);;

        div {
          height: 150px;
          border-radius: 50%;
          cursor: pointer;

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
