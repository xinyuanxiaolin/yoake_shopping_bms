<template>
    <div>
        <el-row class="oneBar">
            <el-row justify="space-between" type="flex" class="oneBar-title">
                <el-col :span="3" class="title-name"><span>手机数码</span></el-col>
                <el-col :span="6" class="title-icon">
                    <el-row justify="end" type="flex" class="edit-icon">
                        <el-col :span="3"><i @click="addLevel2(3)" class="iconfont icon-tianjia"></i></el-col>
                        <el-col :span="3"><i @click="dialogFormVisible = true" style="font-size: 25px"
                                class="iconfont icon-bianji"></i></el-col>
                        <el-col :span="3"><i class="iconfont icon-shanchu"></i></el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="oneBar-content">
                <el-button type="primary">上传<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary">上传<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary">上传<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary">上传<i class="el-icon-close el-icon--right"></i></el-button>
                <el-button type="primary">上传<i class="el-icon-close el-icon--right"></i></el-button>
            </el-row>
        </el-row>
        <!-- 新增一级分类 -->
        <div class="addOne" @click="addLevel1"></div>

        <!-- 弹出框 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="分类名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" list-type="picture-card" action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.picture" :src="form.picture" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="级别" :label-width="formLabelWidth">
                    <span v-if="categoryLevel === 1">一级分类</span>
                    <span v-if="categoryLevel === 2">二级分类</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "sortManage",
    data() {
        return {
            dialogFormVisible: false,
            categoryLevel: 1,
            title: "操作",
            imageUrl: "",
            form: {
                name: "",
                picture: "",
                level: "",
                parentId:"",
            },
            formLabelWidth: "120px",
        };
    },
    methods: {
        //添加二级分类
        addLevel2(val) {
            this.dialogFormVisible = true;
            this.categoryLevel = 2;
            this.title = "添加二级分类";
            this.level =2;
            this.parentId =val;
        },
        //添加一级分类
        addLevel1() {
            this.dialogFormVisible = true;
            this.categoryLevel = 1;
            this.title = "添加一级分类";
            this.level =1;
        },
        handleAvatarSuccess(res, file) {
            this.form.picture = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            console.log(file)
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            if (isJPG) {
                return isJPG && isLt2M;
            }
            else if(isPNG){
                return isPNG && isLt2M;
            }
            this.$message.error('上传头像图片只能是 JPG 格式或者PNG格式!');
            

            
        }

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
