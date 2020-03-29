<template class="contents__body">
    <div>
        <div class="form__logo"><router-link to="/"><b><i>A</i>rtong</b></router-link></div>
        <div v-if="!signedIn && !user" class="form__box">
            <h1>Sign Up</h1>
            <input v-model="username" type="text" placeholder="Enter email"><br>
            <input v-model="password" type="password" placeholder="Enter password"><br>
            <input v-model="password2" type="password" placeholder="Enter password again"><br>
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
            <input v-model="code" type="text" placeholder="Enter your code"><br>
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
        .catch(err => console.log(err))
    },
    confirm () {
      Auth.confirmSignUp(this.username, this.code, {
        forceAliasCreation: true
      })
        .then(data => {
          this.$router.push('/')
        })
        .catch(err => console.log(err))
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

.form__footer button {
  width: 70px;
}
</style>
