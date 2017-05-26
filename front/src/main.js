// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// front
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import VueYouTubeEmbed from 'vue-youtube-embed'
import enLocale from 'element-ui/lib/locale/lang/en'
import frLocale from 'element-ui/lib/locale/lang/fr'
import enSiteMap from './lang/en.json'
import frSiteMap from './lang/fr.json'
import infiniteScroll from 'vue-infinite-scroll'
import VueVideoPlayer from 'vue-video-player'
// back
import store from './store/'
import router from './router'
import config from './api/config'

import axios from 'axios'
axios.defaults.baseURL = `http://${config.host}:8080/api/`

Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.use(VueVideoPlayer)
Vue.use(infiniteScroll)
Vue.use(VueYouTubeEmbed)

const messages = {
  en: {
    ...enLocale
  },
  fr: {
    ...frLocale
  }
}
messages.en = Object.assign(messages.en, enSiteMap)
messages.fr = Object.assign(messages.fr, frSiteMap)

const i18n = new VueI18n({
  locale: 'en',
  messages
})

Vue.use(ElementUI, {
  i18n: key => i18n.vm._t(key)
})

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App: require('./App.vue') }
})
