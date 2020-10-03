import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    signedIn: false,
    isNavOpen: false,
    isBrowserNavOpen: true
  },
  mutations: {
    toggleNav(state) {
      state.isNavOpen = !state.isNavOpen
    },
    setNavFalse(state) {
      state.isNavOpen = false
    },
    setBrowserNavTrue(state) {
      state.isBrowserNavOpen = true
    },
    setBrowserNavFalse(state) {
      state.isBrowserNavOpen = false
    }
  },
  actions: {
  }
})
