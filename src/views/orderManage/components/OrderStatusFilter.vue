<template>
    <div>
      <!-- 订单状态切换按钮 -->
      <el-radio-group v-model="selectedState" @change="handleStateChange">
        <el-radio-button label="0">所有订单</el-radio-button>
        <el-radio-button label="1">待付款</el-radio-button>
        <el-radio-button label="2">待发货</el-radio-button>
        <el-radio-button label="3">待收货</el-radio-button>
        <el-radio-button label="4">待评价</el-radio-button>
        <el-radio-button label="5">已完成</el-radio-button>
        <el-radio-button label="6">已取消</el-radio-button>
        <el-radio-button label="7">待退款</el-radio-button>
        <el-radio-button label="8">已退款</el-radio-button>

      </el-radio-group>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedState: 0 // 默认选择所有订单状态
      };
    },
    methods: {
      handleStateChange() {
        // 触发父组件的方法，传递选中的订单状态条件
        console.log(this.selectedState)
        this.$emit('state-change', this.selectedState);
      }
    }
  };
  </script>
  
  <style scoped>
  /* 根据需要添加样式 */
  </style>
  