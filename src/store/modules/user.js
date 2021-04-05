import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import { AUTH_LOGOUT } from '../actions/auth'
import axios from 'axios'
import Vue from 'vue'

const state = { status: '', profile: '' }

const actions = {
  [USER_REQUEST]: async function({ commit, dispatch }, id) {
    try {
      commit(USER_REQUEST)
      const member = await axios.get(`/member/${id}`)
      // TODO] axios.get 한 결과에 data만 꺼내오기
      commit(USER_SUCCESS, member.data.data)
    } catch (error) {
      commit(USER_ERROR)
      console.log(error)
      dispatch(AUTH_LOGOUT)
    }
  }
}

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, member) => {
    state.status = 'success'
    Vue.set(state, 'profile', member)
  },
  [USER_ERROR]: state => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: state => {
    state.profile = ''
  }
}

export default {
  state,
  actions,
  mutations
}
