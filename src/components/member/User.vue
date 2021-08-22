<template>
  <div>
    <div class="header">
      <div class="user-info">
        <my-page-profile v-show="$route.params.id === currentUser.username"></my-page-profile>
        <user-page-profile
          v-if="$route.name === 'User' && $route.params.id !== currentUser.username"
          :routeId="routeId"
        ></user-page-profile>
        <button
          v-show="$route.params.id === currentUser.username"
          @click="showModal = true"
        >UPLOAD</button>
        <button v-if="$route.name === 'User' && $route.params.id !== currentUser.username">SUBSCRIBE</button>
      </div>
      <div class="tab">
      </div>
    </div>
    <div class="contents">
      <content-list
        v-show="$route.params.id === currentUser.username"
        :username="currentUser.username"></content-list>
      <content-list
        v-if="$route.name === 'User' && $route.params.id !== currentUser.username"
        :username="$route.params.id"
      ></content-list>
    </div>
    <div v-if="true">
      <button @click="signOut">Sign Out</button>
    </div>
    <upload-modal v-if="showModal" @close="showModal = false"></upload-modal>
  </div>
</template>

<script>
import MyPageProfile from '../profile/MyPageProfile'
import UserPageProfile from '../profile/UserPageProfile'
import ContentList from '../content/ContentList'
import UploadModal from '../modal/UploadModal'
import { mapState } from 'vuex'

export default {
  name: 'User',
  components: {
    MyPageProfile, UserPageProfile, ContentList, UploadModal
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  data() {
    return {
      routeId: '',
      showModal: false
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.routeId = to.params.id
    next()
  },
  methods: {
    async signOut() {
      try {
        await this.$store.dispatch('AUTH_LOGOUT')
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
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
