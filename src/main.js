// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'isomorphic-fetch'
import Vue from 'vue'
import App from './App'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from './aws-exports'
import smoothscroll from 'smoothscroll-polyfill'
import Masonry from './plugin/masonry'
import axios from 'axios'
import router from './router'
import store from './store'
Amplify.configure(awsconfig)
smoothscroll.polyfill()

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(Masonry)

Vue.config.productionTip = false

axios.defaults.baseURL = 'https://6tz1h3qch8.execute-api.ap-northeast-2.amazonaws.com/stage/artong/v1'
const currentUser = JSON.parse(localStorage.getItem('current-user'))
if (currentUser) {
  axios.defaults.headers.common['Authorization'] = currentUser.accessToken
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
