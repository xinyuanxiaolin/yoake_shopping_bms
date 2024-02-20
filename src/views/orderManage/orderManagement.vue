<template>
  <div>
    <el-row type="flex" justify="space-around">
      <order-status-filter @state-change="handleStateChange" />
      <el-col :span="8">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item>
            <el-input v-model="searchText" placeholder="输入订单编号,联系人,电话" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSearch" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <order-list ref="orderList" :orderState="orderState" :searchText="searchText" />
  </div>
</template>

<script>
import OrderStatusFilter from "./components/OrderStatusFilter.vue";
import OrderList from "./components/OrderList.vue";
export default {
  components: {
    OrderStatusFilter,
    OrderList,
  },
  data() {
    return {
      orderState: 0, //选择状态,
      searchText: "", //输入框模糊搜索,根据联系人,联系电话,订单编号
    };
  },
  methods: {
    // 状态切换事件处理方法
    handleStateChange(selectedState) {
      this.orderState = selectedState;
    },
    //模糊匹配搜索
    handleSearch(){
      this.$refs["orderList"].updateFilteredOrders();
    }
  },
};
</script>
