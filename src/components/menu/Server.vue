<template>
  <div>
    <content-list-v3></content-list-v3>
  </div>
</template>

<script>
import axios from 'axios'
import { headerActivate } from '../../mixin'
import ContentListV3 from '../content/ContentListV3'
export default {
  name: 'Server',
  mixins: [headerActivate],
  components: {
    ContentListV3
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
