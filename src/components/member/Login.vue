<template class="contents__body">
  <div>
    <div class="form__logo"><router-link to="/"><b><i>4</i>rtong</b></router-link></div>
    <div class="form__box">
      <h1>Connect your wallet</h1>
      <p v-text="warning"></p>
      <div class="form__footer">
        <button v-if="isMobile" @click="signInMobile()">
          <div class="spinner" :class="{active: isSpinnerActive}"></div>
          <span v-show="!isSpinnerActive">CONNECT</span>
        </button>
        <button v-else @click="signIn()">
          <div class="spinner" :class="{active: isSpinnerActive}"></div>
          <span v-show="!isSpinnerActive">METAMASK</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { menuDeactivate } from '../../mixin'
import MetaMaskOnboarding from '@metamask/onboarding'
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import { convertUtf8ToHex } from "@walletconnect/utils"

export default {
  name: 'Login',
  mixins: [menuDeactivate],
  data() {
    return {
      warning: '',
      isSpinnerActive: false,
    }
  },
  computed: {
    isMobile() {
      return this.$isMobile()
    },
    ...mapState({
      justSignedUp: state => state.auth.justSignedUp,
    })
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
          this.isSpinnerActive = true
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          if (accounts.length > 0) {
            const address = accounts[0]
            const cognitoUser = await this.$store.dispatch('AUTH_SIGN_IN_AND_UP', address)
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [address, cognitoUser.challengeParam.message],
            })
            await this.$store.dispatch('AUTH_VERIFY_USER', { cognitoUser, signature })
            const authenticatedUser = await this.$store.dispatch('AUTH_CHECK_CURRENT_USER')
            const member = await axios.get(`/members/${authenticatedUser.username}`)
            await this.$store.dispatch('CURRENT_USER', member)
            this.redirectAfterLogin()
          }
        } else {
          const onboarding = new MetaMaskOnboarding()
          onboarding.startOnboarding()
        }
      } catch (error) {
        if (error.code === 4001) { // INFO] User denied message signature
          this.warning = ''
        } else {
          this.warning = 'Oops, something went wrong! Please try again'
        }
        await this.$store.dispatch('AUTH_LOGOUT')
      } finally {
        this.isSpinnerActive = false
      }
    },
    async signInMobile() {
      const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: QRCodeModal,
      })
      try {
        if (!connector.connected) {
          connector.createSession()
        }

        connector.on('connect', async (error, payload) => {
          if (error) {
            throw error
          }
          this.isSpinnerActive = true
          const { accounts } = payload.params[0]
          const address = accounts[0]
          const cognitoUser = await this.$store.dispatch('AUTH_SIGN_IN_AND_UP', address)
          let signature = null
          try {
            signature = await connector.signPersonalMessage([address, convertUtf8ToHex(cognitoUser.challengeParam.message)])
          } catch (error) {
            this.isSpinnerActive = false
            connector.killSession()
            await this.$store.dispatch('AUTH_LOGOUT')
            throw error
          }
          await this.$store.dispatch('AUTH_VERIFY_USER', { cognitoUser, signature })
          const authenticatedUser = await this.$store.dispatch('AUTH_CHECK_CURRENT_USER')
          const member = await axios.get(`/members/${authenticatedUser.username}`)
          await this.$store.dispatch('CURRENT_USER', member)
          this.redirectAfterLogin()
        })
      } catch (error) {
        this.warning = 'Oops, something went wrong! Please try again'
        connector.killSession()
        await this.$store.dispatch('AUTH_LOGOUT')
        throw error
      } finally {
        this.isSpinnerActive = false
      }
    },
    redirectAfterLogin() {
      const urlToRedirect = this.$router.history.current.query['redirect']
      if (urlToRedirect) {
        this.$router.push(urlToRedirect)
      } else {
        this.$router.push('/')
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
  display: none;

  &.active {
    display: block;
    position: relative;
    height: 2px;
    width: 2px;
    margin: 0px auto;
    animation: rotation .6s infinite linear;
    border-left: 6px solid rgba(0,174,239,.15);
    border-right: 6px solid rgba(0,174,239,.15);
    border-bottom: 6px solid rgba(0,174,239,.15);
    border-top: 6px solid $artong-white;
    border-radius: 100%;
  }
}

@keyframes rotation {
  from {transform: rotate(0deg);}
  to {transform: rotate(359deg);}
}
</style>
