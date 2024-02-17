<template>
  <div style="height: 100%" class="bg_color1">
    <div class="bms-aside">
      <div class="icon">
        <router-link to="/bms/home">Yoake Shop</router-link>
      </div>
      <el-menu
        default-active="1"
        class="bms-menu"
        background-color="#fff"
        text-color="#797979"
        active-text-color="#3AAAF4"
        :router="true"
      >
        <el-menu-item index="/bms">
          <i class="iconfont icon-shouyefill"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="iconfont icon-shangpinguanli"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/bms/product-manage">商品管理</el-menu-item>
            <el-menu-item index="/bms/product-publish">商品发布</el-menu-item>
            <el-menu-item index="/bms/product-comments">商品评论</el-menu-item>
            <el-menu-item index="/bms/sort-manage">分类管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="iconfont icon-dingdanguanli"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/bms/order-manage">订单管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="iconfont icon-yuangongzhanghaoguanli"></i>
            <span>账号管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/bms/user-manage">用户管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="iconfont icon-shezhi"></i>
            <span>设置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/bms/person-info">个人资料</el-menu-item>
            <el-menu-item index="/bms/safe-setting">安全设置</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>

    <div class="bms-header">
      <div id="title-left" class="font_color1">欢迎来到后台管理系统！</div>
      <div id="title-right" class="font_color1">
        <div @click="()=>{this.$router.push('/bms')}"><i class="iconfont icon-shouyefill"></i><span>首页</span></div>
        <div><i class="iconfont icon-yonghu-yuan"></i><span>用户名</span></div>
        <div @click="exitBMS"><i class="iconfont icon-icon"></i><span>退出</span></div>

      </div>
    </div>
    <div class="bms-content bg_color1">
      <div class="bg_color0">
        <!-- 引入标头 -->
        <Title></Title>
        <router-view></router-view>
        <el-row style="height: 30px;"></el-row>
      </div>
    </div>
  </div>
</template>

<script>
import  Title  from '@/components/Title.vue';
export default {
    name: "index",
    data() {
        return {};
    },
    methods: {
        exitBMS() {
            this.$router.push('/admin-login');
        }
    },
    components: { Title }
};
</script>

<style lang="scss" scoped>
.bms-aside {
  position: fixed;
  background-color: #fff;
  height: 100vh;
  width: 300px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      color: #000;
    }
  }
  .bms-menu {
    width: 300px;
    border:none;
    i,
    span {
      font-size: 20px;
    }
  }
}
.bms-header {
  position: fixed;
  width: 100%;
  height: 60px;
  background-color: #fff;
  z-index: 9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  #title-left{
    margin-left: 320px;
  }
  #title-right{
    margin-right: 100px;
    display: flex;
    div{
      margin: 0 10px;
      cursor: pointer;
      i,span{
        font-size: 25px;
      }
      i{
        color: #3AAAF4;
      }
      span{
        margin: 10px;
      }
    }

  }

}
.bms-content {
  position: relative;
  padding: 80px 30px 30px 330px;
}
</style>
