<template>
  <div>
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

      axios.get('/product/1', config)
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
