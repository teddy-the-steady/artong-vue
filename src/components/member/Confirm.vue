<template>
    <div>
      <h2>Confirm Sign Up</h2>
      <h3>For user: <span>{{username}}</span></h3>
      <div class="form__username">
        <p v-text="warningConfirm"></p>
        <input v-model="code" type="text" placeholder="Enter your code">
      </div>
      <button @click="confirm">Submit</button>
    </div>
</template>

<script>
import { Auth } from 'aws-amplify'
export default {
  name: 'Confirm',
  props: {
    username: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      warningConfirm: '',
      code: ''
    }
  },
  computed: {
    signedIn () {
      return this.$store.state.signedIn
    }
  },
  methods: {
    confirm () {
      Auth.confirmSignUp(this.username, this.code, {
        forceAliasCreation: true
      })
        .then(data => {
          this.signIn(this.username, this.password)
        })
        .catch(err => { this.warningConfirm = err.message })
    },
    signIn () {
      Auth.signIn(this.username, this.password)
        .then(user => {
          this.$store.state.signedIn = !!user
          this.$store.state.user = user
          this.$router.push('/')
        })
        .catch(err => {
          this.$emit('empty-user', err.message)
        })
    }
  },
  mounted () {
    this.$store.commit('setBrowserNavFalse')
    this.$store.commit('setNavFalse')
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/member';

.form__box > button {
  width: 100%;
}
</style>
