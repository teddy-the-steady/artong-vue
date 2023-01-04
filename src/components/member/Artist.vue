<template>
  <div :key="componentKey">
    <div class="header">
      <div class="user-info">
        <ArtistPageProfile
          :member="member"
          @follow="follow"
          @unfollow="unfollow"
        ></ArtistPageProfile>
      </div>
      <ProfileTab v-if="member.id" :tabs="tabs" :sortOptions="sortOptions" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMemberByUsername } from '../../api/member'
import {
  graphql,
  queryProjectsByCreator,
  queryTokensByCreator,
  queryTokensByOwner,
} from '../../api/graphql'
import { postMemberFollower } from '../../api/member'
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
      currentUser: state => state.user.currentUser,
    }),
  },
  data() {
    return {
      componentKey: 0,
      member: {},
      username: '',
      tabs: [
        { id: 0, label: 'Owned', type: 'CONTENTS', api: {}, sort: {} },
        { id: 1, label: 'Created', type: 'PROJECTS', api: {}, sort: {} },
        { id: 2, label: 'Contributed', type: 'CONTENTS', api: {}, sort: {} },
      ],
      sortOptions: {
        newest: {
          name: 'Newest',
          orderBy: 'createdAt',
          orderDirection: 'desc',
        },
        oldest: {
          name: 'Oldest',
          orderBy: 'createdAt',
          orderDirection: 'asc',
        },
      },
    }
  },
  methods: {
    async getMember(username) {
      return await getMemberByUsername(username)
    },
    async follow() {
      try {
        this.member = await postMemberFollower({
          isFollowRequest: true,
          targetMemberId: this.member.id,
        })
      } catch (error) {
        console.log('오류 발생')
      }
    },
    async unfollow() {
      try {
        this.member = await postMemberFollower({
          isFollowRequest: false,
          targetMemberId: this.member.id,
        })
      } catch (error) {
        console.log('오류 발생')
      }
    },
  },
  async created() {
    this.username = this.$route.params.id
    this.member = await this.getMember(this.username)

    this.tabs[0].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[0].api = {
      func: graphql,
      body: queryTokensByOwner({
        variables: {
          first: 10,
          skip: 0,
          owner: this.member.wallet_address,
          orderBy: this.tabs[0].sort.orderBy,
          orderDirection: this.tabs[0].sort.orderDirection,
        },
      }),
    }

    this.tabs[1].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[1].api = {
      func: graphql,
      body: queryProjectsByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.member.wallet_address,
          orderBy: this.tabs[1].sort.orderBy,
          orderDirection: this.tabs[1].sort.orderDirection,
        },
      }),
    }

    this.tabs[2].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[2].api = {
      func: graphql,
      body: queryTokensByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.member.wallet_address,
          orderBy: this.tabs[1].sort.orderBy,
          orderDirection: this.tabs[1].sort.orderDirection,
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
      const t = to.query.tab || '0'
      this.tabs[t].sort =
        this.sortOptions[to.query.sort] || this.sortOptions['newest']
      switch (t) {
        case '0':
          this.tabs[t].api = {
            func: graphql,
            body: queryTokensByOwner({
              variables: {
                first: 10,
                skip: 0,
                owner: to.params.wallet_address || this.member.wallet_address,
                orderBy: this.tabs[t].sort.orderBy,
                orderDirection: this.tabs[t].sort.orderDirection,
              },
            }),
          }
          break
        case '1':
          this.tabs[t].api = {
            func: graphql,
            body: queryProjectsByCreator({
              variables: {
                first: 10,
                skip: 0,
                creator: to.params.wallet_address || this.member.wallet_address,
                orderBy: this.tabs[t].sort.orderBy,
                orderDirection: this.tabs[t].sort.orderDirection,
              },
            }),
          }
          break
        case '2':
          this.tabs[t].api = {
            func: graphql,
            body: queryTokensByCreator({
              variables: {
                first: 10,
                skip: 0,
                creator: to.params.wallet_address || this.member.wallet_address,
                orderBy: this.tabs[t].sort.orderBy,
                orderDirection: this.tabs[t].sort.orderDirection,
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
  max-width: 1392px;
  margin-left: auto;
  margin-right: auto;
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
@media only screen and (min-width: 1440px) {
  .header {
    max-width: 1392px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
