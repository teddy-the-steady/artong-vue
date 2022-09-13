import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '@/components/menu/Home'
import Project from '@/components/projects/Project'
import Projects from '@/components/menu/Projects'
import Following from '@/components/menu/Following'
import Workplace from '@/components/menu/Workplace'
import Login from '@/components/member/Login'
import User from '@/components/member/User'
import Artist from '@/components/member/Artist'
import CreateProject from '@/components/projects/CreateProject'
import CreatingProject from '@/components/projects/CreatingProject'

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
      path: '/projects/:id',
      name: 'Project',
      component: Project
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects
    },
    {
      path: '/following',
      name: 'Following',
      component: Following
      // meta: { requiresAuth: true }
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
    {
      path: '/create/project',
      name: 'CreateProject',
      component: CreateProject,
      beforeEnter(to, from, next) {
        if (to.query.txHash) {
          next({ name: 'CreatingProject', query: to.query })
        } else {
          next()
        }
      }
    },
    {
      path: '/create/project',
      name: 'CreatingProject',
      component: CreatingProject
    }
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
