<!-- UserManagement.vue -->
<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="2"></el-col>
      <el-col :span="2">
        <el-button type="primary" @click="showAddDialog">新增用户</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" @click="deleteBatchIds">批量删除</el-button>
      </el-col>
      <el-col :span="15"></el-col>
      <el-col :span="8">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="searchText" placeholder="输入关键字" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSearch" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table
      :data="pagedUsers"
      style="width: 100%"
      :row-key="(row) => row.id"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" sortable></el-table-column>
      <el-table-column
        prop="account"
        label="手机号码"
        sortable
      ></el-table-column>
      <el-table-column
        prop="nickname"
        label="用户昵称"
        sortable
      ></el-table-column>
      <el-table-column
        prop="birthday"
        label="用户生日"
        sortable
      ></el-table-column>
      <el-table-column
        prop="gender"
        label="用户性别"
        sortable
      ></el-table-column>
      <el-table-column
        prop="profession"
        label="用户职业"
        sortable
      ></el-table-column>
      <el-table-column prop="avatar" label="用户头像">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar"
            alt="Avatar"
            style="width: 30px; height: 30px; border-radius: 50%"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="fullLocation"
        label="用户地址"
        sortable
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="用户创建时间"
        sortable
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    />

    <el-dialog
      :title="title"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="手机号码" prop="account">
          <el-input v-if="title == '新增用户'" v-model="editForm.account" />
          <span v-else>{{ editForm.account }}</span>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="用户生日" prop="birthday">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户职业" prop="profession">
          <el-input v-model="editForm.profession" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            action="http://localhost:8080/upload"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户地址" prop="fullLocation">
          <el-input v-model="editForm.fullLocation" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, putUsers, deleteUsers } from "@/api/bms";
export default {
  data() {
    return {
      headers: { token: localStorage.getItem("token") },
      options: [
        {
          label: "男",
          value: "男",
        },
        {
          label: "女",
          value: "女",
        },
      ],
      title: "",
      ids: [],
      pagedUsers: [],
      editDialogVisible: false,
      editForm: {
        id: null,
        account: "",
        nickname: "",
        birthday: "",
        gender: "",
        profession: "",
        avatar: "",
        address: "",
        createTime: "",
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      searchText: "",
      searchForm: {},
    };
  },
  mounted() {
    this.updatePagedUsers();
  },
  methods: {
    handleRowClick(row) {
      // Handle row click event if needed
    },
    handleEdit(row) {
      this.title = "编辑用户";
      this.editForm = { ...row };
      this.editDialogVisible = true;
    },
    //选择发生变化时
    handleSelectionChange(data) {
      // console.log(data)
      // 把选择中的值的id封装进ids里面
      let tmp = [];
      data.forEach((v) => {
        tmp.push(v.id);
      });
      this.ids = tmp;
    },
    //删除单个用户
    handleDelete(row) {
      this.$confirm("确认删除用户吗?", "删除用户")
        .then(async (result) => {
          let ids = [row.id];
          const res = await deleteUsers(ids);
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.pageNum = 1;
            this.updatePagedUsers();
          }
        })
        .catch(() => {
          this.$message("取消删除");
        });
    },
    //批量删除用户
    deleteBatchIds() {
      // console.log(this.ids)
      if (this.ids == null || this.ids == "") {
        this.$message.warning("没有选中需要删除的用户!");
        return;
      }

      this.$confirm("请你确认是否要删除这些用户?", "批量删除用户")
        .then(async (result) => {
          const res = await deleteUsers(this.ids);
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.updatePagedUsers();
          }
        })
        .catch(() => this.$message("取消批量删除"));
    },
    //新增用户
    showAddDialog() {
      this.title = "新增用户";
      this.editForm = {
        id: null,
        account: "",
        nickname: "",
        birthday: "",
        gender: "",
        profession: "",
        avatar: "",
        address: "",
        createTime: "",
      };
      this.editDialogVisible = true;
    },
    async saveEdit() {
      console.log("传值为:", this.editForm);
      const res = await putUsers(this.editForm);
      if (res.code === 1) {
        this.$message.success("操作成功!");
      } else {
        this.$message.error("操作有误,请重试!");
      }
      this.editDialogVisible = false;
      this.updatePagedUsers();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.updatePagedUsers();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.updatePagedUsers();
    },
    //数据更新时
    updatePagedUsers() {
      getUsers(this.pageNum, this.pageSize, this.searchText).then((res) => {
        this.pagedUsers = res.result.list;
        this.total = res.result.total;
      });
    },
    handleSearch() {
      // Reset pagination to the first page when performing a search
      this.pageNum = 1;
      this.updatePagedUsers();
    },
    handleAvatarSuccess(res, file) {
      this.editForm.avatar = URL.createObjectURL(file.raw);
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

<style scoped>
/* Add your custom styles here if needed */
.demo-form-inline {
  margin-bottom: 20px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader {
  width: 178px;
  height: 178px;
}
</style>
