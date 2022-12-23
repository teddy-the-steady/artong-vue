import axios from 'axios'
import { Auth } from '@aws-amplify/auth'
import store from '../store'

axios.defaults.baseURL = process.env.VUE_APP_API_URL

const createInstance = function () {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  })
  requestInterceptor(instance)
  responseInterceptor(instance)
  return instance
}

const requestInterceptor = function (axiosInstance) {
  axiosInstance.interceptors.request.use(function (config) {
    return new Promise(resolve => {
      Auth.currentSession()
        .then(session => {
          config.headers.Authorization = session.getAccessToken().getJwtToken()
          resolve(config)
        })
        .catch(async () => {
          await store.dispatch('AUTH_LOGOUT')
          resolve(config)
        })
    })
  })
}

const responseInterceptor = function (axiosInstance) {
  axiosInstance.interceptors.response.use(
    response => {
      return response.data.data
    },
    error => {
      return Promise.reject(error.response.data.message)
    },
  )
}

export default createInstance()
