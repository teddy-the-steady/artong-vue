<template>
  <div :key="componentKey">
    <div class="header">
      <div class="user-info">
        <artist-page-profile :member="member"></artist-page-profile>
      </div>
      <profile-tab :tabs="tabs"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArtistPageProfile from '../profile/ArtistPageProfile'
import ProfileTab from '../tabs/ProfileTab'
import baseLazyLoading from '../../util/baseLazyLoading'
import { getMembers } from '../../api/member'

export default {
  name: 'Artist',
  components: {
    ArtistPageProfile, ProfileTab
  },
  extends: baseLazyLoading((to, callback) => {
    callback(function() {
      this.tabs[0].api = {
        url: '/uploads',
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
      componentKey: 0,
      member: {},
      username: '',
      tabs: [
        {
          id: 1, label: 'Contributed', type: 'TOKENS',
          api: { url: '/uploads', params: {id: this.$route.params.id}, query: {} }
        },
        {
          id: 2, label: 'Projects', type: 'PROJECTS',
          api: { url: '', params: {}, query: {} }
        },
        {
          id: 3, label: 'Owned', type: 'TOKENS',
          api: { url: '', params: {}, query: {} }
        }
      ]
    }
  },
  methods: {
    forceRerender() {
      this.componentKey += 1
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
    this.$watch(
      () => this.$route,
      async (toRoute) => {
        if (toRoute.name === 'UserOrArtist' && toRoute.params.id !== this.currentUser.username) {
          this.username = toRoute.params.id
          this.forceRerender()
          this.member = await this.getMember(this.username)
        }
      }
    )
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.header {
  margin-top: 50px;

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
