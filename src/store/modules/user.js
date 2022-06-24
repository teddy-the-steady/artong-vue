import {
  CURRENT_USER,
  CURRENT_USER_PROFILE_PIC,
  USER_ERROR,
  USER_LOGOUT
} from '../actions/user'
import { AUTH_LOGOUT } from '../actions/auth'
import { makeS3Path } from '../../util/commonFunc'

const state = {
  status: '',
  currentUser: JSON.parse(localStorage.getItem('current-user')) || {
    id: '',
    sub: '',
    email: '',
    username: '',
    language: '',
    wallet_address: '',
    profile: {
      profile_pic: '',
      introduction: ''
    }
  } // TODO] 이게 최선인가..? currentUser 빈문자열로 하면 다른데서 참조할때 에러나고 이렇게 주면 currentUser 만으로 empty 체크 불가.. 현재 currentUser.id로 체크중
}

const actions = {
  [CURRENT_USER]: async function({ commit, dispatch }, member) {
    try {
      const currentUser = {
        id: member.id,
        sub: member.auth_id,
        email: member.email,
        username: member.username,
        language: member.language,
        wallet_address: member.wallet_address,
        profile: {
          profile_pic: makeS3Path(member.profile_pic),
          introduction: member.introduction
        }
      }

      commit(CURRENT_USER, currentUser)
    } catch (error) {
      await dispatch(AUTH_LOGOUT)
      throw error
    }
  }
}

const mutations = {
  [CURRENT_USER]: (state, currentUser) => {
    state.status = 'success'
    state.currentUser = currentUser
    localStorage.setItem('current-user', JSON.stringify(currentUser))
  },
  [CURRENT_USER_PROFILE_PIC]: (state, path) => {
    state.currentUser.profile.profile_pic = path
    const currentUser = JSON.parse(localStorage.getItem('current-user'))
    currentUser.profile.profile_pic = path
    localStorage.setItem('current-user', JSON.stringify(currentUser))
  },
  [USER_ERROR]: state => {
    state.status = 'error'
  },
  [USER_LOGOUT]: state => {
    state.status = 'signedOut'
    state.currentUser = {
      id: '',
      sub: '',
      email: '',
      username: '',
      language: '',
      wallet_address: '',
      profile: {
        profile_pic: '',
        introduction: ''
      }
    }
    localStorage.removeItem('current-user')
    localStorage.removeItem('walletconnect')
  }
}

export default {
  state,
  actions,
  mutations
}
