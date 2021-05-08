<template class="contents__body">
  <div>
    <div class="form__logo"><router-link to="/"><b><i>A</i>rtong</b></router-link></div>
    <div class="form__box" v-if="!currentUser.id && !user">
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
    <confirm class="form__box" v-if="!currentUser.id && user" :username="user" :password="password" @empty-user="emptyUser"/>
    <div v-if="currentUser.id">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import { menuDeactivate } from '../../mixin'
import Confirm from './Confirm'
import { mapState } from 'vuex'
export default {
  name: 'Login',
  components: {
    Confirm
  },
  mixins: [menuDeactivate],
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
  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },
  methods: {
    emptyUser(errMessage) {
      this.user = ''
      this.warning = errMessage
    },
    async signIn() {
      try {
        const { username, password } = this
        await this.$store.dispatch('AUTH_REQUEST', { username, password })
        this.$router.push('/')
      } catch (error) {
        this.warning = error.message
        if (error.code === 'UserNotConfirmedException') {
          this.user = this.username
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/member';

.form__password {
    margin-bottom: 25px;
}

.spinner {
  display: block;
  position: relative;
  top: 9px;
  height: 30px;
  width: 30px;
  margin: 0px auto;
  animation: rotation .6s infinite linear;
  border-left: 6px solid rgba(0,174,239,.15);
  border-right: 6px solid rgba(0,174,239,.15);
  border-bottom: 6px solid rgba(0,174,239,.15);
  border-top: 6px solid rgba(0,174,239,.8);
  border-radius: 100%;
}

@keyframes rotation {
  from {transform: rotate(0deg);}
  to {transform: rotate(359deg);}
}
</style>
