import Vue from "vue";
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
      }

      
    ]
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});



export default router;
