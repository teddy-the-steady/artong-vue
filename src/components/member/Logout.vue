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
    async signOut() {
      try {
        await this.$store.dispatch('AUTH_LOGOUT')
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
