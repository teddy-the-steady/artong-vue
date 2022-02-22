<template>
  <div>
    <div class="header">
      <div class="user-info">
        <my-page-profile></my-page-profile>
        <button @click="toggleModal">UPLOAD</button>
      </div>
      <div class="tab">
      </div>
    </div>
    <div class="contents">
      <content-list :key="componentKeyForRerender" :contentsApi="contentsApi"></content-list>
    </div>
    <div v-if="true">
      <button @click="signOut">Sign Out</button>
    </div>
    <upload-modal v-if="isModalOpen" @close="close"></upload-modal>
  </div>
</template>

<script>
import MyPageProfile from '../profile/MyPageProfile'
import ContentList from '../contentList/ContentList'
import UploadModal from '../modal/UploadModal'
import baseLazyLoading from '../../util/baseLazyLoading'
import { headerActivate } from '../../mixin'
import { mapState } from 'vuex'

export default {
  name: 'User',
  mixins: [headerActivate],
  components: {
    MyPageProfile, ContentList, UploadModal
  },
  extends: baseLazyLoading((to, callback) => {
    callback(function() {
      this.contentsApi = {
        url: '/auth/uploads',
        params: {id: to.params.id}
      }
    })
  }),
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      isModalOpen: state => state.menu.isModalOpen
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
      }
    }
  },
  methods: {
    async signOut() {
      try {
        await this.$store.dispatch('AUTH_LOGOUT')
        this.$router.go(this.$router.currentRoute)
      } catch (error) {
        console.log(error)
      }
    },
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
  .user-info {
    height: 30%;
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    padding: 50px 15px 15px 15px;

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
      padding: 30px 15px 15px 15px;

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
