<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input autofocus v-model="param.username" placeholder="username">
                        <svg  slot="prepend" t="1688375035911" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3535" width="16" height="16"><path d="M828.1 722.4c-17.3-40.9-42-77.5-73.5-109s-68.2-56.2-109.1-73.5c-10.2-4.3-20.6-8.1-31-11.4 54.5-34.7 90.8-95.7 90.8-164.9 0-107.7-87.6-195.4-195.4-195.4-107.7 0-195.4 87.6-195.4 195.4 0 69.9 36.9 131.3 92.2 165.8-9.6 3.1-19 6.6-28.3 10.5-40.9 17.3-77.5 42-109 73.5s-56.2 68.2-73.5 109c-17.9 42.3-27 87.2-27 133.6h46c0-163.8 133.3-297.1 297.1-297.1S809.1 692.2 809.1 856h46c0-46.4-9.1-91.3-27-133.6zM360.6 363.5c0-82.4 67-149.4 149.4-149.4s149.4 67 149.4 149.4-67 149.4-149.4 149.4c-82.4-0.1-149.4-67.1-149.4-149.4z" p-id="3536" fill="#8a8a8a"></path></svg>
                        <!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="param.password"
                        @keyup.enter.native="submitForm()">
                        <svg slot="prepend"  t="1688374932321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2323" width="16" height="16"><path d="M288 384v-74.666667c0-123.722667 100.266667-224 224-224s224 100.224 224 224v74.666667h10.677333C811.445333 384 864 436.597333 864 501.333333v320c0 64.821333-52.469333 117.333333-117.322667 117.333334H277.333333C212.554667 938.666667 160 886.069333 160 821.333333V501.333333c0-64.821333 52.469333-117.333333 117.322667-117.333333H288z m64 0h320v-74.666667c0-88.426667-71.605333-160-160-160-88.384 0-160 71.626667-160 160v74.666667zM224 501.333333v320c0 29.397333 23.914667 53.333333 53.322667 53.333334H746.666667A53.269333 53.269333 0 0 0 800 821.333333V501.333333c0-29.397333-23.914667-53.333333-53.322667-53.333333H277.333333A53.269333 53.269333 0 0 0 224 501.333333z" fill="#8a8a8a" p-id="2324"></path></svg>
                        <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import { LOGIN } from '@/api/index';

export default {
    data: function () {
        return {
            param: {
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {

                if (valid) {
                    LOGIN(this.param).then(res => {
                        localStorage.setItem('ms_username', this.param.username);
                        localStorage.setItem('token', res.data.token);
                        this.$message.success('登录成功');
                        this.$router.push('/');
                    });
                  
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>