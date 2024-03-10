<template>
  <div>
    <!-- 列表内容 -->
    <el-table :data="orders" style="width: 100%" border stripe>
      <!-- 列定义，根据实际需要调整 -->
      <el-table-column prop="id" label="订单编号" width="150"></el-table-column>
      <el-table-column label="商品详情" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px; cursor: pointer"
            :src="scope.row.goods[0].picture"
            @click="showProductDetails(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="receiverContact"></el-table-column>
      <el-table-column label="联系电话" prop="receiverMobile"></el-table-column>
      <el-table-column
        label="送货地址"
        prop="receiverAddress"
      ></el-table-column>
      <el-table-column label="订单创建时间" prop="createTime"></el-table-column>
      <el-table-column label="商品总价" prop="totalMoney"></el-table-column>
      <el-table-column label="运费" prop="postFee"></el-table-column>
      <el-table-column label="总费用" prop="payMoney"></el-table-column>
      <el-table-column label="购买总数" prop="totalNum"></el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          {{ orderStateList[scope.row.orderState].text }}
        </template>
      </el-table-column>
      <!-- 其他列... -->
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <!-- 根据订单状态显示不同的操作按钮 -->
          <el-button
            type="text"
            v-if="[1, 2].includes(scope.row.orderState)"
            @click="cancelOrder(scope.row)"
            >取消订单</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.orderState === 2"
            @click="shipOrder(scope.row)"
            >发货</el-button
          >
          <el-button
            type="text"
            v-if="[3, 4, 5, 6, 8].includes(scope.row.orderState)"
            @click="deleteOrder(scope.row)"
            >删除订单</el-button
          >
          <el-button
            type="text"
            v-if="[7].includes(scope.row.orderState)"
            @click="refundOrder(scope.row)"
            >退款</el-button
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

    <!-- 商品详情弹出框 -->
    <el-dialog :visible.sync="dialogVisible" title="订单商品详情" width="50%">
      <!-- 在这里放置商品详情的内容 -->
      <!-- 例如，显示订单中的商品列表，商品名称、数量等 -->
      <el-table
        :data="selectedOrder"
        ref="multipleTable"
        border
        style="width: 100%"
      >
        <el-table-column prop="picture" label="商品图片" width="150">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.picture"
              style="width: 100px; height: 100px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="150">
        </el-table-column>
        <el-table-column prop="category" label="商品分类" width="150">
        </el-table-column>
        <el-table-column prop="nowPrice" label="商品现价" width="150">
        </el-table-column>
        <el-table-column prop="price" label="商品原价" width="150">
        </el-table-column>
        <el-table-column prop="stock" label="商品库存" width="150">
        </el-table-column>
        <el-table-column prop="desc" label="商品描述"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderListApi,
  cancelOrderApi,
  deleteOrderApi,
  getConsignmentApi,
  confirmRefundApi
} from "@/api/bms";
export default {
  name: "orderManagement",
  props: ["orderState", "searchText"],
  data() {
    return {
      // 根据条件过滤后的订单
      orders: [],
      /** 订单状态列表 */
      orderStateList: [
        { id: 0, text: "全部" },
        { id: 1, text: "待付款" },
        { id: 2, text: "待发货" },
        { id: 3, text: "待收货" },
        { id: 4, text: "待评价" },
        { id: 5, text: "已完成" },
        { id: 6, text: "已取消" },
        { id: 7, text: "待退款" },
        { id: 8, text: "已退款" },
      ],

      pageNum: 1,
      pageSize: 10,
      total: 0,
      //打开商品详情弹框
      dialogVisible: false,
      //存放商品详情的数据
      selectedOrder: null,
    };
  },
  watch: {
    orderState: {
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
      const res = await getOrderListApi(
        this.pageNum,
        this.pageSize,
        this.orderState,
        this.searchText
      );
      this.orders = res.result.items;
      this.total = res.result.counts;
    },
    // 取消订单
    cancelOrder(order) {
      // 实现取消订单的逻辑
      this.$confirm("是否取消订单", "取消订单")
        .then(async (result) => {
          const res = await cancelOrderApi(order.id);
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
    // 发货
    shipOrder(order) {
      // 实现发货的逻辑
      this.$confirm("是否发货", "发货")
        .then(async (result) => {
          const res = await getConsignmentApi(order.id);
          if (res.code === 1) {
            this.$message.success("发货成功");
            this.updateFilteredOrders();
          }
        })
        .catch(() => {
          this.$message("操作取消");
        });
      console.log("发货", order);
    },
    // 删除订单
    deleteOrder(order) {
      // 实现删除订单的逻辑
      this.$confirm("是否删除订单", "删除订单")
        .then(async (result) => {
          let ids = [order.id];
          const res = await deleteOrderApi(ids);
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

    //退款
    refundOrder(order) {
      // 实现退款的逻辑
      this.$confirm("请确认无误后再进行退款", "确认退款")
        .then(async (result) => {
          const res = await confirmRefundApi(order.id);
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
    //点击商品图片显示商品详情
    showProductDetails(data) {
      // 显示商品详情弹出框
      this.selectedOrder = data.goods;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped></style>
