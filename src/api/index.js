import axios from 'axios';
import { Auth } from '@aws-amplify/auth'

axios.defaults.baseURL = process.env.VUE_APP_API_URL

const createInstance = function() {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  });
  requestInterceptor(instance)
  responseInterceptor(instance)
  return instance
}

const requestInterceptor = function(axiosInstance) { // TODO] currentSession 호출 없이 accessToken 만료(현재 1시간)되면 자동 refresh가 안되는 현상? 테스트 필요. 1시간에 한번씩 수동 refresh 돌려야할지도?
  axiosInstance.interceptors.request.use(function(config) {
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

const responseInterceptor = function(axiosInstance) {
  axiosInstance.interceptors.response.use(function(response) {
    return response.data.data
  })
}
 
export default createInstance()