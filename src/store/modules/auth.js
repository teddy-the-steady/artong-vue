/* eslint-disable indent */
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
import { postMember } from '../../api/member'

const state = JSON.parse(localStorage.getItem('current-user'))
  ? {
      status: 'success',
      justSignedUp: false,
    }
  : {
      status: '',
      justSignedUp: false,
    }

const actions = {
  [AUTH_SIGN_IN_AND_UP]: async function ({ commit, dispatch }, payload) {
    try {
      commit(AUTH_SIGN_IN_AND_UP)
      const cognitoUser = await Auth.signIn(payload.address)
      if (state.justSignedUp && payload.principalId) {
        await postMember(payload.address, payload.principalId)
      }
      return cognitoUser
    } catch (error) {
      commit(AUTH_ERROR, error)
      if (error && error.message && error.message.includes('[404]')) {
        const pw = getRandomString(30)
        const params = {
          username: payload.address,
          password: pw,
        }
        const signUpUser = await Auth.signUp(params)
        commit(AUTH_JUST_SIGNED_UP)
        return await dispatch('AUTH_SIGN_IN_AND_UP', {
          address: payload.address,
          principalId: signUpUser.userSub,
        })
      } else {
        throw error
      }
    }
  },
  [AUTH_VERIFY_USER]: async function ({ commit }, { cognitoUser, signature }) {
    try {
      commit(AUTH_VERIFY_USER)
      await Auth.sendCustomChallengeAnswer(cognitoUser, signature)
      commit(AUTH_SUCCESS)
    } catch (error) {
      commit(AUTH_ERROR, error)
      throw error
    }
  },
  [AUTH_LOGOUT]: async function ({ commit, dispatch }) {
    try {
      await Auth.signOut()
      await dispatch('DISCONNECT_WALLET')
      commit(AUTH_LOGOUT)
      commit(USER_LOGOUT)
      localStorage.removeItem('userWalletConnectState')
    } catch (error) {
      commit(AUTH_ERROR, error)
      throw error
    }
  },
  // INFO] currentAuthenicatedUser vs currentSession
  // https://stackoverflow.com/questions/55739848/what-is-the-difference-between-auth-currentauthenticateduser-and-auth-currents
  [AUTH_CHECK_CURRENT_USER]: async function ({ dispatch }) {
    try {
      const authenticatedUser = await Auth.currentAuthenticatedUser()
      return authenticatedUser
    } catch (error) {
      await dispatch('AUTH_LOGOUT')
      throw error
    }
  },
  [AUTH_CHECK_CURRENT_SESSION]: async function ({ dispatch }) {
    try {
      const currentSession = await Auth.currentSession()
      return currentSession
    } catch (error) {
      await dispatch('AUTH_LOGOUT')
      return false
    }
  },
}

const mutations = {
  [AUTH_SIGN_IN_AND_UP]: state => {
    state.status = 'signing in and up'
  },
  [AUTH_VERIFY_USER]: state => {
    state.status = 'verifying user'
  },
  [AUTH_SUCCESS]: state => {
    state.status = 'success'
    state.justSignedUp = false
  },
  [AUTH_JUST_SIGNED_UP]: state => {
    state.justSignedUp = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
    state.justSignedUp = false
  },
  [AUTH_LOGOUT]: state => {
    state.status = 'signedOut'
    state.justSignedUp = false
  },
}

export default {
  state,
  actions,
  mutations,
}
