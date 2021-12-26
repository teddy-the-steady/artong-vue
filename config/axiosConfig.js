import { API_STAGE } from '../src/constants/url'
import axios from 'axios'
import { Auth } from 'aws-amplify'


axios.defaults.baseURL = API_STAGE
// axios.defaults.baseURL = API_LOCAL

const checkAuth = function() {
  axios.interceptors.request.use(function(config) {
    return new Promise((resolve, reject) => {
      Auth.currentSession()
        .then((session) => {
          config.headers.Authorization = session.getAccessToken().getJwtToken()
          resolve(config)
        })
        .catch(() => {
          reject(config)
        })
    })
  })
}

export {
  checkAuth
}