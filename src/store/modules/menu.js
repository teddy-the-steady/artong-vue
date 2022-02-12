import {
  TOGGLE_NAV,
  SET_HEAD_NAV_FALSE,
  SET_HEAD_NAV_TRUE,
  SET_SIDE_MENU_FALSE,
  TOGGLE_MODAL
} from '../actions/menu'

const state = { isSideMenuOpen: false, isHeadNavOpen: true, isModalOpen: false }

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
  },
  [TOGGLE_MODAL]: state => {
    state.isModalOpen = !state.isModalOpen
  }
}

export default {
  state,
  mutations
}
