<template>
  <div :key="componentKey">
    <div class="header">
      <div class="user-info">
        <artist-page-profile :member="member"></artist-page-profile>
      </div>
      <profile-tab v-if="member.id" :tabs="tabs" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMembers } from '../../api/member'
import {
  graphql,
  queryProjectsByCreator,
  queryTokensByCreator,
  queryTokensByOwner,
} from '../../api/graphql'
import ArtistPageProfile from '../profile/ArtistPageProfile.vue'
import ProfileTab from '../tabs/ProfileTab.vue'

export default {
  name: 'Artist',
  components: {
    ArtistPageProfile,
    ProfileTab,
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  data() {
    return {
      componentKey: 0,
      member: {},
      username: '',
      tabs: [
        { id: 0, label: 'Owned', type: 'CONTENTS', api: {} },
        { id: 1, label: 'Created', type: 'PROJECTS', api: {} },
        { id: 2, label: 'Contributed', type: 'CONTENTS', api: {} },
      ],
    }
  },
  methods: {
    async getMember(username) {
      const member = await getMembers(username)
      if (member.length === 1) {
        return member[0]
      }
      return null
    },
  },
  async created() {
    this.username = this.$route.params.id
    this.member = await this.getMember(this.username)

    this.tabs[0].api = {
      func: graphql,
      body: queryTokensByOwner({
        variables: {
          first: 10,
          skip: 0,
          owner: this.member.wallet_address,
        },
      }),
    }

    this.tabs[1].api = {
      func: graphql,
      body: queryProjectsByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.member.wallet_address,
        },
      }),
    }

    this.tabs[2].api = {
      func: graphql,
      body: queryTokensByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.member.wallet_address,
        },
      }),
    }

    this.$watch(
      () => this.$route,
      async (to, from) => {
        if (to.path === from.path) {
          return
        }

        if (
          to.name === 'UserOrArtist' &&
          to.params.id !== this.currentUser.username
        ) {
          this.username = to.params.id
          this.member = await this.getMember(this.username)
        }
      },
    )
  },
  watch: {
    $route(to) {
      switch (to.query.tab || '0') {
        case '0':
          this.tabs[0].api = {
            func: graphql,
            body: queryTokensByOwner({
              variables: {
                first: 10,
                skip: 0,
                owner: to.params.wallet_address || this.member.wallet_address,
              },
            }),
          }
          break
        case '1':
          this.tabs[1].api = {
            func: graphql,
            body: queryProjectsByCreator({
              variables: {
                first: 10,
                skip: 0,
                creator: to.params.wallet_address || this.member.wallet_address,
              },
            }),
          }
          break
        case '2':
          this.tabs[2].api = {
            func: graphql,
            body: queryTokensByCreator({
              variables: {
                first: 10,
                skip: 0,
                creator: to.params.wallet_address || this.member.wallet_address,
              },
            }),
          }
          break
        default:
          break
      }
    },
  },
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
