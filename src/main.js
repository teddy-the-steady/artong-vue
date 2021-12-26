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
import * as axios from './config/axiosConfig'
import router from './router'
import store from './store'
Amplify.configure(awsconfig)
smoothscroll.polyfill()

Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(Masonry)

Vue.config.productionTip = false

axios.checkAuth()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
