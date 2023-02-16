<template>
  <div id="app">
    <HeaderBar id="header-bar"></HeaderBar>
    <SideBar id="side-bar"></SideBar>
    <div class="contents">
      <keep-alive>
        <router-view class="contents__body" />
      </keep-alive>
    </div>
    <ConfirmModal
      v-show="isConfirmModalOpen"
      @close-modal="toggleConfirmModal"
      ref="confirmModal"
    >
      <span slot="body">{{ $t('common.modal.confirm-msg') }}</span>
    </ConfirmModal>
    <ToolTipModal v-show="isToolTipOpen"></ToolTipModal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Auth } from '@aws-amplify/auth'
import { getCurrentMember } from './api/member'
import HeaderBar from './components/header/Header.vue'
import SideBar from './components/sidebar/SideBar.vue'
import ConfirmModal from './components/modal/ConfirmModal.vue'
import ToolTipModal from './components/modal/ToolTipModal.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar,
    ConfirmModal,
    ToolTipModal,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
      isModalOpen: state => state.menu.isModalOpen,
      authError: state => state.auth.status,
      walletConnectState: state => state.wallet,
      isConfirmModalOpen: state => state.menu.isConfirmModalOpen,
      currentUser: state => state.user.currentUser,
      innerWidth: state => state.menu.innerWidth,
      isToolTipOpen: state => state.menu.isToolTipOpen,
    }),
    ...mapGetters({
      getDefaultWalletConnectState: 'getDefaultWalletConnectState',
    }),
    isMobile() {
      return this.$isMobile()
    },
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
          window.ethereum.on('accountsChanged', async accounts => {
            this.$store.commit('WALLET_ACCOUNT', accounts[0])
            if (this.currentUser.id && accounts.length > 0) {
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
                await this.$store.dispatch('AUTH_CHECK_CURRENT_USER')
                const member = await getCurrentMember()
                await this.$store.dispatch('CURRENT_USER', member)
              }
            }
          })

          window.ethereum.on('chainChanged', networkId => {
            this.$store.commit('WALLET_CHAIN', parseInt(networkId, 16))
          })
        }
      })
    },
    toggleConfirmModal() {
      this.$store.commit('TOGGLE_CONFIRM_MODAL')
    },
    setWidth() {
      this.$store.commit('SET_INNER_WIDTH', window.innerWidth)
    },
  },
  async created() {
    try {
      await this.$store.dispatch('AUTH_CHECK_CURRENT_SESSION')
      const member = await getCurrentMember()
      await this.$store.dispatch('CURRENT_USER', member)
    } catch (error) {
      await this.$store.dispatch('AUTH_LOGOUT')
    }
  },
  async mounted() {
    if (this.isMobile) {
      await this.$store.dispatch(
        'AUTO_CONNECT_WALLET',
        this.getDefaultWalletConnectState,
      )
    } else {
      this.addPcWalletEventHandler()
      await this.getPcWalletOnFirstLoad()
    }

    this.$store.commit(
      'CONFIRM_MODAL_WAIT_FOR_ANSWER',
      this.$refs.confirmModal.waitForAnswer,
    )

    window.addEventListener('resize', this.setWidth)
    this.$store.commit(
      'SET_LANGUAGE',
      this.currentUser.language || localStorage.getItem('language') || 'ko',
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
@import './assets/scss/ripple';

html {
  font-size: 14px;
  width: 100%;
  height: 100%;

  .prevent-scroll {
    overflow: hidden;
  }

  body {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;

    a {
      color: $artong-black;
      text-decoration: none;
    }

    button {
      color: $artong-white;
      background-color: $artong-black;
      border: 1px solid $artong-black;
      padding: 0.75rem 1.25rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s,
        box-shadow 0.2s;
      border-radius: 6px;
      &.white-button {
        background: #ffffff;
        border: 1px solid #000000;
        border-radius: 5px;
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
      }
      &.round-button {
        position: relative;
        width: 48px;
        height: 48px;
        border: none;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 999px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0px;
      }
      &.ripple {
        background-position: center;
        transition: background 0.8s;
      }
      &.dropdown {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 14px;
        box-sizing: border-box;

        width: 105px;
        height: 36px;
        background: #ffffff;
        border: 1px solid #f2f2f2;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 999px;

        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
      }
      &.disabled {
        cursor: default !important;
        pointer-events: none;
        opacity: 0.4;
      }
      &.clean {
        border: none;
        box-shadow: none;
      }

      .spinner {
        display: none;

        &.active {
          display: inline-block;
          position: relative;
          width: 2px;
          margin: 0px auto;
          animation: rotation 0.6s infinite linear;
          border-left: 6px solid rgba(0, 174, 239, 0.15);
          border-right: 6px solid rgba(0, 174, 239, 0.15);
          border-bottom: 6px solid rgba(0, 174, 239, 0.15);
          border-top: 6px solid $artong-white;
          border-radius: 100%;
        }
      }

      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
    }

    #header-bar {
      z-index: 999;
    }

    .contents__body {
      position: relative;
      background: $artong-white;
      height: 100%;
      padding-top: $head-height;
    }

    input[type='text'],
    input[type='number'],
    textarea {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      font-size: 1rem;
      color: #495057;
      background: #ffffff;
      padding: 0.75rem 0.75rem;
      border: 1px solid #ced4da;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s,
        box-shadow 0.2s;
      appearance: none;
      border-radius: 6px;
    }

    .float-label {
      display: flex;
      position: relative;

      label {
        line-height: 1;
        margin-top: -0.5rem;
        pointer-events: none;
        position: absolute;
        top: 50%;
        transition-property: all;
        transition-timing-function: ease;
      }

      & > label {
        left: 0.75rem;
        color: #6c757d;
        transition-duration: 0.2s;
      }

      & input:focus ~ label,
      & input.filled ~ label,
      & textarea:focus ~ label,
      & textarea.filled ~ label {
        top: -0.75rem;
        font-size: 12px;
      }
    }
  }
}
</style>
