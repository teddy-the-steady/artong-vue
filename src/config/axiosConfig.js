import { API_STAGE } from '../../src/constants/url'
import axios from 'axios'
import { Auth } from 'aws-amplify'


axios.defaults.baseURL = API_STAGE
// axios.defaults.baseURL = API_LOCAL

const checkSession = function() { // TODO] currentSession 호출 없이 accessToken 만료(현재 1시간)되면 자동 refresh가 안되는 현상? 테스트 필요. 1시간에 한번씩 수동 refresh 돌려야할지도?
  axios.interceptors.request.use(function(config) {
    return new Promise((resolve) => {
      Auth.currentSession()
        .then((session) => {
          config.headers.Authorization = session.getAccessToken().getJwtToken()
          resolve(config)
        })
        .catch(() => {
          resolve(config)
        })
    })
  })
}

export {
  checkSession
}