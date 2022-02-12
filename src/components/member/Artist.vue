<template>
  <div>
    <div class="header">
      <div class="user-info">
        <artist-page-profile v-if="$route.name === 'Artist'"></artist-page-profile>
        <button v-if="$route.name === 'Artist'">SUBSCRIBE</button>
      </div>
      <div class="tab">
      </div>
    </div>
    <div class="contents">
      <content-list :contentsApi="contentsApi" v-if="$route.name === 'Artist'"></content-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArtistPageProfile from '../profile/ArtistPageProfile'
import ContentList from '../content/ContentList'
import baseLazyLoading from '../../util/baseLazyLoading'

export default {
  name: 'Artist',
  components: {
    ArtistPageProfile, ContentList
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  extends: baseLazyLoading((to, callback) => {
    callback(function() {
      this.contentsApi = {
        url: this.currentUser.id? '/auth/uploads' : '/uploads',
        params: {id: to.params.id}
      }
    })
  }),
  data() {
    return {
      contentsApi: {
        url: '',
        params: {},
        query: {}
      }
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
