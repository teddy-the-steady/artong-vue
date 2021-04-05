import { TOGGLE_NAV, SET_HEAD_NAV_FALSE, SET_HEAD_NAV_TRUE, SET_SIDE_MENU_FALSE } from '../actions/menu'

const state = { isSideMenuOpen: false, isHeadNavOpen: true }

const mutations = {
  [TOGGLE_NAV]: state => {
    state.isSideMenuOpen = !state.isSideMenuOpen
  },
  [SET_SIDE_MENU_FALSE]: state => {
    state.isSideMenuOpen = false
  },
  [SET_HEAD_NAV_TRUE]: state => {
    state.isHeadNavOpen = true
  },
  [SET_HEAD_NAV_FALSE]: state => {
    state.isHeadNavOpen = false
  }
}

export default {
  state,
  mutations
}
