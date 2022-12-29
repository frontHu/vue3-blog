const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [require('tailwindcss'), require('autoprefixer')]
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('html').tap(args => {
      args[0].title = process.env.VUE_APP_TITLE
      return args
    })
  }
})
