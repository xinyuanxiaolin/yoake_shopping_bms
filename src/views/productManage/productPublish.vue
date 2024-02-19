<template>
  <el-row justify="row-bg">
    <ProductEditAndPublish
      :form.sync="form"
      @form-updated="handleFormUpdated"
      ref="changeProduct"
    ></ProductEditAndPublish>
    <div style="display: flex; justify-content: center">
      <el-button type="primary" @click="confirmSumbit">添加商品</el-button>
    </div>
  </el-row>
</template>

<script>
import ProductEditAndPublish from "@/views/productManage/components/ProductEditAndPublish.vue";
import { publishGoods } from "@/api/bms";
export default {
  name: "productPublish",
  components: {
    ProductEditAndPublish,
  },
  data() {
    return {
      form: {
        mainPictures: [],
        categoryList: [],
        pictures: [],
        properties: [],
        name: "",
        stock: "",
        price: "",
        desc: "",
      },
    };
  },
  mounted() {},
  methods: {
    handleFormUpdated(updatedForm) {
      // 处理表单变化事件，可以在这里执行额外的逻辑
      console.log("父组件接收到子组件表单变化事件");
      console.log("更新后的表单数据:", updatedForm);
      this.form = updatedForm;
    },

    //确认提交商品
    confirmSumbit() {
      this.$refs.changeProduct.$refs["rulesForm"].validate(async (valid) => {
        if (valid) {
          const res = await publishGoods(this.form);
          if (res.code == 1) {
            this.$message.success("商品发布成功!");
            setTimeout(() => {
              this.$router.push("/bms/product-manage");
            }, 1000);
          }
        } else {
          console.log(this.form.mainPictures);

          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-left: 20px;
}
.properties {
  width: 700px;
}
</style>
