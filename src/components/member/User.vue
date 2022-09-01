<template>
  <div>
    <div class="header">
      <div class="background" :style="{'background': backgroundColor}">
      </div>
      <div class="user-info">
        <my-page-profile></my-page-profile>
        <button @click="toggleModal">Create Collection</button>
      </div>
      <div>address: {{walletConnectState.address}}</div>
      <div>chainId: {{walletConnectState.chainId}}</div>
      <div class="tab">
      </div>
    </div>
    <div class="contents">
      <content-list :key="componentKeyForRerender" :contentsApi="contentsApi"></content-list>
    </div>
    <upload-modal v-if="isModalOpen">
      <span slot="header" class="modal_header" @click="close">X</span>
    </upload-modal>
  </div>
</template>

<script>
import MyPageProfile from '../profile/MyPageProfile'
import ContentList from '../contents/ContentList'
import UploadModal from '../modal/UploadModal'
import { headerActivate, backgroundColor } from '../../mixin'
import { mapState } from 'vuex'

export default {
  name: 'User',
  mixins: [headerActivate, backgroundColor],
  components: {
    MyPageProfile, ContentList, UploadModal
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
      componentKeyForRerender: 0,
      contentsApi: {
        url: '',
        params: {},
        query: {}
      },
      backgroundColor: 'lightgrey'
    }
  },
  methods: {
    close(isSuccess) {
      this.toggleModal()
      if (isSuccess) { // TODO] 업로드 성공 이후 업로드한 컨텐츠가 안보이는 이슈,, s3업로드랑 db insert하는 람다트리거가 따로라서 발생.
        this.resetUserContentListKey(3000) // 3초후 reload말고 어떻게? 람다트리거 완료인지 클라에서 근본적으로 어떻게 알지? 어차피 성공하고 넘어오니까 클라이언트 배열에 그냥 이미지 삽입?
      }
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
    resetUserContentListKey(timeout) {
      setTimeout(() => {
        this.componentKeyForRerender = Math.round(Math.random() * 1000)
      }, timeout)
    }
  },
  mounted() {
    this.contentsApi = {
      url: '/auth/uploads',
      params: {id: this.$route.params.id}
    }
    this.backgroundColor = this.generateGradientBackground(this.currentUser.wallet_address)
  },
  watch: {
    $route() {
      window.scrollTo({top: 0})
    }
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

.modal_header {
  cursor: pointer;
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
