import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    signedIn: false,
    isSideMenuOpen: false,
    isHeadNavOpen: true
  },
  mutations: {
    toggleNav(state) {
      state.isSideMenuOpen = !state.isSideMenuOpen
    },
    setSideMenuFalse(state) {
      state.isSideMenuOpen = false
    },
    setHeadNavTrue(state) {
      state.isHeadNavOpen = true
    },
    setHeadNavFalse(state) {
      state.isHeadNavOpen = false
    }
  },
  actions: {
  }
})
