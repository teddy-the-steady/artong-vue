<template>
  <div>
    <h1>This is Server Information</h1>
    <h2 v-if="info.data">{{ info.data }}</h2>
    <h2 v-else>로그인 하세요</h2>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Server',
  data () {
    return {
      info: ''
    }
  },
  mounted () {
    this.$store.commit('setBrowserNavTrue')

    if (this.$store.state.user) {
      const jwt = this.$store.state.user
        .getSignInUserSession()
        .getAccessToken()
        .getJwtToken()

      const config = {
        headers: {
          Authorization: jwt
        }
      }

      axios.get('https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/test/product/1', config)
        .then(val => this.info = val)
        .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
h1, h2 {
  color: white;
}
</style>
