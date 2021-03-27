<template class="contents__body">
  <div>
    <div class="form__logo"><router-link to="/"><b><i>A</i>rtong</b></router-link></div>
    <div class="form__box" v-if="!signedIn && !user">
      <h1>Log In</h1>
      <div class="form__username">
        <p v-text="warning"></p>
        <input v-model="username" type="text" placeholder="Enter email">
      </div>
      <div class="form__password">
        <input v-model="password" v-on:keyup.enter="signIn" type="password" placeholder="Enter password">
        Forgot password? <router-link to="">Reset password</router-link>
      </div>
      <div class="form__footer">
        <span>
          <button @click="signIn">Log In</button><br>
        </span>
        <span>
          No account? <router-link to="/signUp">Sign Up</router-link>
        </span>
      </div>
    </div>
    <confirm class="form__box" v-if="!signedIn && user" :username="user" :password="password" @empty-user="emptyUser"/>
    <div v-if="signedIn">
      <button @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { menuDeactivate, memberMixin } from '../../mixin'
import Confirm from './Confirm'
import axios from 'axios'

export default {
  name: 'Login',
  components: {
    Confirm
  },
  mixins: [menuDeactivate, memberMixin],
  data() {
    return {
      username: '',
      password: '',
      warning: '',
      user: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    window.scrollTo({top: 0})
    next()
  },
  methods: {
    emptyUser(errMessage) {
      this.user = ''
      this.warning = errMessage
    },
    signIn() {
      Auth.signIn(this.username, this.password)
        .then(user => {
          this.$store.state.signedIn = !!user
          this.$store.state.cognitoUser = user
          this.getMember(this.$store.state.cognitoUser.username)
        })
        .catch(err => {
          this.warning = err.message
          if (err.code === 'UserNotConfirmedException') {
            this.user = this.username
          }
        })
    },
    getMember(id) {
      axios.get(`https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/artong/v1/member/${id}`)
        .then(val => {
          console.log('Login getMember')
          this.$store.state.user = val.data.data
          this.$router.push('/')
        })
        .catch(err => console.log(err))
    },
    signOut() {
      Auth.signOut()
        .then(data => {
          this.$store.state.signedIn = !!data
          this.$store.state.cognitoUser = null
          this.$store.state.user = null
          this.$router.push('/')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/member';

.form__password {
    margin-bottom: 25px;
}
</style>
