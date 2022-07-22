<template>
  <div :key="componentKey">
    <div class="header">
      <div class="background" :style="{'background': backgroundColor}">
      </div>
      <div class="user-info">
        <artist-page-profile :member="member"></artist-page-profile>
      </div>
      <div class="tab">
      </div>
    </div>
    <div class="contents">
      <content-list :contentsApi="contentsApi"></content-list>
    </div>
    <div v-if="true">
      <button @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArtistPageProfile from '../profile/ArtistPageProfile'
import ContentList from '../contents/ContentList'
import baseLazyLoading from '../../util/baseLazyLoading'
import { backgroundColor } from '../../mixin'
import { getMembers } from '../../api/member'

export default {
  name: 'Artist',
  mixins: [backgroundColor],
  components: {
    ArtistPageProfile, ContentList
  },
  extends: baseLazyLoading((to, callback) => {
    callback(function() {
      this.contentsApi = {
        url: this.currentUser.id? '/auth/uploads' : '/uploads',
        params: {id: this.$route.params.id}
      }
    })
  }),
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  data() {
    return {
      contentsApi: {
        url: '',
        params: {},
        query: {}
      },
      componentKey: 0,
      member: {},
      username: '',
      backgroundColor: 'white'
    }
  },
  methods: {
    forceRerender() {
      this.componentKey += 1
    },
    async signOut() {
      try {
        await this.$store.dispatch('AUTH_LOGOUT')
        this.$router.go(this.$router.currentRoute)
      } catch (error) {
        console.log(error)
      }
    },
    async getMember(username) {
      const member = await getMembers(username)
      if (member.length === 1) {
        return member[0]
      }
      return null
    }
  },
  async created() {
    this.username = this.$route.params.id
    this.member = await this.getMember(this.username)
    this.backgroundColor = this.generateGradientBackground(this.member.wallet_address)
    this.$watch(
      () => this.$route,
      async (toRoute) => {
        if (toRoute.name === 'UserOrArtist' && toRoute.params.id !== this.currentUser.username) {
          this.backgroundColor = 'white'
          this.username = toRoute.params.id
          this.forceRerender()
          this.member = await this.getMember(this.username)
          this.backgroundColor = this.generateGradientBackground(this.member.wallet_address)
        }
      }
    )
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.header {
  .background {
    height: 15em;
  }
  .user-info {
    height: 30%;

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
    .background {
      height: 10em;
    }
    .user-info {

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
