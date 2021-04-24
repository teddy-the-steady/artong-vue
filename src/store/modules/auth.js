import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth'
import { USER_REQUEST } from '../actions/user'
import { Auth } from 'aws-amplify'
import axios from 'axios'

const state = {
  currentUser: JSON.parse(localStorage.getItem('current-user')) || {
    id: '',
    email: '',
    accessToken: '',
    username: '',
    language: '',
    profile: {
      profile_pic: '',
      display_name: ''
    }
  }, // TODO] 이게 최선인가..? currentUser 빈문자열로 하면 다른데서 참조할때 에러나고 이렇게 주면 currentUser 만으로 empty 체크 불가
  status: '',
  hasLoadedOnce: false
}

const actions = {
  [AUTH_REQUEST]: async function({ commit, dispatch }, user) {
    try {
      commit(AUTH_REQUEST)
      user = await Auth.signIn(user.username, user.password)
      const member = await axios.get(`/member/${user.attributes.sub}`)

      const currentUser = {
        id: user.attributes.sub,
        email: user.attributes.email,
        accessToken: user.getSignInUserSession().getAccessToken().getJwtToken(),
        username: member.data.data.username,
        language: member.data.data.language,
        profile: {
          profile_pic: member.data.data.profile_pic,
          display_name: member.data.data.display_name
        }
      }
      // TODO] axios.get 한 결과에 data만 꺼내오기
      localStorage.setItem('current-user', JSON.stringify(currentUser))
      axios.defaults.headers.common['Authorization'] = currentUser.accessToken

      commit(AUTH_SUCCESS, currentUser)
      dispatch(USER_REQUEST, currentUser.id)
    } catch (error) {
      commit(AUTH_ERROR, error)
      console.log(error)
      localStorage.removeItem('current-user')
      throw error
      // if (error.code === 'NotAuthorizedException') {
      //   throw error
      // } else if (error.code === 'UserNotConfirmedException') {
      //   throw error
      // } TODO] 인증 에러별로 처리
    }
  },
  [AUTH_LOGOUT]: async function({ commit }) {
    try {
      commit(AUTH_LOGOUT)
      await Auth.signOut()
      localStorage.removeItem('current-user')
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, currentUser) => {
    state.status = 'success'
    state.currentUser = currentUser
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: state => {
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
