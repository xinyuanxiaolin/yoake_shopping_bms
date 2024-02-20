<template>
  <el-row justify="row-bg">
    <el-form
      :model="form"
      label-position="right"
      label-width="100px"
      ref="rulesForm"
      :rules="rules"
    >
      <el-form-item label="商品图" prop="mainPictures" key="form.mainPictures">
        <el-upload
          action="http://localhost:8080/upload"
          list-type="picture-card"
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleMainPictureRemove"
          :on-success="handleMainPictureSuccess"
          :file-list="mainPictureFileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入商品名称"
          style="width: 350px"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryList">
        <el-cascader
          v-model="form.categoryList"
          :options="options"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="商品库存" prop="stock">
        <el-input
          type="number"
          v-model="form.stock"
          placeholder="请输入数量"
          style="width: 350px"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input
          type="number"
          v-model="form.price"
          placeholder="请输入商品价格"
          style="width: 350px"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input
          v-model="form.desc"
          placeholder="请输入商品描述"
          style="width: 350px"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品海报">
        <el-upload
          action="http://localhost:8080/upload"
          list-type="picture-card"
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handlePictureRemove"
          :on-success="handlePictureSuccess"
          :file-list="PictureFileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="商品属性" class="properties" prop="properties">
        <el-table :data="form.properties" style="width: 100%">
          <el-table-column prop="name" label="属性名">
            <template #default="scope">
              <el-input v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="值">
            <template #default="scope">
              <el-input v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="text" @click="removeProperty(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button type="success" @click="addProperty">新增一行</el-button>
      </el-form-item>

      <!-- <div style="display: flex; justify-content: center">
          <el-button type="primary" @click="confirmSumbit">添加商品</el-button>
        </div> -->
    </el-form>
  </el-row>
</template>

<script>
import {getCategory } from "@/api/bms";
import { throttle } from "lodash";
export default {
  name: "ProductPublish",
  props: ["form"],
  watch: {
    //使用第三方库实现节流
    form: {
      handler: throttle(function (updatedForm) {
        // 在一段时间内只执行一次
        this.$emit("form-updated", updatedForm);
      }, 1000), // 500毫秒内只执行一次
      deep: true,
    },
  },
  data() {
    return {
      // form: {
      //   mainPictures: [],
      //   categoryList: [],
      //   pictures: [],
      //   properties: [],
      //   name: "",
      //   stock: "",
      //   price: "",
      //   desc: "",
      // },
      headers:{'token':localStorage.getItem('token')},
      mainPictureFileList:[],
      PictureFileList:[],
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        mainPictures: [],
        categoryList: [
          { required: true, message: "请填写商品分类", trigger: "blur" },
        ],
        stock: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        properties: [
          { required: true, message: "请填写相关商品属性", trigger: "blur" },
        ],
      },

      dialogImageUrl: "",
      dialogVisible: false,
      //商品分类获取数据存的地方
      options: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      //将商品分类数据拿到
      const res = await getCategory();
      // console.log(res);
      //拿到后进行分类数据的封装
      let data = [];
      //获取一级分类封装
      res.result.forEach((v) => {
        let data1 = {
          value: "",
          label: "",
          children: [],
        };
        data1.value = v.id;
        data1.label = v.name;
        data1.children = v.children;
        //获取二级分类封装
        data1.children = data1.children.map((v) => {
          let data2 = {
            value: "",
            label: "",
          };
          data2.value = v.id;
          data2.label = v.name;
          return data2;
        });
        data.push(data1);
      });

      //最后把封装好的分类返回给options
      this.options = data;
      // console.log("最终数据结果", data);
    },
    //处理图片问题,由父组件调用
    solvePictures(){
      //因为el的格式是{url:""}的数组
      // console.log(this.form.mainPictures)
      if(this.form.mainPictures!=[]&&this.form.mainPictures!=null){
        this.form.mainPictures.forEach(v=>{
          let data ={
            url:v
          }
          this.mainPictureFileList.push(data)
        })
      }
      if(this.form.pictures!=[]&&this.form.pictures!=null){
        this.form.pictures.forEach(v=>{
          let data ={
            url:v
          }
          this.PictureFileList.push(data)
        })
      }
      
      


    },
    handleChange(val) {
      // console.log("分类改变了",val);
    },
    //主图片删除时
    handleMainPictureRemove(file) {
      console.log(file);
      let url = file.url;
      let result = this.form.mainPictures.filter((v) => v != url);
      this.form.mainPictures = result;
      // console.log(this.form.mainPictures)
    },
    //商品海报图片删除时
    handlePictureRemove(file) {
      console.log(file);
      let url =file.url;
      let result = this.form.pictures.filter((v) => v != url);
      this.form.pictures = result;
    },
    //图片大图预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /*  图片上传成功后处理回显url地址 */
    //主图上传成功时
    handleMainPictureSuccess(res, file) {
      console.log("主图成功上传的回显:", res, file);
      this.form.mainPictures.push(res.result.url);
      console.log(this.form.mainPictures)
    },
    //商品海报图上传成功时
    handlePictureSuccess(res, file) {
      console.log("海报图片成功上传的回显:", res);
      this.form.pictures.push(res.result.url);

    },
    //在图片上传是格式验证
    beforeAvatarUpload(file) {
      // console.log(file)
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传商品图片大小不能超过 2MB!");
      }
      if (isJPG) {
        return isJPG && isLt2M;
      } else if (isPNG) {
        return isPNG && isLt2M;
      }
      this.$message.error("上传商品图片只能是 JPG 格式或者PNG格式!");
    },

    //添加一行商品详情属性
    addProperty() {
      this.form.properties.push({ name: "", value: "" });
    },
    //删除对应的商品详情属性
    removeProperty(property) {
      const index = this.form.properties.indexOf(property);
      if (index !== -1) {
        this.form.properties.splice(index, 1);
      }
    },

    //父组件取消界面时清空残留数据
    clearData(){
      this.mainPictureFileList=[]
      this.PictureFileList=[]
    }
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-left: 20px;
}
.properties {
  width: 600px;
}
</style>
