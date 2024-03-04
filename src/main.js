import Vue from "vue";
import App from "./App.vue";
// 导入路由配置
import router from "./router/router";

// 引入icon图标
import '@/assets/icon/bms/iconfont.css';
// reset.css
import "@/common/reset.css";
// 自定义全局样式
import "@/common/common.css";
// 引入element
import "element-ui/lib/theme-chalk/index.css";
import "@/common/elementui.js";

Vue.config.productionTip = false;
console.log("当前环境：" + process.env.NODE_ENV);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
