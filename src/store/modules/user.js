import {
  USER_REQUEST,
  USER_ERROR,
  USER_SUCCESS,
  USER_LOGOUT
} from '../actions/user'
import { AUTH_LOGOUT } from '../actions/auth'
import axios from 'axios'

const state = {
  status: '',
  currentUser: JSON.parse(localStorage.getItem('current-user')) || {
    id: '',
    email: '',
    username: '',
    language: '',
    profile: {
      profile_pic: '',
      display_name: ''
    }
  } // TODO] 이게 최선인가..? currentUser 빈문자열로 하면 다른데서 참조할때 에러나고 이렇게 주면 currentUser 만으로 empty 체크 불가.. 현재 currentUser.id로 체크중
}

const actions = {
  [USER_REQUEST]: async function({ commit, dispatch }, user) {
    try {
      commit(USER_REQUEST)
      const accessToken = user.getSignInUserSession().getAccessToken().getJwtToken()
      const member = await axios.get(`/member/${user.attributes.sub}`, {
        headers: {
          Authorization: accessToken
        }
      })
      // TODO] axios.get 한 결과에서 data만 꺼내오기
      const currentUser = {
        id: member.data.data.member_id,
        sub: user.attributes.sub,
        email: user.attributes.email,
        username: member.data.data.username,
        language: member.data.data.language,
        profile: {
          profile_pic: member.data.data.profile_pic,
          display_name: member.data.data.display_name
        }
      }

      localStorage.setItem('current-user', JSON.stringify(currentUser))

      commit(USER_SUCCESS, currentUser)
    } catch (error) {
      commit(USER_ERROR)
      console.log(error)
      dispatch(AUTH_LOGOUT)
      throw error
    }
  },
  [USER_LOGOUT]: async function({ commit }) {
    commit(USER_REQUEST)
    localStorage.removeItem('current-user')
    commit(USER_LOGOUT)
  }
}

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, currentUser) => {
    state.status = 'success'
    state.currentUser = currentUser
  },
  [USER_ERROR]: state => {
    state.status = 'error'
  },
  [USER_LOGOUT]: state => {
    state.status = 'signedOut'
    state.currentUser = {
      id: '',
      email: '',
      accessToken: '',
      username: '',
      language: '',
      profile: {
        profile_pic: '',
        display_name: ''
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
