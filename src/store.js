import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    signedIn: false,
    isNavOpen: false
  },
  mutations: {
    toggleNav (state) {
      state.isNavOpen = !state.isNavOpen
    }
  },
  actions: {
  }
})
