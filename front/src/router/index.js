import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import { Notification } from 'element-ui'
import axios from 'axios'

Vue.use(Router)

let router = new Router({
  routes: [
    { path: '/', name: 'Home', redirect: '/SignIn' },
    { path: '/_=_', redirect: '/SignIn' },
    { path: '/auth/:token/:id', redirect: storeToken.bind(this) },
    { path: '/Activation/:token', redirect: activateToken },
    { path: '/SignIn', name: 'SignIn', component: resolve => require(['../components/SignIn.vue'], resolve) },
    { path: '/SignUp', name: 'SignUp', component: resolve => require(['../components/SignUp.vue'], resolve) },
    { path: '/Recover', name: 'Recover', component: resolve => require(['../components/Recover.vue'], resolve) },
    { path: '/Init/:token', name: 'Init', component: resolve => require(['../components/Init.vue'], resolve) },
    { path: '/Gallery', name: 'Gallery', meta: { requiresAuth: true }, component: resolve => require(['../components/Gallery.vue'], resolve) },
    { path: '/Settings', name: 'Settings', meta: { requiresAuth: true }, component: resolve => require(['../components/Settings.vue'], resolve) },
    { path: '/Movie/:imdb', name: 'Movie', meta: { requiresAuth: true }, component: resolve => require(['../components/Movie.vue'], resolve) },
    { path: '/User/:id', name: 'User', meta: { requiresAuth: true }, component: resolve => require(['../components/User.vue'], resolve) }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    store.dispatch('loadOn')
    if (store.getters.GET_AUTH) {
      store.dispatch('loadOff')
      next()
    } else {
      store.dispatch('loadOff')
      next({
        path: '/'
      })
    }
  } else {
    if (store.getters.GET_AUTH) {
      store.dispatch('loadOff')
      next({
        path: '/Gallery'
      })
    } else {
      store.dispatch('loadOff')
      next()
    }
  }
})

function storeToken (to) {
  Notification({
    showClose: true,
    message: '☕☕☕☕☕☕☕☕☕☕☕☕☕',
    type: 'success'
  })
  store.dispatch('signIn', { token: to.params.token, id: to.params.id })
  return '/SignIn'
}

function activateToken (to) {
  axios.get('activate/' + to.params.token)
    .then(() => {
      Notification({
        showClose: true,
        message: '💌👌',
        type: 'success'
      })
    })
    .catch(() => {
      Notification({
        showClose: true,
        message: '💔',
        type: 'error'
      })
    })

  return '/SignIn'
}

export default router
