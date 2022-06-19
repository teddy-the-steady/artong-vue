<template class="contents__body">
    <div>
        <div class="form__logo"><router-link to="/"><b><i>A</i>rtong</b></router-link></div>
        <div class="form__box" v-if="!confirming">
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
        <confirm class="form__box" v-if="confirming" :username="username" :password="password"/>
    </div>
</template>

<script>
import Auth from '@aws-amplify/auth'
import axios from 'axios'
import Confirm from './Confirm'
import { mapState } from 'vuex'
import { menuDeactivate } from '../../mixin'
export default {
  name: 'SignUp',
  components: {
    Confirm
  },
  mixins: [menuDeactivate],
  data() {
    return {
      username: '',
      password: '',
      password2: '',
      warningSignUp: ''
    }
  },
  computed: {
    ...mapState({
      confirming: state => state.auth.confirming
    })
  },
  methods: {
    async join() {
      if (!this.validateEmail(this.username)) {
        this.warningSignUp = 'Please use proper email'
        return
      }

      if (this.password !== this.password2) {
        this.warningSignUp = 'Passwords do not match'
        return
      }

      try {
        const authResult = await Auth.signUp({
          username: this.username,
          password: this.password,
          attributes: {
            email: this.username
          },
          validationData: [] // optional
        })

        // TODO] 아래 실패하면 에러처리부에서 코그니토 유저 없애야?? 코그니토-db 싱크 맞춤 목적
        // 코그니토 signUp으로 람다 트리거 할순 없을까
        await axios.post('/member', {
          email: this.username,
          auth_id: authResult.userSub
        })

        this.$store.commit('TOGGLE_CONFIRM')
      } catch (error) {
        this.warningSignUp = error.message
      }
    },
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
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
