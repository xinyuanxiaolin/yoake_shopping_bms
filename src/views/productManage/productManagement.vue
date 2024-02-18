<template>
  <div>
    <el-table
      :data="goodsData"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="picture" label="商品图片" width="150">
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
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑商品"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
    >
      <ProductEditAndPublish
        :form.sync="form"
        @form-updated="handleFormUpdated"
        ref="changeProduct"
      ></ProductEditAndPublish>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSumbit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, getGoodsById, putGoods } from "@/api/bms";
import ProductEditAndPublish from "@/views/productManage/components/ProductEditAndPublish.vue";
export default {
  components: {
    ProductEditAndPublish,
  },
  data() {
    return {
      editDialogVisible: false,
      form: {},
      multipleSelection: [],
      goodsData: [
        {
          picture: "1",
          name: "王小虎",
          category: "上海",
          nowPrice: "普陀区",
          price: "上海市普陀区金沙江路 1518 弄",
          stock: 200333,
          desc: "湿哒哒达到啊大大大啊大打阿瑟的啊大是",
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      //获取初始的商品数据
      const res = await getGoodsList();
      // console.log(res);
      this.goodsData = res.result;
    },
    //删除单个商品
    handleDelete(row) {
      console.log(row);
    },
    //编辑商品
    handleEdit(row) {
      // console.log(row)
      this.editDialogVisible = true;
      getGoodsById(row.parentId, row.id).then((res) => {
        this.form = res.result;
        this.$nextTick(() => {
          this.$refs.changeProduct.solvePictures();
        });
      });
    },
    // 选择框发生改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    handleFormUpdated(updatedForm) {
      // 处理表单变化事件，可以在这里执行额外的逻辑
      console.log("父组件接收到子组件表单变化事件");
      console.log("更新后的表单数据:", updatedForm);
      this.form = updatedForm;
    },
    //取消编辑
    handleCancel() {
      this.editDialogVisible = false;
      //删除编辑页面内的数据残留
      this.form = {};
      this.$refs.changeProduct.clearData();
    },
    //保存修改商品
    async handleSumbit() {
      const res = await putGoods(this.form);
      if (res.code == 1) {
        this.$message.success("保存成功");
        this.editDialogVisible = false;
      }
    },
  },
};
</script>

<style></style>
