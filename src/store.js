import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    signedIn: false,
    isNavOpen: false,
    isBrowserNavOpen: true,
  },
  mutations: {
    toggleNav (state) {
      state.isNavOpen = !state.isNavOpen
    },
    toggleBrowserNav (state) {
      state.isBrowserNavOpen = !state.isBrowserNavOpen
    },
    setBrowserNavTrue (state) {
      state.isBrowserNavOpen = true;
    }
  },
  actions: {
  }
})
