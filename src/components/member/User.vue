<template>
  <div>
    <div class="header">
      <div class="user-info">
        <my-page-profile v-show="$route.params.id === currentUser.username"></my-page-profile>
        <user-page-profile v-if="$route.name === 'User' && $route.params.id !== currentUser.username"></user-page-profile>
        <button>SUBSCRIBE</button>
      </div>
      <div class="tab">

      </div>
    </div>
    <div>
      <content-list></content-list>
    </div>
    <div v-if="true">
      <button @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import MyPageProfile from '../profile/MyPageProfile'
import UserPageProfile from '../profile/UserPageProfile'
import ContentList from '../content/ContentList'
import { mapState } from 'vuex'

export default {
  name: 'User',
  components: {
    MyPageProfile, UserPageProfile, ContentList
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
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
    }
  }

  .tab {
    height: 50px;
  }
}

@media only screen and (max-width: 599px) {
  .header {
    .user-info {
      padding: 30px 15px 15px 15px;
    }
  }
}
</style>
