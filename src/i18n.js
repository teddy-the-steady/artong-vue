import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const requireLang = require.context('@/locales', true, /\.json$/)
  const messages = {}

  for (const file of requireLang.keys()) {
    if (file === './index.js') continue
    const path = file.replace(/(\.\/|\.json$)/g, '').split('/')
    path.reduce((o, s, i) => {
      if (o[s]) return o[s]
      o[s] = i + 1 === path.length ? requireLang(file) : {}
      return o[s]
    }, messages)
  }
  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
  messages: loadLocaleMessages(),
})
