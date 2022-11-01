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
import MyPageProfile from '../profile/MyPageProfile'
import ProfileTab from '../tabs/ProfileTab'
import { headerActivate } from '../../mixin'
import { mapState } from 'vuex'
import { graphql } from '../../api/graphql'

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
        { id: 1, label: 'Contributed', type: 'CONTENTS', api: {} },
        { id: 2, label: 'Created', type: 'PROJECTS', api: {} },
        { id: 3, label: 'Owned', type: 'CONTENTS', api: {} }
      ]
    }
  },
  created() {
    this.tabs[1].api = {
      func: graphql,
      body: {query: `
        query ProjectsByCreator($first: Int, $skip: Int, $creator: String) {
          projects(first: $first, skip: $skip, where: {creator: $creator}) {
            id
            creator
            owner
            name
            symbol
            maxAmount
            policy
            isDisabled
            createdAt
            updatedAt
            _db_project_s3key
            _db_project_thumbnail_s3key
            _db_background_s3key
            _db_background_thumbnail_s3key
          }
        }
      `, variables: {
          first: 1,
          skip: 0,
          creator: this.currentUser.wallet_address
        }
      }
    }
  },
  watch: {
    $route() {
      this.tabs[1].api = {
        func: graphql,
        body: {query: `
          query ProjectsByCreator($first: Int, $skip: Int, $creator: String) {
            projects(first: $first, skip: $skip, where: {creator: $creator}) {
              id
              creator
              owner
              name
              symbol
              maxAmount
              policy
              isDisabled
              createdAt
              updatedAt
              _db_project_s3key
              _db_project_thumbnail_s3key
              _db_background_s3key
              _db_background_thumbnail_s3key
            }
          }
        `, variables: {
            first: 1,
            skip: 0,
            creator: this.currentUser.wallet_address
          }
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
