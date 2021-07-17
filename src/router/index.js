import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/menu/Home'
import Server from '@/components/menu/Server'
import Trending from '@/components/menu/Trending'
import Following from '@/components/menu/Following'
import Workplace from '@/components/menu/Workplace'
import Login from '@/components/member/Login'
import SignUp from '@/components/member/SignUp'
import User from '@/components/member/User'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
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
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/@:id',
      name: 'User',
      component: User
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: SignUp
    }
  ]
})

router.beforeResolve(async function(to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user
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
  }
  next()
})

export default router
