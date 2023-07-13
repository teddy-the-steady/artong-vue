import {
  WALLET_ACCOUNT,
  WALLET_CHAIN,
  WALLET_STATUS,
  SET_UP_WALLET_CONNECTION,
  REFRESH_WALLET_CONNECT_STATUS,
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
      const provider = await Provider.providerPromise
      await provider.enable()

      const result = await provider.request({
        method: 'eth_requestAccounts',
      })
      const address = result[0]

      commit(WALLET_STATUS, true)
      commit(WALLET_ACCOUNT, address)
      commit(WALLET_CHAIN, await provider.request({ method: 'eth_chainId' }))

      await addWalletConnectEventListner({ state, commit, dispatch })

      return address
    } catch (error) {
      if (
        error.message === 'Connection request reset. Please try again.' ||
        error.message === 'User rejected methods.' ||
        error.message === 'Cancelled signing message'
      ) {
        return null
      }
      await dispatch('AUTH_LOGOUT')
      throw error
    }
  },
  [REFRESH_WALLET_CONNECT_STATUS]: async function (
    { commit, dispatch },
    { state, waitForAnswer },
  ) {
    if (!localStorage.getItem('wc@2:client:0.3//session')) {
      commit(WALLET_STATUS, false)
      commit(WALLET_ACCOUNT, '')
      localStorage.removeItem('userWalletConnectState')
    } else {
      commit(WALLET_STATUS, true)
      commit(WALLET_ACCOUNT, state.address)
      commit(WALLET_CHAIN, state.chainId)
      commit(CONFIRM_MODAL_WAIT_FOR_ANSWER, waitForAnswer)
      state.waitForAnswer = waitForAnswer
      await addWalletConnectEventListner({ state, commit, dispatch })
    }
  },
  [DISCONNECT_WALLET]: async function ({ commit }) {
    const provider = await Provider.providerPromise
    await provider.disconnect()
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

const addWalletConnectEventListner = async function ({
  state,
  commit,
  dispatch,
}) {
  const provider = await Provider.providerPromise

  provider.on('disconnect', () => {
    commit(WALLET_STATUS, false)
    commit(WALLET_ACCOUNT, '')
    localStorage.removeItem('userWalletConnectState')
  })

  provider.on('chainChanged', chainId => {
    if (chainId) {
      commit(WALLET_CHAIN, parseInt(chainId))
    }
  })

  provider.on('accountsChanged', async addressArray => {
    const address = addressArray[0]
    commit(WALLET_ACCOUNT, address)
    const currentUser = JSON.parse(localStorage.getItem('current-user'))

    if (
      address.length > 0 &&
      currentUser &&
      address.toLowerCase() !== currentUser.wallet_address
    ) {
      let signature = null
      await Auth.signOut()
      const cognitoUser = await dispatch('AUTH_SIGN_IN_AND_UP', {
        address: address,
      })
      if (cognitoUser) {
        commit('TOGGLE_CONFIRM_MODAL')
        const ok = await state.waitForAnswer()
        if (ok) {
          signature = await provider.request({
            method: 'personal_sign',
            params: [cognitoUser.challengeParam.message, address],
          })
        }
      }

      if (signature) {
        await dispatch('AUTH_VERIFY_USER', { cognitoUser, signature })
        await dispatch('AUTH_CHECK_CURRENT_USER')
        const member = await getCurrentMember()
        await dispatch('CURRENT_USER', member)
      }
    }
  })
}

export default {
  state,
  actions,
  mutations,
  getters,
}
