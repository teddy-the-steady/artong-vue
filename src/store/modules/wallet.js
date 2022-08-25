import {
  WALLET_ACCOUNT,
  WALLET_CHAIN,
  WALLET_STATUS,
  SET_UP_WALLET_CONNECTION,
  AUTO_CONNECT_WALLET,
  DISCONNECT_WALLET
} from '../actions/wallet'
import Provider from '../../util/walletConnectProvider'

const defaultState = {
  chainId: 0x0,
  address: '',
  status: false
}
const state = defaultState

const actions = {
  [WALLET_ACCOUNT]: function({ commit }, address) {
    commit(WALLET_ACCOUNT, address)
  },
  [WALLET_CHAIN]: function({ commit }, chainId) {
    commit(WALLET_CHAIN, chainId)
  },
  [WALLET_STATUS]: function({ commit }, status) {
    commit(WALLET_STATUS, status)
  },
  [SET_UP_WALLET_CONNECTION]: async function({ commit, dispatch }) {
    try {
      const provider = Provider.provider
      const connector = Provider.provider.connector
      connector.createSession()
      const address = Provider.provider.wc.accounts[0]
      console.log('Provider.provider.wc.accounts[0]:', address)
      commit(WALLET_STATUS, true)
      commit(WALLET_ACCOUNT, address)
      commit(WALLET_CHAIN, await provider.request({ method: 'eth_chainId' }))

      provider.on('connect', (val) => {
        console.log('connected1:', val)
      })

      connector.on('connect', (error, payload) => {
        if (error) {
          throw error
        }
        console.log('connected2:', payload.params[0])
        const { accounts, chainId } = payload.params[0]
        console.log(accounts, chainId)
      })

      connector.on('session_update', async (error, payload) => {
        if (error) {
          throw error
        }
        const { accounts, chainId } = payload.params[0]
        console.log('session_updated:', accounts)
        console.log('session_updated:', chainId)
        if (accounts.length > 0) {
          await this.$store.dispatch('AUTH_LOGOUT')
          this.$router.go(this.$router.currentRoute)
        } else {
          await this.$store.dispatch('AUTH_LOGOUT')
          this.$router.go(this.$router.currentRoute)
        }
      })

      provider.on('disconnect', (code, reason) => {
        console.log('disconnected:', code, reason)
        commit(WALLET_STATUS, false)
        commit(WALLET_ACCOUNT, '')
        localStorage.removeItem('userWalletConnectState')
      });
  
      provider.on('accountsChanged', (accounts) => {
        console.log('accountsChanged:', accounts[0])
        if (accounts.length > 0) {
          commit(WALLET_ACCOUNT, accounts[0])
        }
      })
  
      provider.on('chainChanged', (chainId) => {
        console.log('chainChanged:', chainId)
        commit(WALLET_CHAIN, chainId)
      })

      return {
        connector: connector,
        address
      }
    } catch (error) {
      console.log(error)
      if (error.message === 'User closed modal') {
        Provider.resetProvider()
        return false
      }
      await dispatch('AUTH_LOGOUT')
      throw error
    }
  },
  [AUTO_CONNECT_WALLET]: async function({ commit, dispatch }, state) {
    if (state.status) {
      if (localStorage.getItem('walletconnect') == null) {
        console.log('disconnected from AUTO_CONNECT')
        commit(WALLET_STATUS, false)
        commit(WALLET_ACCOUNT, '')
        localStorage.removeItem('userWalletConnectState')
      }
      if (localStorage.getItem('walletconnect')) {
        (async () => {
          console.log('AUTO_CONNECT')
          await dispatch('SET_UP_WALLET_CONNECTION')
        })()
      }
    }
  },
  [DISCONNECT_WALLET]: async function({ commit, dispatch }) {
    await Provider.provider.disconnect()
    commit(WALLET_STATUS, false)
    commit(WALLET_ACCOUNT, '')
    localStorage.removeItem('userWalletConnectState')
    await dispatch('AUTH_LOGOUT')
  }
}

const mutations = {
  [WALLET_ACCOUNT]: (state, address) => {
    state.address = address
  },
  [WALLET_CHAIN]: (state, chainId) => {
    state.chainId = chainId
  },
  [WALLET_STATUS]: (state, status) => {
    state.status = status
  }
}

const getters = {
  getDefaultWalletConnectState: function() {
    if (localStorage.getItem('userWalletConnectState') !== null) {
      return JSON.parse(localStorage.getItem('userWalletConnectState'))
    }
    return defaultState
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
