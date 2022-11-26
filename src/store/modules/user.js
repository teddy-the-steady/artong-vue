import {
  CURRENT_USER,
  CURRENT_USER_PROFILE_IMAGE_URL,
  USER_ERROR,
  USER_LOGOUT,
} from '../actions/user'
import { AUTH_LOGOUT } from '../actions/auth'
import { makeS3Path } from '../../util/commonFunc'

const state = {
  status: '',
  currentUser: JSON.parse(localStorage.getItem('current-user')) || {
    id: '',
    email: '',
    username: '',
    language: '',
    wallet_address: '',
    profile: {
      profile_image_url: '',
      introduction: '',
    },
  }, // TODO] 이게 최선인가..? currentUser 빈문자열로 하면 다른데서 참조할때 에러나고 이렇게 주면 currentUser 만으로 empty 체크 불가.. 현재 currentUser.id로 체크중
}

const actions = {
  [CURRENT_USER]: async function ({ commit, dispatch }, member) {
    try {
      const currentUser = {
        id: member.id,
        email: member.email,
        username: member.username,
        language: member.language,
        wallet_address: member.wallet_address,
        profile: {
          profile_image_url: member.profile_thumbnail_s3key
            ? makeS3Path(member.profile_thumbnail_s3key)
            : makeS3Path(member.profile_s3key),
          introduction: member.introduction,
        },
      }

      commit(CURRENT_USER, currentUser)
    } catch (error) {
      await dispatch(AUTH_LOGOUT)
      throw error
    }
  },
}

const mutations = {
  [CURRENT_USER]: (state, currentUser) => {
    state.status = 'success'
    state.currentUser = currentUser
    localStorage.setItem('current-user', JSON.stringify(currentUser))
  },
  [CURRENT_USER_PROFILE_IMAGE_URL]: (state, path) => {
    state.currentUser.profile.profile_image_url = path
    const currentUser = JSON.parse(localStorage.getItem('current-user'))
    currentUser.profile.profile_image_url = path
    localStorage.setItem('current-user', JSON.stringify(currentUser))
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
  },
  [USER_LOGOUT]: (state) => {
    state.status = 'signedOut'
    state.currentUser = {
      id: '',
      email: '',
      username: '',
      language: '',
      wallet_address: '',
      profile: {
        profile_image_url: '',
        introduction: '',
      },
    }
    localStorage.removeItem('current-user')
  },
}

export default {
  state,
  actions,
  mutations,
}
