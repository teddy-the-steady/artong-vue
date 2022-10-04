<template>
  <div :key="componentKey">
    <div class="header">
      <div class="user-info">
        <artist-page-profile :member="member"></artist-page-profile>
      </div>
      <profile-tab v-if="member.id" :tabs="tabs"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArtistPageProfile from '../profile/ArtistPageProfile'
import ProfileTab from '../tabs/ProfileTab'
import baseLazyLoading from '../../util/baseLazyLoading'
import { getMembers } from '../../api/member'
import { getProjects } from '../../api/projects'
import { CREATED } from '../../constants'

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
        { id: 1, label: 'Contributed', type: 'TOKENS', api: {} },
        { id: 2, label: 'Projects', type: 'PROJECTS', api: {} },
        { id: 3, label: 'Owned', type: 'TOKENS', api: {} }
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

    this.tabs[1].api = {
      func: getProjects,
      query: {
        start_num: 0,
        count_num: 5,
        member_id: this.member.id,
        status: CREATED
      }
    }

    this.$watch(
      () => this.$route,
      async (to, from) => {
        if (to.path === from.path) {
          return
        }
        if (to.name === 'UserOrArtist' && to.params.id !== this.currentUser.username) {
          this.username = to.params.id
          this.forceRerender()
          this.member = await this.getMember(this.username)
        }
      }
    )
  },
  watch: {
    $route() {
      this.tabs[1].api = {
        func: getProjects,
        query: {
          start_num: 0,
          count_num: 5,
          member_id: this.member.id,
          status: CREATED
        }
      }
    }
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
