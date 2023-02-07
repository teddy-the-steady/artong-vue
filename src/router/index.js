import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { Auth } from '@aws-amplify/auth'
import Main from '@/components/menu/Main'
import Project from '@/components/projects/Project'
import Projects from '@/components/menu/Projects'
import Feed from '@/components/menu/Feed'
import Login from '@/components/member/Login'
import User from '@/components/member/User'
import Artist from '@/components/member/Artist'
import CreateProject from '@/components/projects/CreateProject'
import CreatingProject from '@/components/projects/CreatingProject'
import Contents from '@/components/menu/Contents'
import ContentDetail from '@/components/contents_v2/ContentDetail'
import ContentCandidateDetail from '@/components/contents_v2/ContentCandidateDetail'
import ProfileSettings from '@/components/member/ProfileSettings'
import ProjectSettings from '@/components/projects/ProjectSettings'
import VueCarousel from 'vue-carousel'
import Test from '../components/util/Test'

window.popStateDetected = false
window.addEventListener('popstate', () => {
  window.popStateDetected = true
})

Vue.use(Router)
Vue.use(VueCarousel)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
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
      path: '/projects/:project_address/candidates/:contents_id',
      name: 'ContentCandidateDetail',
      component: ContentCandidateDetail,
    },
    {
      path: '/projects/:project_address/settings',
      name: 'ProjectSettings',
      component: ProjectSettings,
    },
    {
      path: '/contents',
      name: 'Contents',
      component: Contents,
    },
    {
      path: '/feed',
      name: 'Feed',
      component: Feed,
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
    },
    {
      path: '/creating/project',
      name: 'CreatingProject',
      component: CreatingProject,
    },
    {
      path: '/settings/profile',
      name: 'ProfileSettings',
      component: ProfileSettings,
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
    },
  ],
})

router.beforeEach(async function (to, from, next) {
  const IsBackButtonClicked = window.popStateDetected
  window.popStateDetected = false
  if (!IsBackButtonClicked && from.path !== to.path) {
    window.scrollTo(0, 0)
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = null
    try {
      const data = await Auth.currentAuthenticatedUser()
      if (data && data.signInUserSession) {
        user = data
      }
      next()
    } catch (error) {
      await store.dispatch('AUTH_LOGOUT')
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
