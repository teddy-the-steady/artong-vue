<template>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  name: 'Logout',
  data() {
    return {
      username: '',
      password: '',
      warning: '',
      user: ''
    }
  },
  methods: {
    emptyUser(errMessage) {
      this.user = ''
      this.warning = errMessage
    },
    signOut() {
      Auth.signOut()
        .then(data => {
          this.$store.state.signedIn = !!data
          this.$store.state.user = null
          this.$router.push('/')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
