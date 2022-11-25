<template>
  <div>
    <div class="header">
      <div class="user-info">
        <my-page-profile></my-page-profile>
      </div>
      <div>address: {{walletConnectState.address}}</div>
      <div>chainId: {{walletConnectState.chainId}}</div>
    </div>
    <profile-tab :tabs="tabs"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import {
  graphql,
  queryProjectsByCreator,
  queryTokensByCreator,
  queryTokensByOwner
} from '../../api/graphql'
import MyPageProfile from '../profile/MyPageProfile.vue'
import ProfileTab from '../tabs/ProfileTab.vue'

export default {
  name: 'User',
  mixins: [headerActivate],
  components: {
    MyPageProfile, ProfileTab
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      walletConnectState: state => state.wallet
    })
  },
  data() {
    return {
      username: '',
      tabs: [
        { id: 0, label: 'Owned', type: 'CONTENTS', api: {} },
        { id: 1, label: 'Created', type: 'PROJECTS', api: {} },
        { id: 2, label: 'Contributed', type: 'CONTENTS', api: {} },
      ]
    }
  },
  created() {
    this.tabs[0].api = {
      func: graphql,
      body: queryTokensByOwner({
        variables: {
          first: 10,
          skip: 0,
          owner: this.currentUser.wallet_address
        }
      })
    }
    this.tabs[1].api = {
      func: graphql,
      body: queryProjectsByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.currentUser.wallet_address
        }
      })
    }
    this.tabs[2].api = {
      func: graphql,
      body: queryTokensByCreator({
        variables: {
          first: 10,
          skip: 0,
          creator: this.currentUser.wallet_address
        }
      })
    }
  },
  watch: {
    $route(val) {
      switch (val.query.tab || '0') {
        case '0':
          this.tabs[0].api = {
            func: graphql,
            body: queryTokensByOwner({
              variables: {
                first: 10,
                skip: 0,
                owner: this.currentUser.wallet_address
              }
            })
          }
          break;
        case '1':
          this.tabs[1].api = {
            func: graphql,
            body: queryProjectsByCreator({
              variables: {
                first: 10,
                skip: 0,
                creator: this.currentUser.wallet_address
              }
            })
          }
          break;
        case '2':
          this.tabs[2].api = {
            func: graphql,
            body: queryTokensByCreator({
              variables: {
                first: 10,
                skip: 0,
                creator: this.currentUser.wallet_address
              }
            })
          }
          break;
        default:
          break;
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
