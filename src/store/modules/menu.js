import {
  TOGGLE_NAV,
  SET_HEAD_NAV_FALSE,
  SET_HEAD_NAV_TRUE,
  SET_SIDE_MENU_FALSE,
  TOGGLE_MODAL,
  TOGGLE_CONFIRM_MODAL,
  TOGGLE_PROMPT_MODAL,
  TOGGLE_THEME,
  SET_INNER_WIDTH,
  SET_INFO_MODAL_POSITION,
  TOGGLE_INFO_MODAL,
  SET_INFO_TEXT,
  SET_INFO_MODAL_SIZE,
} from '../actions/menu'

const state = {
  isSideMenuOpen: false,
  isHeadNavOpen: true,
  isModalOpen: false,
  isConfirmModalOpen: false,
  isPromptModalOpen: false,
  isDark: false,
  waitForAnswer: null,
  innerWidth: window.innerWidth,
  isInfoModalOpen: false,
  modalTop: null,
  modalLeft: null,
  infoText: null,
  infoModalHeight: null,
  infoModalWidth: null,
}

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
  },
  [TOGGLE_THEME]: state => {
    state.isDark = !state.isDark
  },
  [TOGGLE_CONFIRM_MODAL]: state => {
    state.isConfirmModalOpen = !state.isConfirmModalOpen
  },
  [TOGGLE_PROMPT_MODAL]: state => {
    state.isPromptModalOpen = !state.isPromptModalOpen
  },
  [SET_INNER_WIDTH]: (state, innerWidth) => {
    state.innerWidth = innerWidth
  },
  [SET_INFO_MODAL_POSITION]: (state, { iconTop, iconLeft }) => {
    state.modalTop = iconTop + 30
    state.modalLeft = iconLeft
  },
  [TOGGLE_INFO_MODAL]: state => {
    state.isInfoModalOpen = !state.isInfoModalOpen
  },
  [SET_INFO_TEXT]: (state, _infoText) => {
    state.infoText = _infoText
  },
  [SET_INFO_MODAL_SIZE]: (state, { width, height }) => {
    state.infoModalHeight = height
    state.infoModalWidth = width
  },
}

export default {
  state,
  mutations,
}
