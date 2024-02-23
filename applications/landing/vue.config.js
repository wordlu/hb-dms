const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const packageName = require('./package.json').name;
const port = process.env.port || process.env.npm_config_port || 9081 // dev port

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  publicPath: `/apps/landing`,
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    port: port,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    open: true,
    proxy: {
      '/api': {
        target: 'http://ca.dms.10.86.46.254.nip.io',
        ws: true,
        changeOrigin: true,
      },
    },
    client:{
      overlay:false
    }
  },
  configureWebpack:{
    output: {
      library: `${packageName}`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      // jsonpFunction: `webpackJsonp_${packageName}`,
      chunkLoadingGlobal: `webpackJsonp_${packageName}`
    },
  },
  chainWebpack: config => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
})
