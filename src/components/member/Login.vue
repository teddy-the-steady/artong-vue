<template class="contents__body">
  <div>
    <div class="form__logo"><router-link to="/"><b><i>4</i>rtong</b></router-link></div>
    <div class="form__box">
      <h1>Connect your wallet</h1>
      <p v-text="warning"></p>
      <div class="form__footer">
        <span>
          <button @click="signIn">MetaMask</button><br>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { menuDeactivate } from '../../mixin'
import MetaMaskOnboarding from '@metamask/onboarding';

export default {
  name: 'Login',
  mixins: [menuDeactivate],
  data() {
    return {
      warning: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    window.scrollTo({top: 0})
    next({
      query: {
        redirect: from.fullPath
      }
    })
  },
  methods: {
    async signIn() {
      try {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          if (accounts.length > 0) {
            const address = accounts[0]
            const authenticatedUser = await this.$store.dispatch('AUTH_REQUEST', address)
            await this.$store.dispatch('USER_REQUEST', authenticatedUser)

            const urlToRedirect = this.$router.history.current.query['redirect']
            if (urlToRedirect) {
              this.$router.push(urlToRedirect)
            } else {
              this.$router.push('/')
            }
          }
        } else {
          const onboarding = new MetaMaskOnboarding()
          onboarding.startOnboarding()
        }
      } catch (error) {
        this.warning = error.message
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
