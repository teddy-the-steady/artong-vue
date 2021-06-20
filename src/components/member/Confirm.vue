<template>
    <div>
      <h2>Confirm Sign Up</h2>
      <div class="form__username">
        <p v-text="warningConfirm"></p>
        <input v-model="verificationCode" v-on:keyup.enter="confirm" type="text" placeholder="Enter your code">
        <a @click="resendConfirmationCode">Resend verification code</a>
      </div>
      <div class="form__footer">
        <span>
          <button @click="confirm">Submit</button>
        </span>
        <span>
          Back to <a @click="backToLogin">Log In</a>
        </span>
      </div>
    </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { menuDeactivate } from '../../mixin'
export default {
  name: 'Confirm',
  mixins: [menuDeactivate],
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
  data() {
    return {
      warningConfirm: '',
      verificationCode: ''
    }
  },
  methods: {
    async confirm() {
      try {
        const { username, password, verificationCode } = this
        await Auth.confirmSignUp(username, verificationCode, {
          forceAliasCreation: true
        })

        await this.$store.dispatch('AUTH_REQUEST', { username, password })
        this.$store.commit('TOGGLE_CONFIRM')
        this.$router.push('/')
      } catch (error) {
        this.warningConfirm = error.message
        if (error.code === 'NotAuthorizedException') {
          this.backToLogin()
        }
      }
    },
    async resendConfirmationCode() {
      try {
        await Auth.resendSignUp(this.username)
        this.warningConfirm = 'code resent successfully'
      } catch (error) {
        this.warningConfirm = 'error resending code:' + error
      }
    },
    async backToLogin() {
      this.$store.commit('TOGGLE_CONFIRM')
      this.$router.push('/login')
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
