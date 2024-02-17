const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      [process.env.VUE_APP_API]: {
        target: process.env.VUE_API_BASE_URL, //请求本地 需要后台项目
        ws: false,
        changeOrigin: true,
      },
      // "/api": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      //   // pathRewrite:{
      //   //   '^/api':''
      //   // }
      // },
    },
  },
});

