<template>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  name: 'Logout',
  data () {
    return {
      username: '',
      password: '',
      warning: '',
      user: ''
    }
  },
  created () {
    this.findUser()
  },
  methods: {
    emptyUser (errMessage) {
      this.user = ''
      this.warning = errMessage
    },
    signIn () {
      Auth.signIn(this.username, this.password)
        .then(user => {
          this.$store.state.signedIn = !!user
          this.$store.state.user = user
          this.$router.push('/')
        })
        .catch(err => {
          this.warning = err.message
          if (err.code === 'UserNotConfirmedException') {
            this.user = this.username
          }
        })
    },
    signOut () {
      Auth.signOut()
        .then(data => {
          this.$store.state.signedIn = !!data
          this.$store.state.user = null
          this.$router.push('/')
        })
        .catch(err => console.log(err))
    },
    async findUser () {
      try {
        const user = await Auth.currentAuthenticatedUser()
        this.$store.state.signedIn = true
        this.$store.state.user = user
      } catch (err) {
        this.$store.state.signedIn = false
        this.$store.state.user = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
