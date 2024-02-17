<template>
  <div>
    <!-- 标头组件-->
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6" class="setting">{{ $route.meta.title }}</el-col>
    </el-row>
    <el-divider></el-divider>
  </div>
</template>
<script>
export default {
  name: "Breadcrumbs",
};
</script>
<style lang="scss" scoped>
.setting {
  margin-top: 30px;
  color: #909399;
  font-size: 30px;
  align-items: center;
  text-align: center;
  justify-content: center;
}
</style>
