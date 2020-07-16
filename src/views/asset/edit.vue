<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>设备信息</span>
                <el-button size="small " type="primary" style="float: right;" @click="goBack">返回</el-button>
            </div>
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入设备名称">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="设备状态" prop="status">
                            <el-select v-model="form.status" width="100%" filterable placeholder="请选择设备状态">
                                <el-option
                                v-for="item in statusOptions"
                                :key="item"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备类型" prop="osName">
                            <el-select v-model="form.osName" @change="changeOsName" width="100%" filterable placeholder="请选择设备类型">
                                <el-option
                                v-for="item in osNameOptions"
                                :key="item"
                                :label="item.name"
                                :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="操作系统" prop="osVersion">
                            <el-select v-model="form.osVersion" width="100%" filterable placeholder="请选择操作系统">
                                <el-option
                                v-for="item in osVersionOptions"
                                :key="item"
                                :label="item.name"
                                :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="IP地址" prop="ip">
                            <el-input v-model="form.ip" placeholder="请输入IP地址">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="备注信息" prop="memo">
                            <el-input type="textarea" v-model="form.memo" placeholder="请输入备注信息">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small " type="primary" @click="submit">提交</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账号" prop="username">
                            <el-card class="box-card">
                                <el-tag class="hand" v-for="item in form.accountList" :key="item" @click="editAcc(item.name)" @close="delAcc(item.name)" closable>{{item.name}}</el-tag>
                                <el-button class="tagAdd" size="mini" icon="el-icon-plus" type="primary" circle></el-button>
                                <el-button class="tagAdd" size="mini" icon="el-icon-delete" type="danger" circle></el-button>
                            </el-card>
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
        return {
            form:{
                id:0,
                name:'',
                osName:'Linux',
                osVersion:'',
                status:1,
                ip:'',
                memo:'',
                accountList:[]
            },osNameOptions:[
                {
                    name:'Linux',
                    version:[
                        {
                            name:'CentOS'
                        },{
                            name:'RedHat'
                        }
                    ]
                },{
                    name:'Windows',
                    version:[
                        {
                            name:'Windows Xp'
                        },{
                            name:'Windows 7'
                        }
                    ]
                }
            ],osVersionOptions:[],
            statusOptions:[
                {
                    label:'激活',
                    value:1
                },{
                    label:'锁定',
                    value:0
                },
            ],
        }
    },mounted(){
        this.changeOsName();
        this.form.accountList = [
            {
                id:0,
                name:'root',
                password:'',
                type:0,
                assetId:0,
            },{
                id:0,
                name:'fort',
                password:'',
                type:1,
                assetId:0,
            },
        ]
    },methods:{
        changeOsName(){
            let vue = this;
            var osName = vue.form.osName;
            vue.osVersionOptions = vue.getOsVersion(osName);
            if(vue.osVersionOptions.length > 0){
                vue.form.osVersion = vue.osVersionOptions[0].name;
            }
        },getOsVersion(osName){
            let vue = this;
            for(var os of vue.osNameOptions){
                if(osName == os.name){
                    return os.version;
                }
            }
            return [];
        },delAcc(name){
            alert(name)
        },editAcc(name){
            alert('编辑账号' + name)
        },goBack(){
            this.$router.push({name:'assetList'})
        }
    }
}
</script>
<style scoped>
.el-select{
    width: 100%;
}
.tagAdd{
    margin-left: 10px;
}
.el-tag{
    margin-left: 5px;
}
.hand{
    cursor:pointer
}
</style>