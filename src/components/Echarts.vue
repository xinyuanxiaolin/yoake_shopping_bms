<template>
  <div class="echarts-container" ref="echartsContainer"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    chartOptions: {
      type: Object,
      required: true,
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "400px",
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
      this.initECharts();
      this.renderChart();
  },
  methods: {
    initECharts() {
      const container = this.$refs.echartsContainer;
      this.chartInstance = echarts.init(container);
    },
    renderChart() {
      this.chartInstance.setOption(this.chartOptions);
    },
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>

<style scoped>
.echarts-container {
  width: 600px;
  height: 400px;
}
</style>
