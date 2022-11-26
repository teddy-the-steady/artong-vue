<template>
  <div id="app">
    <header-bar id="header-bar"></header-bar>
    <side-bar id="side-bar"></side-bar>
    <div class="contents">
      <keep-alive>
        <router-view class="contents__body" />
      </keep-alive>
    </div>
    <confirm-modal
      v-show="isConfirmModalOpen"
      @close-modal="toggleConfirmModal"
      ref="confirmModal"
    >
      <span slot="body">Continue with your wallet</span>
    </confirm-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Auth } from '@aws-amplify/auth'
import { getMember } from './api/member'
import HeaderBar from './components/header/Header.vue'
import SideBar from './components/sidebar/SideBar.vue'
import ConfirmModal from './components/modal/ConfirmModal.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar,
    ConfirmModal,
  },
  computed: {
    ...mapState({
      isSideMenuOpen: (state) => state.menu.isSideMenuOpen,
      isModalOpen: (state) => state.menu.isModalOpen,
      authError: (state) => state.auth.status,
      walletConnectState: (state) => state.wallet,
      isConfirmModalOpen: (state) => state.menu.isConfirmModalOpen,
    }),
    ...mapGetters({
      getDefaultWalletConnectState: 'getDefaultWalletConnectState',
    }),
  },
  methods: {
    async getPcWalletOnFirstLoad() {
      if (window.ethereum && localStorage.getItem('userWalletConnectState')) {
        const metamaskSignedInAccount = await window.ethereum.request({
          method: 'eth_accounts',
        })
        if (metamaskSignedInAccount.length > 0) {
          this.$store.commit('WALLET_ACCOUNT', metamaskSignedInAccount[0])
          this.$store.commit(
            'WALLET_CHAIN',
            parseInt(window.ethereum.networkVersion),
          )
        }
      }
    },
    addPcWalletEventHandler() {
      window.addEventListener('load', () => {
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length > 0) {
              this.toggleConfirmModal()
              const ok = await this.$refs.confirmModal.waitForAnswer()
              if (ok) {
                await Auth.signOut()
                const cognitoUser = await this.$store.dispatch(
                  'AUTH_SIGN_IN_AND_UP',
                  {
                    address: accounts[0],
                  },
                )
                const signature = await window.ethereum.request({
                  method: 'personal_sign',
                  params: [accounts[0], cognitoUser.challengeParam.message],
                })
                await this.$store.dispatch('AUTH_VERIFY_USER', {
                  cognitoUser,
                  signature,
                })
                const authenticatedUser = await this.$store.dispatch(
                  'AUTH_CHECK_CURRENT_USER',
                )
                const member = await getMember(authenticatedUser.username)
                await this.$store.dispatch('CURRENT_USER', member)
                this.$store.commit('WALLET_ACCOUNT', accounts[0])
              }
            }
          })

          window.ethereum.on('chainChanged', (networkId) => {
            this.$store.commit('WALLET_CHAIN', parseInt(networkId, 16))
          })
        }
      })
    },
    toggleConfirmModal() {
      this.$store.commit('TOGGLE_CONFIRM_MODAL')
    },
  },
  async created() {
    try {
      const currentSession = await this.$store.dispatch(
        'AUTH_CHECK_CURRENT_SESSION',
      )
      const member = await getMember(
        currentSession.getAccessToken().payload.username,
      )
      await this.$store.dispatch('CURRENT_USER', member)
    } catch (error) {
      if (this.authError === 'error') {
        await this.$store.dispatch('AUTH_LOGOUT')
      } else if (error === 'No current user') {
        console.log('No current user')
      }
    }
  },
  async mounted() {
    this.addPcWalletEventHandler()
    await this.getPcWalletOnFirstLoad()
    await this.$store.dispatch(
      'AUTO_CONNECT_WALLET',
      this.getDefaultWalletConnectState,
    )
    this.$store.commit(
      'CONFIRM_MODAL_WAIT_FOR_ANSWER',
      this.$refs.confirmModal.waitForAnswer,
    )
  },
  watch: {
    isSideMenuOpen() {
      document.body.classList.toggle('prevent-scroll')
    },
    isModalOpen() {
      document.body.classList.toggle('prevent-scroll')
    },
    walletConnectState: {
      deep: true,
      handler(state) {
        localStorage.setItem('userWalletConnectState', JSON.stringify(state))
      },
    },
  },
}
</script>

<style lang="scss">
@import './assets/scss/variables';

html {
  font-size: 14px;
  height: 100%;

  .prevent-scroll {
    overflow: hidden;
  }

  body {
    margin: 0;
    height: 100%;
    overflow-y: scroll;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;

    a {
      color: $artong-black;
      text-decoration: none;
    }

    button {
      font-size: 12px;
      touch-action: manipulation;
      cursor: pointer;
      color: $artong-white;
      background-color: $artong-black;
      text-transform: uppercase;
      padding: 14px 0;
      letter-spacing: 1.1px;
      border: none;
    }

    #header-bar {
      z-index: 2020;
    }

    .contents__body {
      position: relative;
      background: $artong-white;
      height: 100%;
      padding-top: 50px;
    }
  }
}
</style>
