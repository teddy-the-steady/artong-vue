<template>
  <div id="app">
    <HeaderBar id="header-bar" @open-search-modal="openSearchModal"></HeaderBar>
    <div
      v-show="innerWidth >= 1080"
      class="search-bar"
      @click="openSearchModal"
    >
      <img src="../src/assets/icons/search-grey.svg" />
      <input
        @input="setSearchInput"
        id="search-input"
        type="text"
        class="search-input"
      />
    </div>
    <button
      v-show="isSearchModalOpen && innerWidth >= 1080"
      @click="toggleSearchModal"
      class="white-button clear-button"
    >
      <img src="../src/assets/icons/clear.svg" />
    </button>
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
      <span slot="body">Continue with your wallet</span>
    </ConfirmModal>
    <SearchModal
      :isSearchModalOpen="isSearchModalOpen"
      :incomInput="searchInput"
      v-if="isSearchModalOpen"
      @close-modal="toggleSearchModal"
      ref="searchModal"
    >
      <span slot="body">search something </span>
    </SearchModal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Auth } from '@aws-amplify/auth'
import { getCurrentMember } from './api/member'
import HeaderBar from './components/header/Header.vue'
import SideBar from './components/sidebar/SideBar.vue'
import ConfirmModal from './components/modal/ConfirmModal.vue'
import SearchModal from './components/modal/SearchModal.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar,
    ConfirmModal,
    SearchModal,
  },
  data() {
    return {
      isSearchModalOpen: false,
      searchInput: null,
    }
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
    }),
    ...mapGetters({
      getDefaultWalletConnectState: 'getDefaultWalletConnectState',
    }),
    isMobile() {
      return this.$isMobile()
    },
  },
  methods: {
    setSearchInput() {
      this.searchInput = document.getElementById('search-input').value
      // console.log(this.searchInput)
    },
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
    toggleSearchModal() {
      this.isSearchModalOpen = !this.isSearchModalOpen
      console.log(this.isSearchModalOpen)
    },
    setWidth() {
      this.$store.commit('SET_INNER_WIDTH', window.innerWidth)
    },
    openSearchModal() {
      this.isSearchModalOpen = true
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
@import './directives/ripple/ripple';

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
      &.ripple:hover {
        background: $lightergray
          radial-gradient(circle, transparent 1%, $lightergray 1%) center/15000%;
      }
      &.ripple:active {
        background-color: #ffffff;
        background-size: 100%;
        transition: background 0s;
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
    }

    #header-bar {
      z-index: 2020;
    }

    .contents__body {
      position: relative;
      background: $artong-white;
      height: 100%;
      padding-top: $head-height;
    }

    input[type='text'] {
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
  }
}
.search-bar {
  z-index: 100000;
  width: 480px;
  height: 40px;
  background: $artong-white;
  border: 1px solid #e5e5e5;
  border-radius: 999px;
  line-height: 30px;
  position: fixed;
  left: calc(50% - 480px / 2);
  top: 15px;
  display: flex;
  padding: 11px 13px;
  box-sizing: border-box;
  img {
    vertical-align: middle;
  }
  .search-input {
    margin-left: 10px;
    border: none;
    width: 408px;
    height: 17px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    padding: 0px;
    border-radius: 0px;
  }
  input:focus {
    outline: none;
  }
}
.clear-button {
  position: fixed;
  border: none !important;
  z-index: 100001;
  top: 16px;
  transform: translateX(190px);
  width: 30px;
  height: 30px;
}
</style>
