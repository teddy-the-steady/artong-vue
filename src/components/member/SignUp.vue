<template class="contents__body">
    <div>
        <div class="form__logo"><router-link to="/"><b><i>A</i>rtong</b></router-link></div>
        <div v-if="!signedIn && !user" class="form__box">
            <h1>Sign Up</h1>
            <div class="form__username">
              <p v-text="warningSignUp"></p>
              <input v-model="username" type="text" placeholder="Enter email">
            </div>
            <input v-model="password" type="password" placeholder="Enter password">
            <input v-model="password2" v-on:keyup.enter="join" type="password" placeholder="Enter password again">
            <div class="form__footer">
              <span>
                <button @click="join">Join</button>
              </span>
              <span>
                Have an account? <router-link to="/login">Log In</router-link>
              </span>
            </div>
        </div>
        <div v-if="!signedIn && user" class="form__box">
            <h2>Confirm Sign Up</h2>
            <div class="form__username">
              <p v-text="warningConfirm"></p>
              <input v-model="code" type="text" placeholder="Enter your code">
            </div>
            <button @click="confirm">Submit</button>
        </div>
    </div>
</template>

<script>
import { Auth } from 'aws-amplify'
export default {
  name: 'SignUp',
  data () {
    return {
      username: '',
      password: '',
      password2: '',
      warningSignUp: '',
      warningConfirm: '',
      code: '',
      user: ''
    }
  },
  computed: {
    signedIn () {
      return this.$store.state.signedIn
    }
  },
  methods: {
    join () {
      if (this.password !== this.password2) {
        this.warningSignUp = 'Passwords do not match'
        return
      }
      Auth.signUp({
        username: this.username,
        password: this.password,
        attributes: {
          email: this.username
        },
        validationData: [] // optional
      })
        .then(data => {
          this.user = data.user
        })
        .catch(err => this.warningSignUp = err.message)
    },
    confirm () {
      Auth.confirmSignUp(this.username, this.code, {
        forceAliasCreation: true
      })
        .then(data => {
          this.$router.push('/')
        })
        .catch(err => this.warningConfirm = err.message)
    }
  },
  mounted () {
    this.$store.commit('setBrowserNavFalse')
    this.$store.commit('setNavFalse')
  }
}
</script>

<style scoped>
@import '../../assets/css/member.css';

.form__box > button {
  width: 100%;
}
</style>
