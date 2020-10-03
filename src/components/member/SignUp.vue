<template class="contents__body">
    <div>
        <div class="form__logo"><router-link to="/"><b><i>A</i>rtong</b></router-link></div>
        <div class="form__box" v-if="!signedIn && !user">
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
        <confirm class="form__box" v-if="!signedIn && user" :username="user.username" :password="password"/>
    </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import Confirm from './Confirm'
import { memberMixin } from '../../mixin'
export default {
  name: 'SignUp',
  components: {
    Confirm
  },
  mixins: [memberMixin],
  data() {
    return {
      username: '',
      password: '',
      password2: '',
      warningSignUp: '',
      user: ''
    }
  },
  methods: {
    join() {
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
        .catch(err => { this.warningSignUp = err.message })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/member';

.form__box > button {
  width: 100%;
}
</style>
