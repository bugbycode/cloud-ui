<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户信息</span>
                <el-button size="small " type="primary" style="float: right;" @click="goBack">返回</el-button>
            </div>
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name" placeholder="请输入姓名">
                                <i slot="suffix" class="el-input__icon el-icon-user"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="所属角色" placeholder="请输入账号" prop="roleId">
                            <el-select v-model="form.roleId" width="100%" filterable placeholder="请选择所属角色">
                                <el-option
                                v-for="item in roleOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Email" prop="email">
                            <el-input v-model="form.email" placeholder="请输入Email">
                                <i slot="suffix" class="el-input__icon el-icon-message"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="mobile">
                            <el-input v-model="form.mobile" placeholder="请输入手机号码">
                                <i slot="suffix" class="el-input__icon el-icon-mobile"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="联系地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入联系地址"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small " type="primary" @click="submit">提交</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账号" prop="username">
                            <el-input v-model="form.username" placeholder="请输入账号" :readonly="form.id > 0">
                                <i slot="suffix" class="el-input__icon el-icon-user"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
                                <i slot="suffix" class="el-input__icon el-icon-lock"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请输入密码">
                                <i slot="suffix" class="el-input__icon el-icon-lock"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        var comfirmPwd =  (rule, value, callback) => {
            if (!value && this.form.password) {
                return callback(new Error('请输入密码'));
            }
            if(value != this.form.password){
                return callback(new Error('两次输入的密码不一致'));
            }
            callback();
        }
        var checkPwd =  (rule, value, callback) => {
            if (!value && this.form.id == 0) {
                return callback(new Error('请输入密码'));
            }
            callback();
        }
        return {
            
            form:{
                id: 0,
                name:'',
                username:'',
                password:'',
                confirmPassword:'',
                email:'',
                roleId:'',
                mobile:'',
                address:'',
            },roleOptions:[
                {
                    id:1,
                    name:'系统管理员'
                },{
                    id:2,
                    name:'普通用户'
                }
            ],rules:{
                roleId:[
                    {required: true,message:'请选择角色',trigger: 'change'}
                ],
                name:[
                    {required: true,message:'请输入姓名',trigger: 'change'}
                ],
                username:[
                    {required: true,message:'请输入账号',trigger: 'change'}
                ],password:[
                    {validator: checkPwd,trigger: 'change'}
                ],confirmPassword:[
                    {validator: comfirmPwd,trigger: 'change'}
                ]
            }
        }
    },mounted(){
        let vue = this;
        vue.form.id = vue.$route.query.id;
        if(vue.form.id > 0){
            vue.queryById(vue.form.id)
        }
    },methods:{
        queryById(id){
            let vue = this;
            vue.$get('/user/user/queryById',{
                params:{
                    id:id
                }
            }).then(function(result) {
                vue.form.name = result.name;
                vue.form.username = result.username;
                vue.form.email = result.email;
                vue.form.roleId = result.roleId;
                vue.form.mobile = result.mobile;
                vue.form.address = result.address;
            }).catch(function(e){
                console.log(e);
            })
        },goBack(){
            this.$router.push({name:'userList'})
        },submit(){
            let vue = this;
            vue.$refs['form'].validate((valid) => {
                if(valid){
                    let path = vue.form.id > 0 ? '/usr/user/update' : '/user/user/insert';
                    vue.$post(path,{
                        data: vue.form
                    }).then(function(result){
                        console.log(result);
                        vue.$router.push({name:'userList'})
                    }).catch(function(e){
                        console.log(e);
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.el-select{
    width: 100%;
}
</style>