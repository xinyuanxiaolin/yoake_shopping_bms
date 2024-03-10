<template>
  <div class="home">
    <el-card class="box-card cart-1">
      <div class="part">
        <p>常用操作</p>
        <div class="part-row">
          <div
            class="part-col"
            v-for="(item, index) in opList"
            :key="index"
            @click="$router.push(item.url)"
          >
            <div>
              <i class="iconfont" :class="item.icon"></i>
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <div style="display: flex; justify-content: space-between">
      <el-card class="box-card card-2">
        <div class="part">
          <p>统计表</p>
          <div>
            <Echarts
              ref="bar"
              :chartOptions="barChartOptions"
              :width="chartWidth"
              :height="chartHeight"
            />
          </div>
        </div>
      </el-card>
      <el-card class="box-card card-3">
        <div class="part">
          <p>待处理事务</p>
          <div class="part-row border-color">
            <div
              class="part-col text-color"
              v-for="(order, index) in orderList"
              :key="index"
              @click="$router.push(order.url)"
            >
              <span class="text-color">{{ order.num }}</span>
              <span class="text-color">{{ order.name }}</span>
              <i class="iconfont icon-size" :class="order.icon"></i>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getOrderListAllApi } from "@/api/bms";
import Echarts from "@/components/Echarts.vue";
export default {
  name: "home",
  components: {
    Echarts,
  },
  data() {
    return {
      opList: [
        {
          url: "/bms/product-manage",
          name: "商品管理",
          icon: "icon-shangpinguanli",
        },
        {
          url: "/bms/product-publish",
          name: "发布",
          icon: "icon-fabu",
        },
        {
          url: "/bms/order-manage",
          name: "订单中心",
          icon: "icon-dingdanzhongxin",
        },
      ],
      orderList: [
        {
          url: "/bms/order-manage",
          num: null,
          name: "待付款",
          icon: "icon-daifukuan",
        },
        {
          url: "/bms/order-manage",
          num: null,
          name: "待发货",
          icon: "icon-daifahuo",
        },
        {
          url: "/bms/order-manage",
          num: null,
          name: "待收货",
          icon: "icon-daifukuan",
        },
      ],
      //订单统计图
      barChartOptions: {
        tooltip: {
          formatter: function (params) {
            return params.name + ": " + params.value;
          },
        },
        xAxis: {
          type: "category",
          data: ["待付款", "待收货", "待发货", "待评价", "已完成", "已取消"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "订单数量",
            type: "bar",
            data: [],
            itemStyle: {
              color: function (params) {
                var colorList = [
                  "#c23531",
                  "#2f4554",
                  "#61a0a8",
                  "#d48265",
                  "#749f83",
                  "#ca8622",
                ];
                return colorList[params.dataIndex];
              },
            },
          },
        ],
      },

      chartWidth: "100%", // 定义图表宽度
      chartHeight: "400px", // 定义图表高度
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      //获取所有订单情况
      const res = await getOrderListAllApi(1, 10, 0, "");
      //待处理事务数据处理
      let orderState = [1, 2, 3];
      for (let i = 0; i < this.orderList.length; ++i) {
        let data = res.result.filter(
          (v) => v.orderState == orderState[i]
        );
        this.orderList[i].num = data.length;
        //  console.log(data)
      }

      //订单echarts数据处理
      let orderState2 = [1, 2, 3, 4, 5, 6];
      let data = [];
      for (let j = 0; j < orderState2.length; ++j) {
        const tmp = res.result.filter(
          (v) => v.orderState == orderState2[j]
        );
        data.push(tmp.length);
      }
      this.barChartOptions.series[0] = {
        ...this.barChartOptions.series[0],
        data,
      };
      this.$refs.bar.renderChart();
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  margin: 10px;
  .el-card {
    margin-bottom: 20px;
  }
  .card-2,
  .card-3 {
    width: 49%;
    height: 500px;
  }
  .part {
    display: flex;
    flex-direction: column;
    .part-row {
      display: flex;
      justify-content: space-around;
      margin: 30px 10px;
      .part-col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        div {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 80px;
          background-color: #3aaaf4;
          margin-bottom: 20px;
          i {
            font-size: 40px;
            color: #fff;
          }
        }

        span {
          margin-bottom: 10px;
          color: #a8a8a8;
        }
      }
    }
  }
}
.border-color {
  background-color: #ffa098;
  padding: 10px;
  border-radius: 10px;
}
.text-color {
  color: #fff !important;
}
.icon-size {
  font-size: 30px;
}
</style>
