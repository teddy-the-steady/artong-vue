import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_JUST_SIGNED_UP,
  AUTH_LOGOUT
} from '../actions/auth'
import { USER_LOGOUT } from '../actions/user'
import { Auth } from '@aws-amplify/auth'
import { getRandomString } from '../../util/commonFunc'
import axios from 'axios'

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
  [AUTH_REQUEST]: async function({ commit, dispatch }, address) {
    try {
      commit(AUTH_REQUEST)
      const cognitoUser = await Auth.signIn(address)
      const messageToSign = cognitoUser.challengeParam.message
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [address, messageToSign],
      })
      await Auth.sendCustomChallengeAnswer(cognitoUser, signature)
      const authenticatedUser = await Auth.currentAuthenticatedUser()
      
      if (state.justSignedUp) {
        await axios.post('/member', {
          wallet_address: address,
          auth_id: authenticatedUser.attributes.sub
        })
      }

      commit(AUTH_SUCCESS)
      return authenticatedUser
    } catch (error) {
      console.log('AUTH_REQUEST error:',error)
      commit(AUTH_ERROR, error)
      if (error && error.message && error.message.includes('[404]')) {
        const pw = getRandomString(30)
        const params = {
          username: address,
          password: pw,
        }
        await Auth.signUp(params)
        commit(AUTH_JUST_SIGNED_UP)
        await dispatch('AUTH_REQUEST', address)
      } else {
        throw error
      }
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
