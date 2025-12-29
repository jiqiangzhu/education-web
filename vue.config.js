const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // 打包后的资源路径使用相对路径，适用于任何部署位置
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 生产环境关闭 source map，减小打包体积
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: true
  }
})

