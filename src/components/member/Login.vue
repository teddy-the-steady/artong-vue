<template>
  <div class="login__body">
    <div class="form__logo">
      <router-link to="/">
        <img class="logo" src="../../assets/icons/logo.svg" />
      </router-link>
    </div>
    <div class="form__box">
      <div class="form__header">
        <h1>
          {{ $t('views.login.title') }}
        </h1>
        <TooltipIcon :tip="$t('views.login.header')" />
      </div>
      <p v-text="warning"></p>
      <div class="form__footer">
        <button v-if="isMobile" @click="signInMobile()">
          <span class="spinner" :class="{ active: isSpinnerActive }"></span>
          <span v-show="!isSpinnerActive">{{
            $t('views.login.button.connect')
          }}</span>
        </button>
        <button v-else @click="signIn()">
          <span class="spinner" :class="{ active: isSpinnerActive }"></span>
          <span v-show="!isSpinnerActive">{{
            $t('views.login.button.metamask')
          }}</span>
        </button>
      </div>
    </div>
    <div class="form__notification">
      <p class="padding">
        {{ $t('views.login.privacy.1') }}
        <a
          class="form__notification_click"
          href="#"
          @click="togglePrivacyTosModal(), toggleModalType('tos')"
          >{{ $t('views.login.privacy.2') }}</a
        >
        {{ $t('views.login.privacy.3') }}
        <a
          class="form__notification_click"
          href="#"
          @click="togglePrivacyTosModal(), toggleModalType('privacy')"
          >{{ $t('views.login.privacy.4') }}</a
        >
        {{ $t('views.login.privacy.5') }}
      </p>
    </div>
    <PrivacyTosModal v-if="isPrivacyTosModalOpen" :modalType="modalType" />
  </div>
</template>

<script>
import MetaMaskOnboarding from '@metamask/onboarding'
import { mapState } from 'vuex'
import { getCurrentMember } from '../../api/member'
import { menuDeactivate } from '../../mixin'
import Provider from '../../util/walletConnectProvider'
import TooltipIcon from '../util/ToolTipIcon.vue'
import PrivacyTosModal from '../modal/Privacy&TosModal.vue'

