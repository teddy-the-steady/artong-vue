<template>
  <div class="user">
    <div class="header">
      <div class="user-info">
        <my-page-profile v-show="$route.params.id === currentUser.username"></my-page-profile>
        <user-page-profile
          v-if="$route.name === 'User' && $route.params.id !== currentUser.username"
          :username="username"
        ></user-page-profile>
        <button
          v-show="$route.params.id === currentUser.username"
          @click="toggleModal"
        >UPLOAD</button>
        <button v-if="$route.name === 'User' && $route.params.id !== currentUser.username">SUBSCRIBE</button>
      </div>
      <div class="tab">
      </div>
    </div>
    <div class="contents">
      <content-list-v2
        v-show="$route.params.id === currentUser.username"></content-list-v2>
      <content-list-v2
        v-if="$route.name === 'User' && $route.params.id !== currentUser.username"></content-list-v2>
    </div>
    <div v-if="true">
      <button @click="signOut">Sign Out</button>
    </div>
    <upload-modal v-if="isModalOpen" @close="toggleModal"></upload-modal>
  </div>
</template>

<script>
import MyPageProfile from '../profile/MyPageProfile'
import UserPageProfile from '../profile/UserPageProfile'
import ContentListV2 from '../content/ContentListV2'
import UploadModal from '../modal/UploadModal'
import { mapState } from 'vuex'

export default {
  name: 'User',
  components: {
    MyPageProfile, UserPageProfile, ContentListV2, UploadModal
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      isModalOpen: state => state.menu.isModalOpen
    })
  },
  data() {
    return {
      username: ''
    }
  },
  methods: {
    async signOut() {
      try {
        await this.$store.dispatch('AUTH_LOGOUT')
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    }
  },
  watch: {
    $route(to, from) {
      window.scrollTo({top: 0})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.user {
  overflow-y: auto; // TODO] user 분리하기 + scroll이 생기면서 .contents__body padding-top: 50px이 사라지는 문제
  -webkit-overflow-scrolling: touch;

  .header {
    .user-info {
      height: 30%;
      display: flex;
      justify-content: space-evenly;
      align-items: flex-end;
      padding: 50px 15px 15px 15px;

      button {
        padding: 10px;
        border-radius: 10px;
      }
    }

    .tab {
      height: 50px;
    }
  }

  .contents {
    padding: 0 10%;
  }
}

@media only screen and (max-width: 599px) {
  .header {
    .user-info {
      padding: 30px 15px 15px 15px;

      button {
        border-radius: 10px;
      }
    }
  }

  .contents {
    padding: 0;
  }
}
</style>
