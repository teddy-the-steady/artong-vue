module.exports = {
  runtimeCompiler: true,

  pluginOptions: {
    i18n: {
      locale: 'ko',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false,
    },
  },
  chainWebpack: config => {
    config.module
      .rule('m?js')
      .test(/\.m?js$/)
      .use('babel-loader')
      .loader('babel-loader')
  },
}
