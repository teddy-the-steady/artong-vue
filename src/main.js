// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'isomorphic-fetch'
import Vue from 'vue'
import App from './App'
import Amplify from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from './aws-exports'
import smoothscroll from 'smoothscroll-polyfill'
import Masonry from './plugin/masonry'
import * as axios from './config/axiosConfig'
import router from './router'
import store from './store'
Amplify.configure(awsconfig)
Auth.configure(awsconfig)
Storage.configure(awsconfig)
smoothscroll.polyfill()

Vue.use(AmplifyPlugin, Amplify)
Vue.use(Masonry)

Vue.config.productionTip = false

axios.checkSession()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
