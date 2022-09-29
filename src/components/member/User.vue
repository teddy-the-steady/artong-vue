<template>
  <div>
    <div class="header">
      <div class="user-info">
        <my-page-profile></my-page-profile>
        <button @click="toggleModal">Create Collection</button>
      </div>
      <div>address: {{walletConnectState.address}}</div>
      <div>chainId: {{walletConnectState.chainId}}</div>
    </div>
    <profile-tab :tabs="tabs"/>
    <upload-modal v-if="isModalOpen">
      <span slot="header" class="modal_header" @click="close">X</span>
    </upload-modal>
  </div>
</template>

<script>
import MyPageProfile from '../profile/MyPageProfile'
import UploadModal from '../modal/UploadModal'
import ProfileTab from '../tabs/ProfileTab'
import { headerActivate } from '../../mixin'
import { mapState } from 'vuex'
import { getProjects } from '../../api/projects'
import { CREATED } from '../../constants'

export default {
  name: 'User',
  mixins: [headerActivate],
  components: {
    MyPageProfile, UploadModal, ProfileTab
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      isModalOpen: state => state.menu.isModalOpen,
      walletConnectState: state => state.wallet
    })
  },
  data() {
    return {
      username: '',
      tabs: [
        { id: 1, label: 'Contributed', type: 'TOKENS', api: {} },
        { id: 2, label: 'Projects', type: 'PROJECTS', api: {} },
        { id: 3, label: 'Owned', type: 'TOKENS', api: {} }
      ]
    }
  },
  methods: {
    close() {
      this.toggleModal()
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
  },
  created() {
    this.tabs[1].api = {
      func: getProjects,
      query: {
        start_num: 0,
        count_num: 5,
        member_id: this.currentUser.id,
        status: CREATED
      }
    }
  },
  watch: {
    '$route': function() {
      this.tabs[1].api = {
        func: getProjects,
        query: {
          start_num: 0,
          count_num: 5,
          member_id: this.currentUser.id,
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

.modal_header {
  cursor: pointer;
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
