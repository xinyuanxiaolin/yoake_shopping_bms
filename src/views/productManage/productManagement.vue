<template>
  <div>
    <!-- 头部 -->
    <el-row type="flex" justify="center">
      <el-col :span="2"></el-col>
      <el-col :span="2">
        <el-button type="primary" @click="AddGoods">新增商品</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="deleteBatchIds">批量删除</el-button>
      </el-col>
      <el-col :span="15"></el-col>
      <el-col :span="8">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item>
            <el-input v-model="searchText" placeholder="输入关键字" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSearch" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="goodsData"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
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

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    />
    
    <!-- 弹框 -->
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
import { getGoodsList, getGoodsById, putGoods, deleteGoods } from "@/api/bms";
import ProductEditAndPublish from "@/views/productManage/components/ProductEditAndPublish.vue";
export default {
  components: {
    ProductEditAndPublish,
  },
  data() {
    return {
      editDialogVisible: false,
      form: {},
      goodsData: [],
      pageNum:1,
      pageSize:10,
      searchText:'',
      total: 0,
      ids:[],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      //获取初始的商品数据
      const res = await getGoodsList(this.pageNum,this.pageSize,this.searchText)
      // console.log(res);
      this.goodsData = res.result.list;
    },
    //删除单个商品
    handleDelete(row) {
      console.log(row);
      let ids = [row.id];
      this.$confirm("确认删除商品?", "删除商品")
        .then(async () => {
          await deleteGoods(ids);
          this.$message.success("删除成功");
          this.$nextTick(() => {
            this.init();
          });
        })
        .catch(() => {
          this.$message("取消删除");
        });
    },
    //批量删除商品
    deleteBatchIds(){
      if (this.ids == null || this.ids == "") {
        this.$message.warning("没有选中需要删除的用户!");
        return;
      }

      this.$confirm("请你确认是否要删除这些商品?", "批量删除商品")
        .then(async (result) => {
          const res = await deleteGoods(this.ids);
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.init();
          }
        })
        .catch(() => this.$message("取消批量删除"));
    },
    //编辑商品
    handleEdit(row) {
      this.editDialogVisible = true;
      // console.log(row)
      // this.$refs.changeProduct.$refs["rulesForm"].validate((valid) => {
      //   if (valid) {
      //     console.log("你好")
      //   } else {
      //     console.log(this.form.mainPictures);

      //     return false;
      //   }
      // });
      getGoodsById(row.parentId, row.id).then((res) => {
        this.form = res.result;
        this.$nextTick(() => {
          this.$refs.changeProduct.solvePictures();
        });
      });
    },
    // 选择框发生改变
    handleSelectionChange(val) {
      let data =[]
      val.forEach(v=>{
        data.push(v.id)
      })
      this.ids = data;
      // console.log(this.ids );
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
        this.$refs.changeProduct.clearData();
        this.editDialogVisible = false;
      }
    },
    //新增商品
    AddGoods(){
      this.$router.push("/bms/product-publish")
    },
    //搜索
    handleSearch(){
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.init();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.init();
    },
  },
};
</script>

<style></style>
