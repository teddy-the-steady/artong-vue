<template>
  <div>
    <h1>This is Server Information</h1>
    <h2 v-if="info.data">{{ info.data }}</h2>
    <h2 v-else>로그인 하세요</h2>
    <content-list></content-list>
  </div>
</template>

<script>
import axios from 'axios'
import { headerActivate } from '../../mixin'
import ContentList from '../content/ContentList'
export default {
  name: 'Server',
  mixins: [headerActivate],
  components: {
    ContentList
  },
  data() {
    return {
      info: ''
    }
  },
  mounted() {
    if (this.$store.state.cognitoUser) {
      const jwt = this.$store.state.cognitoUser
        .getSignInUserSession()
        .getAccessToken()
        .getJwtToken()

      const config = {
        headers: {
          Authorization: jwt
        }
      }

      axios.get('https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/test/product/1', config)
        .then(val => { this.info = val })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1, h2 {
  color: $artong-black;
}
</style>
