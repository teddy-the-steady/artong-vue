import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from '../actions/auth'
import { USER_REQUEST, USER_LOGOUT } from '../actions/user'
import Auth from '@aws-amplify/auth'

const state = JSON.parse(localStorage.getItem('current-user'))?
{
  status: 'success',
  confirming: false,
  hasLoadedOnce: true
}
  :
{
  status: '',
  confirming: false,
  hasLoadedOnce: false
}

const actions = {
  [AUTH_REQUEST]: async function({ commit, dispatch }, user) {
    try {
      commit(AUTH_REQUEST)
      user = await Auth.signIn(user.username, user.password)
      commit(AUTH_SUCCESS)
      await dispatch(USER_REQUEST, user)
    } catch (error) {
      commit(AUTH_ERROR, error)
      console.log(error)
      throw error
      // if (error.code === 'NotAuthorizedException') {
      //   throw error
      // } else if (error.code === 'UserNotConfirmedException') {
      //   throw error
      // } TODO] 인증 에러별로 처리??
    }
  },
  [AUTH_LOGOUT]: async function({ commit, dispatch }) {
    try {
      commit(AUTH_REQUEST)
      await Auth.signOut()
      commit(AUTH_LOGOUT)
      dispatch(USER_LOGOUT)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state) => {
    state.status = 'success'
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: state => {
    state.status = 'signedOut'
    state.hasLoadedOnce = true
  },
  TOGGLE_CONFIRM: state => {
    state.confirming = !state.confirming
  }
}

export default {
  state,
  actions,
  mutations
}
