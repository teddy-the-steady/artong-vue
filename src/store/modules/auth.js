import {
  AUTH_SIGN_IN_AND_UP,
  AUTH_VERIFY_USER,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_JUST_SIGNED_UP,
  AUTH_CHECK_CURRENT_USER,
  AUTH_CHECK_CURRENT_SESSION,
} from '../actions/auth'
import { USER_LOGOUT } from '../actions/user'
import { Auth } from '@aws-amplify/auth'
import { getRandomString } from '../../util/commonFunc'

const state = JSON.parse(localStorage.getItem('current-user'))?
{
  status: 'success',
  justSignedUp: false
}
  :
{
  status: '',
  justSignedUp: false
}

const actions = {
  [AUTH_SIGN_IN_AND_UP]: async function({ commit, dispatch }, address) {
    try {
      commit(AUTH_SIGN_IN_AND_UP)
      const cognitoUser = await Auth.signIn(address)
      return cognitoUser
    } catch (error) {
      commit(AUTH_ERROR, error)
      if (error && error.message && error.message.includes('[404]')) {
        const pw = getRandomString(30)
        const params = {
          username: address,
          password: pw,
        }
        await Auth.signUp(params)
        commit(AUTH_JUST_SIGNED_UP)
        const cognitoUser = await dispatch('AUTH_SIGN_IN_AND_UP', address)
        return cognitoUser
      } else {
        throw error
      }
    }
  },
  [AUTH_VERIFY_USER]: async function({ commit }, { cognitoUser, signature }) {
    try {
      commit(AUTH_VERIFY_USER)
      const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, signature)
      commit(AUTH_SUCCESS)
      return challengeResult
    } catch (error) {
      commit(AUTH_ERROR, error)
      throw error
    }
  },
  [AUTH_LOGOUT]: async function({ commit }) {
    try {
      commit(AUTH_SIGN_IN_AND_UP)
      await Auth.signOut()
      commit(AUTH_LOGOUT)
      commit(USER_LOGOUT)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  // INFO] currentAuthenicatedUser vs currentSession
  // https://stackoverflow.com/questions/55739848/what-is-the-difference-between-auth-currentauthenticateduser-and-auth-currents
  [AUTH_CHECK_CURRENT_USER]: async function({ commit }) {
    try {
      const authenticatedUser = await Auth.currentAuthenticatedUser()
      return authenticatedUser
    } catch (error) {
      commit(AUTH_ERROR, error)
      throw error
    }
  },
  [AUTH_CHECK_CURRENT_SESSION]: async function({ commit }) {
    try {
      const currentSssion = await Auth.currentSession()
      return currentSssion
    } catch (error) {
      if (error === 'No current user') {
        throw error
      }
      commit(AUTH_ERROR, error)
      throw error
    }
  }
}

const mutations = {
  [AUTH_SIGN_IN_AND_UP]: state => {
    state.status = 'signing in and up'
  },
  [AUTH_VERIFY_USER]: state => {
    state.status = 'verifying user'
  },
  [AUTH_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [AUTH_JUST_SIGNED_UP]: (state) => {
    state.justSignedUp = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: state => {
    state.status = 'signedOut'
  }
}

export default {
  state,
  actions,
  mutations
}
