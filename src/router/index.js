import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '@/components/menu/Home'
import Server from '@/components/menu/Server'
import Trending from '@/components/menu/Trending'
import Following from '@/components/menu/Following'
import Workplace from '@/components/menu/Workplace'
import Login from '@/components/member/Login'
import SignUp from '@/components/member/SignUp'
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
      name: 'User',
      component: User,
      meta: { conditionalComponent: true }
    },
    {
      path: '/@:id',
      name: 'Artist',
      component: Artist,
      meta: { conditionalComponent: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/artwork/:id',
      name: 'Artwork',
      // component: Login
    },
  ]
})

router.beforeResolve(async function(to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const data = await Vue.prototype.$Amplify.Auth.currentAuthenticatedUser()
    let user
    try {
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
  } else if (to.matched.some(record => record.meta.conditionalComponent)) {
    next()
    if (store.state.user.currentUser.username === to.params.id) {
      next({ name: 'User' })
    } else {
      next({ name: 'Artist' })
    }
  } else {
    next()
  }
})

export default router