export default {
  name: 'Login',
  mixins: [menuDeactivate],
  components: {
    TooltipIcon,
    PrivacyTosModal,
  },
  data() {
    return {
      warning: '',
      isSpinnerActive: false,
      modalType: null,
    }
  },
  computed: {
    isMobile() {
      return this.$isMobile()
    },
    ...mapState({
      justSignedUp: state => state.auth.justSignedUp,
      isPrivacyTosModalOpen: state => state.menu.isPrivacyTosModalOpen,
    }),
  },
  beforeRouteEnter(to, from, next) {
    window.scrollTo({ top: 0 })
    next({
      query: {
        redirect: from.fullPath,
      },
    })
  },
  methods: {
    async signIn() {
      if (this.isSpinnerActive) {
        return
      }
      try {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
          this.isSpinnerActive = true
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          })
          if (accounts.length > 0) {
            const address = accounts[0]
            const cognitoUser = await this.$store.dispatch(
              'AUTH_SIGN_IN_AND_UP',
              {
                address: address,
              },
            )
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [address, cognitoUser.challengeParam.message],
            })
            await this.$store.dispatch('AUTH_VERIFY_USER', {
              cognitoUser,
              signature,
            })
            await this.$store.dispatch('AUTH_CHECK_CURRENT_USER')
            const member = await getCurrentMember()
            await this.$store.dispatch('CURRENT_USER', member)
            this.$store.commit(
              'WALLET_CHAIN',
              parseInt(window.ethereum.networkVersion),
            )
            this.$store.commit('WALLET_ACCOUNT', address)
            this.redirectAfterLogin()
          }
        } else {
          const onboarding = new MetaMaskOnboarding()
          onboarding.startOnboarding()
        }
      } catch (error) {
        if (error.code === 4001) {
          // INFO] User denied message signature
          this.warning = ''
        } else if (error.code === -32002) {
          this.warning = 'Please check your metamask'
        } else {
          this.warning = 'Oops, something went wrong! Please try again'
        }
        await this.$store.dispatch('AUTH_LOGOUT')
      } finally {
        this.isSpinnerActive = false
      }
    },
    async signInMobile() {
      if (this.isSpinnerActive) {
        return
      }

      try {
        this.isSpinnerActive = true
        Provider.setWalletConnectSigner()
        const { connector, address } = await this.$store.dispatch(
          'SET_UP_WALLET_CONNECTION',
        )
        if (connector) {
          let signature = null
          const cognitoUser = await this.$store.dispatch(
            'AUTH_SIGN_IN_AND_UP',
            {
              address: address,
            },
          )
          if (cognitoUser) {
            this.$store.commit('TOGGLE_CONFIRM_MODAL')
            const ok =
              await this.$root.$children[0].$refs.confirmModal.waitForAnswer()
            if (ok) {
              try {
                signature = await connector.signPersonalMessage([
                  cognitoUser.challengeParam.message,
                  address,
                ])
              } catch (error) {
                this.isSpinnerActive = false
                connector.killSession()
                await this.$store.dispatch('AUTH_LOGOUT')
                throw error
              }
            }
          }

          if (signature) {
            await this.$store.dispatch('AUTH_VERIFY_USER', {
              cognitoUser,
              signature,
            })
            await this.$store.dispatch('AUTH_CHECK_CURRENT_USER')
            const member = await getCurrentMember()
            await this.$store.dispatch('CURRENT_USER', member)

            this.redirectAfterLogin()
          }
        }
      } catch (error) {
        this.warning = 'Oops, something went wrong! Please try again'
        if (error.message === 'Cancelled signing message') {
          this.warning = error.message
        }
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
        this.$router.push({ name: 'Main' })
      }
    },
    togglePrivacyTosModal() {
      this.$store.commit('TOGGLE_PRIVACY_TOS_MODAL')
    },
    toggleModalType(type) {
      this.modalType = type
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.padding {
  padding-left: 27px;
  padding-right: 27px;
}
.login__body {
  height: 100vh;
  background: $artong-black;

  .form__logo {
    padding: 100px 0 20px;

    .logo {
      width: 300px;
      filter: brightness(0) invert(1);
    }

    a {
      b {
        color: $artong-white;
      }
      text-decoration: none;
    }
  }

  .form__box {
    background-color: $artong-white;
    padding: 35px 40px;
    text-align: left;
    display: inline-block;
    border-radius: 6px;
    box-shadow: 8px 8px 15px 0 rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    min-width: 320px;
    color: black;

    .form__header {
      display: flex;
      justify-content: center;

      h1 {
        margin: 0;
      }
    }

    h3 > span {
      text-decoration: underline;
    }

    input {
      display: block;
      width: 100%;
      padding: 16px;
      font-size: 14px;
      background-image: none;
      border: 1px solid $lightgray;
      border-radius: 3px;
      box-sizing: border-box;
      margin-bottom: 20px;
    }

    .form__username p {
      width: 230px;
    }

    .form__footer {
      button {
        width: 100%;
      }

      & > span:nth-child(2) {
        align-self: center;
      }
    }
  }
  .form__notification {
    margin-top: 2vh;
    text-align: center;
    font-size: 15px;
    color: $artong-white;

    .form__notification_click {
      color: rgb(130, 192, 255);
      text-decoration: underline;
    }
  }

  .modal {
    transition: opacity 0.2s ease;
  }
}

@media only screen and (max-width: 599px) {
  .login__body {
    padding-top: 0;

    .form__box {
      width: 80%;
      box-sizing: border-box;
      border-radius: 6px;
      box-shadow: 8px 8px 15px 0 rgba(0, 0, 0, 0.5);
      padding: 30px 25px 35px;

      .form__footer {
        flex-wrap: wrap;

        & > span:nth-child(1) {
          width: 100%;

          & > button {
            width: 100%;
            margin-bottom: 32px;
          }
        }

        & > span:nth-child(2) {
          align-self: center;
          text-align: center;
          flex: 0 0 100%;
        }
      }
    }
  }
}
</style>
