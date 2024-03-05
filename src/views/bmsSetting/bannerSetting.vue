<!-- CarouselManager.vue -->
<template>
  <div>
    <el-button type="primary" @click="showAddDialog">新增轮播图</el-button>
    <el-table :data="carouselList" style="width: 100%">
      <el-table-column label="轮播图编号" prop="id"></el-table-column>
      <el-table-column prop="imgUrl" label="轮播图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.imgUrl"
            alt="Avatar"
            style="width: 100px; height: auto"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type">
        <template slot-scope="scope">
          {{ scope.row.type === "1" ? "主页轮播图" : "分类页轮播图" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteCarousel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑和新增轮播图的 Dialog -->
    <el-dialog :visible.sync="dialogVisible" title="编辑/新增轮播图">
      <el-form
        :model="currentCarousel"
        ref="carouselForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="轮播图片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            action="http://localhost:8080/api/upload"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="currentCarousel.imgUrl"
              :src="currentCarousel.imgUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-model="currentCarousel.type" label="1"
            >主页轮播图</el-radio
          >
          <el-radio v-model="currentCarousel.type" label="2"
            >分类页轮播图</el-radio
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCarousel">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBannerApi, putBannerApi, deleteBannerApi } from "@/api/bms";
export default {
  data() {
    return {
      headers: { token: localStorage.getItem("token") },
      carouselList: [],
      dialogVisible: false,
      currentCarousel: {},
      rules: {
        imgUrl: [
          { required: true, message: "必须上传相关图片", trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message: "请至少选择一个类型",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const res = await getBannerApi();
      console.log(res.result);
      this.carouselList = res.result;
    },
    handleAvatarSuccess(res, file) {
      this.currentCarousel.imgUrl = res.result.url;
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传头像轮播图大小不能超过 5MB!");
      }
      if (isJPG) {
        return isJPG && isLt5M;
      } else if (isPNG) {
        return isPNG && isLt5M;
      }
      this.$message.error("上传头像图片只能是 JPG 格式或者PNG格式!");
    },
    showAddDialog() {
      this.currentCarousel = {
        imgUrl: null,
        type: "1",
      };
      this.dialogVisible = true;
    },
    showEditDialog(carousel) {
      this.currentCarousel = { ...carousel };
      this.dialogVisible = true;
    },
    deleteCarousel(obj) {
      this.$confirm("确认删除轮播图", "删除轮播如")
        .then(async (result) => {
          let ids = [obj.id];
          await deleteBannerApi(ids);
          this.$message.success("删除成功");
          this.init();
        })
        .catch(() => {
          this.$message("取消操作");
        });
    },
    saveCarousel() {
      this.$refs.carouselForm.validate(async (valid) => {
        if (valid) {
          //有id的情况就是修改，无就是新增，后端已做适配
          await putBannerApi(this.currentCarousel);
          this.$message.success("操作成功");
          this.dialogVisible = false;
          this.init();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.avatar {
  width: 12.7rem;
  height: auto;
  display: block;
}
.avatar-uploader {
  width: 12.8667rem;
  height: auto;
}
</style>
