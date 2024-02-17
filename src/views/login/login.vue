<template>
    <div style="background-color: #fff;">
        <div class="login-bg">
            <img :src="img_bg" alt="">

        </div>
        <div class="login-admin">
            <div class="frame" @keyup.enter="login">
            <div><div><i class="iconfont icon-guanliyuan"></i><span>后台管理系统</span></div></div>
            <div>
                <span>用户名</span>
                <el-input v-model="form.account" placeholder="请输入用户名"  clearable></el-input>
            </div>
            <div>
                <span>密码</span>
                <el-input v-model="form.password" show-password  placeholder="请输入密码"></el-input>
            </div>
            <div>
                <div id="checkbox"><el-checkbox v-model="checked">记住我</el-checkbox></div>
                <el-button id="button" @click="login" >登录</el-button>
            </div>
            </div>
        </div>
    </div>

</template>

<script>
import {Login} from '@/api/bms'
export default {
    name:'login',
    data() {
        return {
            checked:false,
            form:{
                account:"",
                password:"",
            },
            img_bg: require("@/assets/img/bms/login.png")
            
        }
    },
    methods:{
        async login(){
            const res = await Login(this.form);
            if(res.code ===0){
                this.$message.error(res.msg);
                return;
            }
            localStorage.setItem("token",res.result);
            this.$message.success("登录成功");
            setTimeout(() => {
                this.$router.push("/bms");
            }, 1000);

        }
    }
}
</script>

<style lang="scss" scoped>
// 定义基本颜色
$primary-color: #797979;
.login-admin{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.frame{
    z-index: 99;
    display: flex;
    width: 350px;
    height: 400px;
    align-items: center;
    background-color: rgba(255,255,255,0.9);
    flex-direction: column;
    box-shadow: 4px 7px 15px  #b9b8b8;
    border-radius: 20px;

    div{
        display: flex;
        flex-direction: column;
        color: $primary-color;
        div{
            display: flex;
            flex-direction: row;
            margin: 15px 5px;
            i,span{
                font-size: 30px;
                margin-left:5px;
            }

        }
        #checkbox{
            width: 200px;
        }
        #button{
            width: 150px;
            margin: auto;
            color:white;
            font-weight: 800;
            letter-spacing: 5px;
            background-color: #6777EF;
        }

        
    }

}
.login-bg{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img{
        width: 1000px;
    }

}
</style>

