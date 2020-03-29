<template class="contents__body">
  <div>
    <div class="form__logo"><router-link to="/"><b><i>A</i>rtong</b></router-link></div>
    <div v-if="!signedIn" class="form__box">
      <h1>Log In</h1>
      <input v-model="username" type="text" placeholder="Enter email"><br>
      <div class="form__password">
        <input v-model="password" type="password" placeholder="Enter password">
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
    <div v-if="signedIn">
      <button @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { AmplifyEventBus } from 'aws-amplify-vue'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  created () {
    this.findUser()

    AmplifyEventBus.$on('authState', info => {
      if (info === 'signedIn') {
        this.findUser()
      } else {
        this.$store.state.signedIn = false
        this.$store.state.user = null
      }
    })
  },
  computed: {
    signedIn () {
      return this.$store.state.signedIn
    }
  },
  methods: {
    signIn () {
      Auth.signIn(this.username, this.password)
        .then(user => {
          this.$store.state.signedIn = !!user
          this.$store.state.user = user
        })
        .catch(err => console.log(err))
    },
    signOut () {
      Auth.signOut()
        .then(data => {
          this.$store.state.signedIn = !!data
          this.$store.state.user = null
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
  },
  mounted () {
    this.$store.commit('setBrowserNavFalse')
    this.$store.commit('setNavFalse')
  }
}
</script>

<style scoped>
@import '../../assets/css/member.css';

.form__password {
    margin-bottom: 25px;
}

.form__footer button {
    width: 90px;
}
</style>
