import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { Auth } from '@aws-amplify/auth'
import { isAuthenticated } from '../util/commonFunc'
import Home from '@/components/menu/Home'
import Project from '@/components/projects/Project'
import Projects from '@/components/menu/Projects'
import Following from '@/components/menu/Following'
import Login from '@/components/member/Login'
import User from '@/components/member/User'
import Artist from '@/components/member/Artist'
import CreateProject from '@/components/projects/CreateProject'
import CreatingProject from '@/components/projects/CreatingProject'
import Contents from '@/components/menu/Contents'
import ContentDetail from '@/components/contents_v2/ContentDetail'
import ProfileSetting from '@/components/member/ProfileSetting'
import VueCarousel from 'vue-carousel' // for 무한 슬라이드 swipe 배너

Vue.use(Router)
Vue.use(VueCarousel)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomeOrMain',
      component: () => {
        if (isAuthenticated()) {
          return import('@/components/menu/Home')
        } else {
          return import('@/components/menu/Main')
        }
      },
      beforeEnter(to, from, next) {
        if (isAuthenticated()) {
          to.matched[0].components.default = Home
        }
        next()
      },
    },
    {
      path: '/projects/:id',
      name: 'Project',
      component: Project,
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
    },
    {
      path: '/projects/:project_address/contents/:token_id',
      name: 'ContentDetail',
      component: ContentDetail,
    },
    {
      path: '/contents',
      name: 'Contents',
      component: Contents,
    },
    {
      path: '/following',
      name: 'Following',
      component: Following,
      meta: { requiresAuth: true },
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
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
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
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/create/project',
      name: 'CreatingProject',
      component: CreatingProject,
    },
    {
      path: '/settings/profile',
      name: 'ProfileSetting',
      component: ProfileSetting,
    },
  ],
})

router.beforeEach(async function (to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = null
    try {
      const data = await Auth.currentAuthenticatedUser()
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
            redirect: to.fullPath,
          },
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
