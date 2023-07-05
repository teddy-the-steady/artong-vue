import {
  WALLET_ACCOUNT,
  WALLET_CHAIN,
  WALLET_STATUS,
  SET_UP_WALLET_CONNECTION,
  AUTO_CONNECT_WALLET,
  DISCONNECT_WALLET,
  CONFIRM_MODAL_WAIT_FOR_ANSWER,
} from '../actions/wallet'
import Provider from '../../util/walletConnectProvider'
import { getCurrentMember } from '../../api/member'
import { Auth } from '@aws-amplify/auth'

const defaultState = {
  chainId: 0,
  address: '',
  status: false,
  waitForAnswer: null,
}
const state = defaultState

const actions = {
  [WALLET_ACCOUNT]: function ({ commit }, address) {
    commit(WALLET_ACCOUNT, address)
  },
  [WALLET_CHAIN]: function ({ commit }, chainId) {
    commit(WALLET_CHAIN, chainId)
  },
  [WALLET_STATUS]: function ({ commit }, status) {
    commit(WALLET_STATUS, status)
  },
  [SET_UP_WALLET_CONNECTION]: async function ({ state, commit, dispatch }) {
    try {
      await Provider.provider.enable()
      const address = Provider.provider.wc.accounts[0]
      commit(WALLET_STATUS, true)
      commit(WALLET_ACCOUNT, address)
      commit(
        WALLET_CHAIN,
        await Provider.provider.request({ method: 'eth_chainId' }),
      )

      Provider.provider.on('disconnect', (code, reason) => {
        console.log('disconnected:', code, reason)
        commit(WALLET_STATUS, false)
        commit(WALLET_ACCOUNT, '')
        localStorage.removeItem('userWalletConnectState')
      })

      Provider.provider.connector.on(
        'session_update',
        async (error, payload) => {
          if (error) {
            throw error
          }

          const { accounts, chainId } = payload.params[0]
          commit(WALLET_ACCOUNT, accounts[0])
          const currentUser = JSON.parse(localStorage.getItem('current-user'))

          if (
            accounts.length > 0 &&
            accounts[0].toLowerCase() !== currentUser.wallet_address
          ) {
            let signature = null
            await Auth.signOut()
            const cognitoUser = await dispatch('AUTH_SIGN_IN_AND_UP', {
              address: accounts[0],
            })
            if (cognitoUser) {
              commit('TOGGLE_CONFIRM_MODAL')
              const ok = await state.waitForAnswer()
              if (ok) {
                signature =
                  await Provider.provider.connector.signPersonalMessage([
                    cognitoUser.challengeParam.message,
                    accounts[0],
                  ])
              }
            }

            if (signature) {
              await dispatch('AUTH_VERIFY_USER', { cognitoUser, signature })
              await dispatch('AUTH_CHECK_CURRENT_USER')
              const member = await getCurrentMember()
              await dispatch('CURRENT_USER', member)
            }
          }
          if (chainId) {
            commit(WALLET_CHAIN, chainId)
          }
        },
      )

      return {
        connector: Provider.provider.connector,
        address,
      }
    } catch (error) {
      if (error.message === 'User closed modal') {
        await Provider.resetProvider()
        return false
      }
      await dispatch('AUTH_LOGOUT')
      throw error
    }
  },
  [AUTO_CONNECT_WALLET]: async function ({ commit, dispatch }, state) {
    if (state.status) {
      if (localStorage.getItem('walletconnect') == null) {
        commit(WALLET_STATUS, false)
        commit(WALLET_ACCOUNT, '')
        localStorage.removeItem('userWalletConnectState')
      }
      if (localStorage.getItem('walletconnect')) {
        ;(async () => {
          await dispatch('SET_UP_WALLET_CONNECTION')
        })()
      }
    }
  },
  [DISCONNECT_WALLET]: async function ({ commit }) {
    await Provider.provider.disconnect()
    commit(WALLET_STATUS, false)
    commit(WALLET_ACCOUNT, '')
  },
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
  },
  [CONFIRM_MODAL_WAIT_FOR_ANSWER]: (state, waitForAnswer) => {
    state.waitForAnswer = waitForAnswer
  },
}

const getters = {
  getDefaultWalletConnectState: function () {
    if (localStorage.getItem('userWalletConnectState') !== null) {
      return JSON.parse(localStorage.getItem('userWalletConnectState'))
    }
    return defaultState
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
}
