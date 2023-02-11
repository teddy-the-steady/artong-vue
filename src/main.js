// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'isomorphic-fetch'
import Vue from 'vue'
import App from './App'
import { Amplify } from '@aws-amplify/core'
import { Auth } from '@aws-amplify/auth'
import { Storage } from '@aws-amplify/storage'
import awsconfig from './aws-exports'
import smoothscroll from 'smoothscroll-polyfill'
import VueMobileDetection from 'vue-mobile-detection'
import Masonry from './plugin/masonry'
import router from './router'
import store from './store'
import axiosInit from './api'
import i18n from './i18n'
import VueCarousel from 'vue-carousel'
import VTooltip from 'v-tooltip'
Amplify.configure(awsconfig)
Auth.configure(awsconfig)
Storage.configure(awsconfig)
smoothscroll.polyfill()

Vue.use(Amplify)
Vue.use(Masonry)
Vue.use(VueMobileDetection)
Vue.use(VueCarousel)
Vue.use(VTooltip)

Vue.config.productionTip = false

axiosInit

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  i18n,
  template: '<App/>',
})
