<template>
  <div id="app">
    <header-bar id="header-bar"></header-bar>
    <side-bar id="side-bar"></side-bar>
    <div class="contents">
      <keep-alive>
        <router-view class="contents__body"/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/header/Header'
import SideBar from './components/sidebar/SideBar'
import { mapState } from 'vuex'
import { getMember } from './api/member'

export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar
  },
  computed: {
    ...mapState({
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
      isModalOpen: state => state.menu.isModalOpen,
      authError: state => state.auth.status
    }),
    isMobile() {
      return this.$isMobile()
    },
  },
  methods: {
    async getPcWalletOnFirstLoad() {
      if (window.ethereum) {
        const metamaskSignedInAccount = await window.ethereum.request({ method: 'eth_accounts' })
        if (metamaskSignedInAccount.length > 0) {
          this.$store.commit('WALLET_ACCOUNT', metamaskSignedInAccount[0])
          this.$store.commit('WALLET_CHAIN', parseInt(window.ethereum.networkVersion))
        } else {
          await this.$store.dispatch('AUTH_LOGOUT')
        }
      }
    },
    addPcWalletEventHandler() {
      window.addEventListener('load', () => {
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', async (accounts) => {
            this.$store.commit('WALLET_ACCOUNT', accounts[0])
            if (accounts.length === 0) {
              await this.$store.dispatch('AUTH_LOGOUT')
              this.$router.go(this.$router.currentRoute)
            }
          })

          window.ethereum.on('chainChanged', (networkId) => {
            this.$store.commit('WALLET_NETWORK', parseInt(networkId, 16))
          })
        }
      })
    }
  },
  async created() {
    try {
      const currentSession = await this.$store.dispatch('AUTH_CHECK_CURRENT_SESSION')
      const member = await getMember(currentSession.getAccessToken().payload.username)
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
  },
  watch: {
    isSideMenuOpen() {
      document.body.classList.toggle('prevent-scroll')
    },
    isModalOpen() {
      document.body.classList.toggle('prevent-scroll')
    }
  }
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
