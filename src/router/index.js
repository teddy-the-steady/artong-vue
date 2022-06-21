import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '@/components/menu/Home'
import Server from '@/components/menu/Server'
import Trending from '@/components/menu/Trending'
import Following from '@/components/menu/Following'
import Workplace from '@/components/menu/Workplace'
import Login from '@/components/member/Login'
import User from '@/components/member/User'
import Artist from '@/components/member/Artist'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/server',
      name: 'Server',
      component: Server
    },
    {
      path: '/trending',
      name: 'Trending',
      component: Trending
    },
    {
      path: '/following',
      name: 'Following',
      component: Following,
      meta: { requiresAuth: true }
    },
    {
      path: '/workplace',
      name: 'Workplace',
      component: Workplace,
      meta: { requiresAuth: true }
    },
    {
      path: '/@:id',
      name: 'UserOrArtist',
      beforeEnter(to, from, next) {
        if (store.state.user.currentUser.username === to.params.id) {
          to.matched[0].components.default = User
          next()
        } else {
          to.matched[0].components.default = Artist
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/artwork/:id',
      name: 'Artwork',
      // component: Login
    },
  ]
})

router.beforeEach(async function(to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = null
    try {
      const data = await Vue.prototype.$Amplify.Auth.currentAuthenticatedUser()
      if (data && data.signInUserSession) {
        user = data
      }
      next()
    } catch (error) {
      console.log(error)
      if (!user) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    }
  } else if (to.name === 'UserOrArtist' && from.name === 'UserOrArtist') {
    if (store.state.user.currentUser.username === to.params.id) {
      to.matched[0].components.default = User
      next()
    } else {
      to.matched[0].components.default = Artist
      next()
    }
  } else {
    next()
  }
})

export default router
