import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Server from '@/components/Server'
import Login from '@/components/member/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/server',
      name: 'Server',
      component: Server
      // meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

// router.beforeResolve((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     let user
//     Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
//       if (data && data.signInUserSession) {
//         user = data
//       }
//     }).catch((e) => {
//       console.log(e)
//     })
//     if (!user) {
//       next({
//         path: '/',
//         query: {
//           redirect: to.fullPath
//         }
//       })
//     }
//     next()
//   }
//   next()
// })

export default router
