<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>身份认证</span>
                <!--
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                -->
            </div>
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username" placeholder="请输入账号">
                        <i slot="suffix" class="el-input__icon el-icon-user"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password" show-password=true placeholder="请输入密码">
                        <i slot="suffix" class="el-input__icon el-icon-lock"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="imgCode">
                    <el-image :src="codeUrl" class="codeImg" @click="changeCode"></el-image>
                    <el-input class="codeText" v-model="form.imgCode" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            form:{
                username: '',
                password: '',
                imgCode:'',
                grantType:'password',
            },
            codeUrl:'/login/imgCode',
            rules:{
                username:[
                    {required: true,message:'请输入账号',trigger: 'change'}
                ],password:[
                    {required: true,message:'请输入密码',trigger: 'change'}
                ],imgCode:[
                    {required: true,message:'请输入验证码',trigger: 'change'}
                ]
            }
        }
    },
    methods:{
        changeCode(){
            this.codeUrl = '/login/imgCode?t=' + new Date().getTime();
        },onSubmit(){
            let vue = this;
            vue.$refs['form'].validate((valid) => {
                if(valid){
                    vue.$post('/oauth2/oauth/token',{
                        params:{
                            username: vue.form.username,
                            password: vue.form.password,
                            imgCode: vue.form.imgCode,
                            grant_type: vue.form.grantType,
                        }
                    }).then(function(result){
                        console.log(result);
                        if(result.access_token){
                            vue.$router.push({name:'main'})
                            localStorage.setItem('token',result.access_token);
                        }
                        //alert(result);
                    }).catch(function(e){
                        //alert(e);
                        console.log(e);
                        vue.changeCode();
                    })
                }
            })
            
        }
    }
}
</script>
<style scoped>
    .box-card{
        margin-top: calc(25% - 200px);
        margin-left: calc(50% - 250px);
        width: 550px;
        height: 400px;
    }
    .codeImg{
        float: left;
        height: 40px;
        width: 100px;
    }
    .codeText{
        margin-left: 10px;
        float: left;
        width: calc(100% - 110px);
    }
</style>