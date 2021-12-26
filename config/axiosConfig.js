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
          var accessTokenExpire = session.getAccessToken().getExpiration()
          var refreshToken = session.getRefreshToken()
          var currentTimeSeconds = Math.round(+new Date() / 1000)
          if (accessTokenExpire < currentTimeSeconds) {
            Auth.currentAuthenticatedUser()
              .then((res) => {
                res.refreshSession(refreshToken, (err, data) => {
                  if (err) {
                    console.log(err)
                    Auth.signOut()
                  } else {
                    config.headers.Authorization = data.getAccessToken().getJwtToken() 
                    resolve(config)
                  }
                })
              })
          } else {
            config.headers.Authorization = session.getAccessToken().getJwtToken()
            resolve(config)
          }
        })
        .catch(() => {
          // No logged-in user: don't set auth header
          reject(config)
        })
    })
  })
}

export {
  checkAuth
}