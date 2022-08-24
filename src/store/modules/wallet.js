import {
  WALLET_ACCOUNT,
  WALLET_CHAIN
} from '../actions/wallet'

const state = {
  chainId: 0x0,
  address: '',
  status: false
}

const actions = {
  [WALLET_ACCOUNT]: function({ commit }, address) {
    commit(WALLET_ACCOUNT, address)
  },
  [WALLET_CHAIN]: function({ commit }, chainId) {
    commit(WALLET_CHAIN, chainId)
  }
}

const mutations = {
  [WALLET_ACCOUNT]: (state, address) => {
    state.address = address
  },
  [WALLET_CHAIN]: (state, chainId) => {
    state.chainId = chainId
  }
}

export default {
  state,
  actions,
  mutations
}
