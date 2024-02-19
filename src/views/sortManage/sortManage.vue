<template>
  <div>
    <el-row class="oneBar" v-for="(item, index) in categoryList" :key="index">
      <el-row justify="space-between" type="flex" class="oneBar-title">
        <el-col :span="3" class="title-name"
          ><span>{{ item.name }}</span></el-col
        >
        <el-col :span="6" class="title-icon">
          <el-row justify="end" type="flex" class="edit-icon">
            <el-col :span="3"
              ><i @click="addLevel2(item.id)" class="iconfont icon-tianjia"></i
            ></el-col>
            <el-col :span="3"
              ><i
                @click="editCategory(item, 1)"
                style="font-size: 25px"
                class="iconfont icon-bianji"
              ></i
            ></el-col>
            <el-col :span="3"
              ><i
                @click="deleteTopCategory(item.id)"
                class="iconfont icon-shanchu"
              ></i
            ></el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="oneBar-content">
        <el-button
          type="primary"
          v-for="(secItem, secIndex) in item.children"
          :key="secIndex"
          ><span @click.prevent="editCategory(secItem, 2)">{{
            secItem.name + "(" + secItem.goods.length + ")"
          }}</span
          ><i
            @click.prevent="deleteSecCategory(secItem.id)"
            class="el-icon-close el-icon--right"
          ></i
        ></el-button>
        <div
          style="display: flex; margin-top: 10px; justify-content: center"
          v-if="item.children.length === 0"
        >
          该分类下还没有子栏目
        </div>
      </el-row>
    </el-row>
    <!-- 新增一级分类 -->
    <div class="addOne" @click="addLevel1"></div>

    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            action="http://localhost:8080/upload"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.picture" :src="form.picture" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="级别" :label-width="formLabelWidth">
          <span v-if="form.level === 1">一级分类</span>
          <span v-if="form.level === 2">二级分类</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSumbit">取 消</el-button>
        <el-button type="primary" @click="confirmSumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategory,
  addCategory,
  deleteOneCategory,
  deleteTwoCategory,
  putCategory,
} from "@/api/bms";
export default {
  name: "sortManage",
  data() {
    return {
      dialogFormVisible: false,
      title: "操作",
      isEdit: false,
      categoryList: [],
      headers:{'token':localStorage.getItem('token')},
      form: {
        id: "",
        name: "",
        picture: "",
        level: "",
        parentId: "",
      },
      formLabelWidth: "120px",
      rules: {
        name: [{ required: true, message: "请输入分类名称", trriger: "blur" }],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    //获取分类数据
    async init() {
      const res = await getCategory();
      //    console.log(res);
      this.categoryList = res.result;
    },

    //添加二级分类
    addLevel2(val) {
      this.dialogFormVisible = true;
      this.isEdit = false;
      this.title = "添加二级分类";
      this.form.level = 2;
      this.form.parentId = val;
    },
    //添加一级分类
    addLevel1() {
      this.dialogFormVisible = true;
      this.isEdit = false;
      this.title = "添加一级分类";
      this.form.level = 1;
    },
    //删除一级分类
    deleteTopCategory(id) {
      this.$confirm(
        "是否要删除该分类,若删除其下关联分类和商品也会对应删除?",
        "删除一级分类"
      )
        .then(async (result) => {
          await deleteOneCategory(id);
          this.$message.success("删除成功");
          this.init();
        })
        .catch(() => {});
    },
    //删除二级分类
    deleteSecCategory(id) {
      this.$confirm(
        "是否要删除该分类,若删除其下关联商品也会对应删除?",
        "删除二级分类"
      )
        .then(async (result) => {
          await deleteTwoCategory(id);
          this.$message.success("删除成功");
          this.init();
        })
        .catch(() => {});
    },
    //编辑分类
    editCategory(item, level) {
      this.title = "修改分类";
      this.dialogFormVisible = true;
      this.isEdit = true;
      //level为1,编辑一级分类,为2,编辑二级分类
      this.form.level = level;
      this.form.id = JSON.parse(JSON.stringify(item.id));
      this.form.name = JSON.parse(JSON.stringify(item.name));
    },
    //取消提交表单
    cancelSumbit() {
      this.dialogFormVisible = false;
      this.form = {
        name: "",
        picture: "",
        level: "",
        parentId: "",
      };
    },
    //提交表单
    confirmSumbit() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          //做个是不是编辑分类的判断
          if (this.isEdit) {
            await putCategory(this.form);
          } else {
            await addCategory(this.form);
          }
          this.$message.success("提交成功");
          this.$nextTick(() => {
            this.init();
          });
          this.form = {
            name: "",
            picture: "",
            level: "",
            parentId: "",
          };
          this.dialogFormVisible = false;
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },

    handleAvatarSuccess(res, file) {
      this.form.picture = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (isJPG) {
        return isJPG && isLt2M;
      } else if (isPNG) {
        return isPNG && isLt2M;
      }
      this.$message.error("上传头像图片只能是 JPG 格式或者PNG格式!");
    },
  },
};
</script>

<style lang="scss" scoped>
.addOne {
  margin: 10px 10px;
  border: 3px dashed #d8d8d8;
  background: no-repeat center/4%;
  background-image: url(@/assets/img/bms/add.png);
  height: 200px;
  cursor: pointer;
}

//一级分类标签框
.oneBar {
  height: 200px;
  margin: 10px 10px;
  border: 1px solid #d8d8d8;

  .oneBar-title {
    height: 50px;
    background-color: #dddddd;
    align-items: center;

    .title-name {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #72b63f;

      span {
        font-size: 15px;
        color: white;
      }
    }

    .title-icon {
      .edit-icon i {
        cursor: pointer;
        font-size: 20px;
      }
    }
  }

  .oneBar-content {
    height: 150px;

    button {
      margin: 10px 10px;
    }
  }
}
</style>
