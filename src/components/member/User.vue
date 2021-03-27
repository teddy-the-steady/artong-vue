<template>
  <div>
    <div class="header">
      <div class="user-info">
        <user-page-profile v-if="this.$store.state.user"></user-page-profile>
        <button>SUBSCRIBE</button>
      </div>
      <div class="tab">

      </div>
    </div>
    <div>
      <content-list></content-list>
    </div>
    <div v-if="signedIn">
      <button @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import UserPageProfile from '../profile/UserPageProfile'
import ContentList from '../content/ContentList'

export default {
  name: 'User',
  components: {
    UserPageProfile, ContentList
  },
  beforeRouteEnter(to, from, next) {
    window.scrollTo({top: 0})
    next()
  },
  computed: {
    signedIn() {
      return this.$store.state.signedIn
    }
  },
  methods: {
    signOut() {
      Auth.signOut()
        .then(data => {
          this.$store.state.signedIn = !!data
          this.$store.state.user = null
          this.$router.push('/')
        })
        .catch(err => console.log(err))
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
