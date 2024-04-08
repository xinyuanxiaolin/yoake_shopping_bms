<template>
  <div>
    <!-- 列表内容 -->
    <el-table :data="orders" style="width: 100%" border stripe>
      <!-- 列定义，根据实际需要调整 -->
      <el-table-column
        prop="id"
        label="订单编号"
        width="150"
        sortable
      ></el-table-column>
      <el-table-column label="商品详情" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px; cursor: pointer"
            :src="scope.row.goodsPicture"
            @click="showProductDetails(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="receiverContact"></el-table-column>
      <el-table-column label="联系电话" prop="receiverMobile"></el-table-column>
      <el-table-column label="地址" prop="receiverAddress"></el-table-column>
      <el-table-column
        label="订单创建时间"
        prop="createTime"
        sortable
      ></el-table-column>
      <el-table-column label="估价" prop="evaluate"></el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          {{ orderStateList[scope.row.state].text }}
        </template>
      </el-table-column>
      <!-- 其他列... -->
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <!-- 根据订单状态显示不同的操作按钮 -->
          <el-button
            type="text"
            v-if="[1, 2].includes(scope.row.state)"
            @click="cancelOrder(scope.row)"
            >取消订单</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.state === 1"
            @click="confirmOrder(scope.row)"
            >确认</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.state === 1"
            @click="changePrice(scope.row)"
            >改价</el-button
          >
          <el-button
            type="text"
            v-if="[3, 4].includes(scope.row.state)"
            @click="deleteOrder(scope.row)"
            >删除订单</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import {
  getRecycle,
  candelRecycleApi,
  changeEvaluateApi,
  confrimRecycleApi,
} from "@/api/bms";
export default {
  name: "orderManagement",
  props: ["state", "searchText"],
  data() {
    return {
      // 根据条件过滤后的订单
      orders: [],
      /** 订单状态列表 */
      orderStateList: [
        { id: 0, text: "全部" },
        { id: 1, text: "待处理" },
        { id: 2, text: "待确认" },
        { id: 3, text: "已完成" },
        { id: 4, text: "已取消" },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,

      //存放商品详情的数据
      selectedOrder: null,
    };
  },
  watch: {
    state: {
      handler() {
        // 更新列表
        this.pageNum = 1;
        this.updateFilteredOrders();
      },
      immediate: true,
    },
  },
  methods: {
    // 更新列表
    async updateFilteredOrders() {
      const res = await getRecycle(
        this.pageNum,
        this.pageSize,
        this.state,
        this.searchText
      );
      this.orders = res.result.list;
      this.total = res.result.counts;
    },
    // 取消订单
    cancelOrder(order) {
      // 实现取消订单的逻辑
      this.$confirm("是否取消订单", "取消订单")
        .then(async (result) => {
          const res = await candelRecycleApi(order.id);
          if (res.code === 1) {
            this.$message.success("取消订单成功");
            this.updateFilteredOrders();
          }
        })
        .catch(() => {
          this.$message("操作取消");
        });
      console.log("取消订单", order);
    },
    // 同意回收
    confirmOrder(order) {
      this.$confirm("确认回收", "回收")
        .then(async (result) => {
          const res = await confrimRecycleApi(order.id);
          if (res.code === 1) {
            this.$message.success("回收成功");
            this.updateFilteredOrders();
          }
        })
        .catch(() => {
          this.$message("操作取消");
        });
      console.log("回收", order);
    },
    //改价
    changePrice(order) {
      this.$prompt("请输入回收价", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]+([.][0-9]{1,2})?$/,
        inputErrorMessage: "只能输入数字和小数点",
      })
        .then(async ({ value }) => {
          await changeEvaluateApi(order.id, value)
          this.$message({
            type: "success",
            message: "改价成功",
          });
          this.updateFilteredOrders();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消改价",
          });
        });
    },
    // 删除订单
    deleteOrder(order) {
      // 实现删除订单的逻辑
      this.$confirm("是否删除订单", "删除订单")
        .then(async (result) => {
          let ids = [order.id];
          const res = await delRecycleApi(ids);
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.updateFilteredOrders();
          }
        })
        .catch(() => {
          this.$message("操作取消");
        });
      console.log("删除订单", order);
    },

    // 分页相关方法，根据实际情况实现
    handleSizeChange(size) {
      this.pageSize = size;
      this.updateFilteredOrders();
      console.log(`每页 ${size} 条`);
    },
    //当前页改变时
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.updateFilteredOrders();
      console.log(`当前页: ${pageNum}`);
    },
  },
};
</script>

<style scoped></style>
