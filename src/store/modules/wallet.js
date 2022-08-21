import {
  WALLET_ACCOUNT,
  WALLET_NETWORK
} from '../actions/wallet'

const state = {
  networkId: 0x0,
  accountAddress: ''
}

const actions = {
  [WALLET_ACCOUNT]: function({ commit }, address) {
    commit(WALLET_ACCOUNT, address)
  },
  [WALLET_NETWORK]: function({ commit }, networkId) {
    commit(WALLET_NETWORK, networkId)
  }
}

const mutations = {
  [WALLET_ACCOUNT]: (state, address) => {
    state.accountAddress = address
  },
  [WALLET_NETWORK]: (state, networkId) => {
    state.networkId = networkId
  }
}

export default {
  state,
  actions,
  mutations
}
