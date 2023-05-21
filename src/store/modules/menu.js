import {
  TOGGLE_NAV,
  SET_HEAD_NAV_FALSE,
  SET_HEAD_NAV_TRUE,
  SET_SIDE_MENU_FALSE,
  TOGGLE_MODAL,
  TOGGLE_CONFIRM_MODAL,
  TOGGLE_PROMPT_MODAL,
  TOGGLE_PRIVACY_TOS_MODAL,
  TOGGLE_REPORT_MODAL,
  TOGGLE_NOTIFICATION_MODAL,
  TOGGLE_THEME,
  SET_INNER_WIDTH,
  SET_ICON_POSITION,
  OPEN_TOOL_TIP,
  CLOSE_TOOL_TIP,
  SET_TOOL_TIP,
} from '../actions/menu'

const state = {
  isSideMenuOpen: false,
  isHeadNavOpen: true,
  isModalOpen: false,
  isConfirmModalOpen: false,
  isPromptModalOpen: false,
  isPrivacyTosModalOpen: false,
  isReportModalOpen: false,
  isNotificationModalOpen: false,
  isDark: JSON.parse(localStorage.getItem('isDark')) | false,
  waitForAnswer: null,
  innerWidth: window.innerWidth,
  isToolTipOpen: false,
  iconTop: null,
  iconLeft: null,
  toolTip: null,
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
    localStorage.setItem('isDark', state.isDark)
  },
  [TOGGLE_CONFIRM_MODAL]: state => {
    state.isConfirmModalOpen = !state.isConfirmModalOpen
  },
  [TOGGLE_PROMPT_MODAL]: state => {
    state.isPromptModalOpen = !state.isPromptModalOpen
  },
  [TOGGLE_PRIVACY_TOS_MODAL]: state => {
    state.isPrivacyTosModalOpen = !state.isPrivacyTosModalOpen
  },
  [TOGGLE_REPORT_MODAL]: state => {
    state.isReportModalOpen = !state.isReportModalOpen
  },
  [TOGGLE_NOTIFICATION_MODAL]: state => {
    state.isNotificationModalOpen = !state.isNotificationModalOpen
  },
  [SET_INNER_WIDTH]: (state, innerWidth) => {
    state.innerWidth = innerWidth
  },
  [SET_ICON_POSITION]: (state, { iconTop, iconLeft }) => {
    state.iconTop = iconTop
    state.iconLeft = iconLeft
  },
  [OPEN_TOOL_TIP]: state => {
    state.isToolTipOpen = true
  },
  [CLOSE_TOOL_TIP]: state => {
    state.isToolTipOpen = false
  },
  [SET_TOOL_TIP]: (state, toolTip) => {
    state.toolTip = toolTip
  },
}

export default {
  state,
  mutations,
}
