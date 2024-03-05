import Vue from "vue";
import {jwtDecode} from 'jwt-decode'
import { Message } from 'element-ui';
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 解决路由重读挂载报错问题
//#region
// 获取原型对象push函数
const originalPush = VueRouter.prototype.push

// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace

// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location){
return originalPush.call(this , location).catch(err=>err)
}

// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location){
return originalReplace.call(this , location).catch(err=>err)
}
//#endregion

const routes = [
  {
    path:"/",
    redirect: "/bms"
  },
 
  // 后台
  // 后台登录
  {
    path:"/admin-login",
    name:"admin-login",
    component:()=> import ("../views/login/login.vue")
    
  },
  {
    path:"/bms",
    name:"bms",
    component:()=> import ("../views/index.vue"),
    children:[
      {
        path:"/bms",
        redirect:"home",
      },
      // 首页
      {
        path:"home",
        name:"home",
        component:()=> import ("../views/home/home.vue"),
        meta:{
          title:"首页"
        }
      },
      /* 商品管理 */
      // 商品管理
      {
        path:"product-manage",
        name:"product-manage",
        component:()=> import ("../views/productManage/productManagement.vue"),
        meta:{
          title:"商品管理"
        }
      },
      // 商品发布
      {
        path:"product-publish",
        name:"product-publish",
        component:()=> import ("../views/productManage/productPublish.vue"),
        meta:{
          title:"商品发布"
        }
      },
      // 商品评论
      {
        path:"product-comments",
        name:"product-comments",
        component:()=> import ("../views/productManage/productComments.vue"),
        meta:{
          title:"商品评论"
        }
      },
      //分类管理
      {
        path:"sort-manage",
        name:"sort-manage",
        component:()=> import ("../views/sortManage/sortManage.vue"),
        meta:{
          title:"分类管理"
        }        
      },
      /* 订单管理 */
      // 订单管理
      {
        path:"order-manage",
        name:"order-manage",
        component:()=> import ("../views/orderManage/orderManagement.vue"),
        meta:{
          title:"订单管理"
        }
      },
       /* 账号管理 */
      //  用户管理
      {
        path:"user-manage",
        name:"user-manage",
        component:()=> import ("../views/accountManage/userManagement.vue"),
        meta:{
          title:"用户管理"
        }
      },

      /* 设置 */
      // 个人资料
      {
        path:"person-info",
        name:"person-info",
        component:()=> import ("../views/bmsSetting/personInfo.vue"),
        meta:{
          title:"个人资料"
        }
      },
      // 安全设置
      {
        path:"safe-setting",
        name:"safe-setting",
        component:()=> import ("../views/bmsSetting/safeSetting.vue"),
        meta:{
          title:"安全设置"
        }
      },
      //轮播图设置
      {
        path:"banner-setting",
        name:"banner-setting",
        component:()=> import("../views/bmsSetting/bannerSetting.vue"),
        meta:{
          title:"轮播图设置"
        }
      }

      
    ]
  }

];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to,from,next)=>{
  //没有token,重定向到登录界面
  if (to.path === "/admin-login") return next();
  const local_token = localStorage.token;
  //如果不存在
  if (!local_token){
    Message({
      type:'warning',
      message:"您尚未登录,请先登录"
    })
    return next("/admin-login")
  }
  const decodedToken = jwtDecode(local_token);
  // 获得过期时间
  const exp = decodedToken.exp;
  const now = new Date().getTime() / 1000;  // 将当前时间转换为秒
  if (exp < now) {
    // 令牌已过期
    //跳转
    Message({
      type:'warning',
      message:"信息已过期,请重新登录"
    })
    return next("/admin-login")
  }
  next();
})

export default router;
