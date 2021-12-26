import { API_STAGE } from '../../src/constants/url'
import store from '../store'
import axios from 'axios'
import { Auth } from 'aws-amplify'


axios.defaults.baseURL = API_STAGE
// axios.defaults.baseURL = API_LOCAL

const checkAuth = function() {
  axios.interceptors.request.use(function(config) {
    return new Promise((resolve) => {
      Auth.currentSession()
        .then((session) => {
          config.headers.Authorization = session.getAccessToken().getJwtToken()
          resolve(config)
        })
        .catch(() => { // refreshToken 만료시
          store.dispatch('AUTH_LOGOUT')
          alert('세션이 만료 되었습니다. 다시 로그인 해주세요.')
          resolve(config)
        })
    })
  })
}

export {
  checkAuth
}