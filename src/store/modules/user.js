import {
  CURRENT_USER,
  CURRENT_USER_PROFILE_IMAGE_URL,
  USER_ERROR,
  USER_LOGOUT,
  SET_LANGUAGE,
} from '../actions/user'
import { AUTH_LOGOUT } from '../actions/auth'
import { makeS3Path } from '../../util/commonFunc'
import Vue from '../../main'
import { language_id_to_name } from '../../locales/languages'

const state = {
  status: '',
  display_language: localStorage.getItem('language'),
  currentUser: JSON.parse(localStorage.getItem('current-user')) || {
    id: '',
    email: '',
    username: '',
    language: '',
    wallet_address: '',
    follower: 0,
    following: 0,
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
        language: language_id_to_name[member.language_id],
        wallet_address: member.wallet_address,
        follower: member.follower,
        following: member.following,
        profile: {
          profile_image_url: member.profile_thumbnail_s3key
            ? makeS3Path(member.profile_thumbnail_s3key)
            : makeS3Path(member.profile_s3key),
          introduction: member.introduction,
        },
      }

      if (member.language_id) {
        commit(SET_LANGUAGE, language_id_to_name[member.language_id])
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
  [USER_ERROR]: state => {
    state.status = 'error'
  },
  [USER_LOGOUT]: state => {
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
  [SET_LANGUAGE]: (state, languageName) => {
    state.display_language = languageName
    Vue.$i18n.locale = languageName
    localStorage.setItem('language', languageName)
  },
}

export default {
  state,
  actions,
  mutations,
}
