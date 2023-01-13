<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="user-info">
          <MyPageProfile></MyPageProfile>
        </div>
        <UserProfileButtons class="edit-button"></UserProfileButtons>
      </div>
      <ProfileTab :tabs="tabs" :sortOptions="sortOptions" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import {
  graphql,
  queryProjectsByCreator,
  queryTokensByCreator,
  queryTokensByOwner,
} from '../../api/graphql'
import { getMemberContentsCandidates } from '../../api/projects'
import MyPageProfile from '../profile/MyPageProfile.vue'
import ProfileTab from '../tabs/ProfileTab.vue'
import UserProfileButtons from '../button_group/UserProfileButtons.vue'
export default {
  name: 'User',
  mixins: [headerActivate],
  components: {
    MyPageProfile,
    ProfileTab,
    UserProfileButtons,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      walletConnectState: state => state.wallet,
    }),
  },
  data() {
    return {
      username: '',
      tabs: [
        { id: 0, label: 'Owned', type: 'CONTENTS', api: {}, sort: {} },
        { id: 1, label: 'Created', type: 'PROJECTS', api: {}, sort: {} },
        { id: 2, label: 'Contributed', type: 'CONTENTS', api: {}, sort: {} },
        { id: 3, label: 'Candidates', type: 'CONTENTS', api: {}, sort: {} },
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
  created() {
    this.tabs[0].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[0].api = {
      func: graphql,
      body: queryTokensByOwner({
        variables: {
          first: 10,
          skip: 0,
          owner: this.currentUser.wallet_address,
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
          creator: this.currentUser.wallet_address,
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
          creator: this.currentUser.wallet_address,
          orderBy: this.tabs[2].sort.orderBy,
          orderDirection: this.tabs[2].sort.orderDirection,
        },
      }),
    }

    this.tabs[3].sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.tabs[3].api = {
      func: getMemberContentsCandidates,
      pathParams: { member_id: this.currentUser.id },
      queryParams: {
        start_num: 0,
        count_num: 10,
        orderBy: this.tabs[3].sort.orderBy,
        orderDirection: this.tabs[3].sort.orderDirection,
      },
    }
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
                owner: this.currentUser.wallet_address,
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
                creator: this.currentUser.wallet_address,
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
                creator: this.currentUser.wallet_address,
                orderBy: this.tabs[t].sort.orderBy,
                orderDirection: this.tabs[t].sort.orderDirection,
              },
            }),
          }
          break
        case '3':
          this.tabs[t].api = {
            func: getMemberContentsCandidates,
            pathParams: { member_id: this.currentUser.id },
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
.container {
  max-width: 1392px;
  margin-left: auto;
  margin-right: auto;

  .header {
    margin-top: 50px;

    .user-info {
      height: 30%;

      button {
        padding: 10px;
        border-radius: 10px;
      }
    }
    .edit-button {
      margin-left: 16px;
      margin-right: 16px;
      margin-bottom: 46px;
    }
    .tab {
      height: 50px;
    }
  }

  .contents {
    padding: 0 10%;
  }
}

@media only screen and (min-width: 1080px) {
  .container {
    .header {
      .edit-button {
        width: 89px;
        height: 48px;
        margin-left: auto;
        margin-bottom: 8px;
      }
    }
  }
}

@media only screen and (min-width: 1440px) {
  .container {
    max-width: 1392px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
