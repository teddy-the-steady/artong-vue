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
import { getMemberByUsername, postMemberFollower } from '../../api/member'
import {
  getMemberContentsCandidates,
  getMemberContentsFavorites,
} from '../../api/projects'
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
      currentUser: state => state.user.currentUser,
    }),
    sortOptions() {
      return {
        newest: {
          name: this.$i18n.t('views.user.sort-options.newest'),
          orderBy: 'createdAt',
          orderDirection: 'desc',
        },
        oldest: {
          name: this.$i18n.t('views.user.sort-options.oldest'),
          orderBy: 'createdAt',
          orderDirection: 'asc',
        },
      }
    },
  },
  data() {
    return {
      componentKey: 0,
      member: {},
      tabs: [
        {
          id: 0,
          label: this.$i18n.t('views.user.tabs.contributed'),
          type: 'CONTENTS',
          api: {},
          sort: {},
        },
        {
          id: 1,
          label: this.$i18n.t('views.user.tabs.owned'),
          type: 'CONTENTS',
          api: {},
          sort: {},
        },
        {
          id: 2,
          label: this.$i18n.t('views.user.tabs.created'),
          type: 'PROJECTS',
          api: {},
          sort: {},
        },
        {
          id: 3,
          label: this.$i18n.t('views.user.tabs.candidates'),
          type: 'CONTENTS',
          api: {},
          sort: {},
        },
        {
          id: 4,
          label: this.$i18n.t('views.user.tabs.favorited'),
          type: 'CONTENTS',
          api: {},
          sort: {},
        },
      ],
      tabKey: 0,
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
    this.member = await this.getMember(this.$route.params.id)

    this.tabs[0].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[0].api = {
      func: graphql,
      body: queryTokensByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.member.wallet_address,
          orderBy: this.tabs[0].sort.orderBy,
          orderDirection: this.tabs[0].sort.orderDirection,
        },
      }),
    }

    this.tabs[1].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[1].api = {
      func: graphql,
      body: queryTokensByOwner({
        variables: {
          first: 10,
          skip: 0,
          owner: this.member.wallet_address,
          orderBy: this.tabs[1].sort.orderBy,
          orderDirection: this.tabs[1].sort.orderDirection,
        },
      }),
    }

    this.tabs[2].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[2].api = {
      func: graphql,
      body: queryProjectsByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.member.wallet_address,
          orderBy: this.tabs[2].sort.orderBy,
          orderDirection: this.tabs[2].sort.orderDirection,
        },
      }),
    }

    this.tabs[3].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[3].api = {
      func: getMemberContentsCandidates,
      pathParams: { member_id: this.member.id },
      queryParams: {
        start_num: 0,
        count_num: 10,
        orderBy: this.tabs[3].sort.orderBy,
        orderDirection: this.tabs[3].sort.orderDirection,
      },
    }

    this.tabs[4].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[4].api = {
      func: getMemberContentsFavorites,
      pathParams: { member_id: this.member.id },
      queryParams: {
        start_num: 0,
        count_num: 10,
        orderBy: this.tabs[4].sort.orderBy,
        orderDirection: this.tabs[4].sort.orderDirection,
      },
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
          this.member = await this.getMember(to.params.id)
        }
      },
    )
  },
  watch: {
    async $route(to) {
      if (
        to.name === 'UserOrArtist' &&
        !to.params.wallet_address &&
        to.params.id !== this.member.username
      ) {
        this.member = await this.getMember(to.params.id)
        this.tabKey++
      }

      this.tabs[0].label = this.$i18n.t('views.user.tabs.contributed')
      this.tabs[1].label = this.$i18n.t('views.user.tabs.owned')
      this.tabs[2].label = this.$i18n.t('views.user.tabs.created')
      this.tabs[3].label = this.$i18n.t('views.user.tabs.candidates')
      this.tabs[4].label = this.$i18n.t('views.user.tabs.favorited')

      const t = to.query.tab || '0'
      this.tabs[t].sort =
        this.sortOptions[to.query.sort] || this.sortOptions['newest']
      switch (t) {
        case '0':
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
            key: this.tabKey,
          }
          break
        case '1':
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
            key: this.tabKey,
          }
          break
        case '2':
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
            key: this.tabKey,
          }
          break
        case '3':
          this.tabs[t].api = {
            func: getMemberContentsCandidates,
            pathParams: { member_id: this.member.id },
            queryParams: {
              start_num: 0,
              count_num: 10,
              orderBy: this.tabs[t].sort.orderBy,
              orderDirection: this.tabs[t].sort.orderDirection,
            },
          }
          break
        case '4':
          this.tabs[t].api = {
            func: getMemberContentsFavorites,
            pathParams: { member_id: this.member.id },
            queryParams: {
              start_num: 0,
              count_num: 10,
              orderBy: this.tabs[t].sort.orderBy,
              orderDirection: this.tabs[t].sort.orderDirection,
            },
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
