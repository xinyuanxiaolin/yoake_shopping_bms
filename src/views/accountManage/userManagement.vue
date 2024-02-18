<!-- UserManagement.vue -->
<template>
  <div>
    <h1>用户管理</h1>

    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="搜索用户">
        <el-input v-model="searchText" placeholder="输入用户名搜索" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="pagedUsers"
      style="width: 100%"
      :row-key="row => row.id"
      @row-click="handleRowClick"
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column prop="id" label="ID" sortable></el-table-column>
      <el-table-column prop="account" label="用户账号" sortable></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" sortable></el-table-column>
      <el-table-column prop="birthday" label="用户生日" sortable></el-table-column>
      <el-table-column prop="gender" label="用户性别" sortable></el-table-column>
      <el-table-column prop="profession" label="用户职业" sortable></el-table-column>
      <el-table-column prop="avatar" label="用户头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;">
        </template>
      </el-table-column>
      <el-table-column prop="address" label="用户地址" sortable></el-table-column>
      <el-table-column prop="createTime" label="用户创建时间" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="users.length"
    />

    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="用户账号" prop="account">
          <el-input v-model="editForm.account" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="用户生日" prop="birthday">
          <el-input v-model="editForm.birthday" />
        </el-form-item>
        <el-form-item label="用户性别" prop="gender">
          <el-input v-model="editForm.gender" />
        </el-form-item>
        <el-form-item label="用户职业" prop="profession">
          <el-input v-model="editForm.profession" />
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <el-input v-model="editForm.avatar" />
        </el-form-item>
        <el-form-item label="用户地址" prop="address">
          <el-input v-model="editForm.address" />
        </el-form-item>
        <el-form-item label="用户创建时间" prop="createTime">
          <el-input v-model="editForm.createTime" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </div>
    </el-dialog>

    <el-button type="primary" @click="showAddDialog">新增用户</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        // ... (User data remains the same)
      ],
      pagedUsers: [],
      editDialogVisible: false,
      editForm: {
        id: null,
        account: '',
        nickname: '',
        birthday: '',
        gender: '',
        profession: '',
        avatar: '',
        address: '',
        createTime: '',
      },
      currentPage: 1,
      pageSize: 10,
      searchText: '',
      searchForm: {},
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.pageSize);
    },
    filteredUsers() {
      const searchText = this.searchText.toLowerCase();
      return this.users.filter(user =>
        user.account.toLowerCase().includes(searchText) ||
        user.nickname.toLowerCase().includes(searchText) ||
        user.birthday.toLowerCase().includes(searchText) ||
        user.gender.toLowerCase().includes(searchText) ||
        user.profession.toLowerCase().includes(searchText) ||
        user.avatar.toLowerCase().includes(searchText) ||
        user.address.toLowerCase().includes(searchText) ||
        user.createTime.toLowerCase().includes(searchText)
      );
    },
  },
  watch: {
    users: {
      handler() {
        this.updatePagedUsers();
      },
      deep: true,
    },
  },
  methods: {
    handleRowClick(row) {
      // Handle row click event if needed
    },
    handleEdit(row) {
      this.editForm = { ...row };
      this.editDialogVisible = true;
    },
    handleDelete(row) {
      const index = this.users.indexOf(row);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.updatePagedUsers();
      }
    },
    showAddDialog() {
      this.editForm = { id: null, account: '', nickname: '', birthday: '', gender: '', profession: '', avatar: '', address: '', createTime: '' };
      this.editDialogVisible = true;
    },
    saveEdit() {
      // Save edited user information
      if (this.$refs.editForm.validate()) {
        if (this.editForm.id === null) {
          // Add new user
          this.users.push({
            id: this.users.length + 1,
            account: this.editForm.account,
            nickname: this.editForm.nickname,
            birthday: this.editForm.birthday,
            gender: this.editForm.gender,
            profession: this.editForm.profession,
            avatar: this.editForm.avatar,
            address: this.editForm.address,
            createTime: this.editForm.createTime,
          });
        } else {
          // Update existing user
          const index = this.users.findIndex(user => user.id === this.editForm.id);
          if (index !== -1) {
            this.$set(this.users, index, { ...this.editForm });
          }
        }

        this.editDialogVisible = false;
        this.updatePagedUsers();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.updatePagedUsers();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.updatePagedUsers();
    },
    updatePagedUsers() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedUsers = this.filteredUsers.slice(startIndex, endIndex);
    },
    handleSearch() {
      // Reset pagination to the first page when performing a search
      this.currentPage = 1;
      this.updatePagedUsers();
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
.demo-form-inline {
  margin-bottom: 20px;
}
</style>
