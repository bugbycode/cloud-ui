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
                            <el-button size="small " type="primary" @click="subData">提交</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账号">
                            <el-card class="box-card">
                                <el-tag class="hand" v-for="(item,index) in form.accountList" :key="item" @click="showAccDialog(item.name)" @close="delAcc(index)" closable>{{item.name + '(' + (item.type == 0 ? '管理员' : '普通账号') + ')'}}</el-tag>
                                <el-button class="tagAdd" size="mini" icon="el-icon-plus" type="primary" @click="showAccDialog(null)" circle></el-button>
                                <el-button class="tagAdd" size="mini" icon="el-icon-delete" type="danger" @click="delAllAcc" circle></el-button>
                            </el-card>
                        </el-form-item>
                        <el-form-item label="协议">
                            <el-card class="box-card">
                                <!--<el-tag class="hand" v-for="(item,index) in form.protocolList" :key="item" @click="showProDialog(item.type)" @close="delPro(index)" closable>{{item.name}}</el-tag>
                                -->
                                <el-table
                                    :data="form.protocolList"
                                    border
                                    style="width: 100%">
                                    <el-table-column
                                        label="协议类型">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.type" width="100%" disabled="true" filterable placeholder="请选择协议类型">
                                                <el-option
                                                v-for="item in proTypeOptions"
                                                :key="item"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="端口">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.port" placeholder="请输入端口号">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="启用状态">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.status" width="100%" filterable placeholder="请选择启用状态">
                                                <el-option
                                                v-for="item in proStatusOptions"
                                                :key="item"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        fixed="right"
                                        label="操作"
                                        width="100">
                                        <template slot-scope="scope">
                                            <el-button @click="delPro(scope)" type="text" size="small">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>    
                                <el-button class="tagAdd" size="mini" icon="el-icon-plus" type="primary" @click="showProDialog(-1)" circle></el-button>
                            </el-card>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
        </el-card>

        <!-- 账号信息模态框 -->
        <el-dialog
            title="账号信息"
            :visible.sync="dialogAccVisible"
            width="600px"
            :before-close="handleCloseAcc">
            <el-form :model="formAcc" :rules="rulesAcc" ref="formAcc" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="name">
                    <el-input v-model="formAcc.name" placeholder="请输入设备账号">
                        <i slot="suffix" class="el-input__icon el-icon-user"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formAcc.password" show-password=true placeholder="请输入设备密码">
                        <i slot="suffix" class="el-input__icon el-icon-lock"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="formAcc.type" width="100%" filterable placeholder="请选择账号类型">
                        <el-option
                        v-for="item in accTypeOptions"
                        :key="item"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAccVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAccInfo()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 账号信息模态框 -->
        <el-dialog
            title="协议信息"
            :visible.sync="dialogProVisible"
            width="600px"
            :before-close="handleClosePro">
            <el-form :model="formPro" :rules="rulesPro" ref="formPro" label-width="100px" class="demo-ruleForm">
                <el-form-item label="端口号" prop="port">
                    <el-input v-model="formPro.port" placeholder="请输入端口号">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="formPro.type" width="100%" filterable placeholder="请选择协议类型">
                        <el-option
                        v-for="item in proTypeOptions"
                        :key="item"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="formPro.status" width="100%" filterable placeholder="请选择协议状态">
                        <el-option
                        v-for="item in proStatusOptions"
                        :key="item"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogProVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveProInfo()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        var checkAccount =  (rule, value, callback) => {
            var reg = /^[0-9A-Za-z\\@\\_\\.]{1,20}$/
            if(!reg.test(value)){
                return callback(new Error('账号格式不正确'))
            }
            callback();
        }
        var checkPort = (rule, value, callback) => {
            var reg = /^[0-9]{1,5}$/
            if(!reg.test(value) || value < 0 || value > 65535){
                return callback(new Error('请输入正确的端口号'))
            }
            callback();
        }
        var checkIp = (rule, value ,callback) => {
            var reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
            if(!reg.test(value)){
                return callback(new Error('请输入正确的IP地址'))
            }
            callback();
        }
        return {
            dialogAccVisible:false,
            dialogProVisible:false,
            form:{
                id:0,
                name:'',
                osName:'Linux',
                osVersion:'',
                status:1,
                ip:'',
                memo:'',
                accountList:[],
                protocolList:[],
            },formAcc:{
                id:0,
                index: -1,
                name:'',
                password:'',
                type:0,
            },formPro:{
                id:0,
                index: -1,
                type:0,
                port:'',
                status:1,
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
            ],accTypeOptions:[
                {
                    label:'管理员',
                    value:0,
                },{
                    label:'普通账号',
                    value:1,
                }
            ],proTypeOptions:[
                {
                    label:'SSH',
                    value:0,
                },{
                    label:'RDP',
                    value:1,
                },
            ],proStatusOptions:[
                {
                    label:'禁用',
                    value:0,
                },{
                    label:'启用',
                    value:1,
                },
            ],
            //校验资产
            rules:{
                name:[
                     {required: true,message:'请输入设备名称',trigger: 'change'},
                ],ip:[
                     {required: true,message:'请输入IP地址',trigger: 'change'},
                    {validator: checkIp,trigger: 'change'}
                ]
            },
            //账号校验
            rulesAcc:{
                name:[
                    {required: true,message:'请输入设备账号',trigger: 'change'},
                    {validator: checkAccount,trigger: 'change'}
                ]
            },//协议校验
            rulesPro:{
                port:[
                    {required: true,message:'请输入端口号',trigger: 'change'},
                    {validator: checkPort,trigger: 'change'}
                ]
            }
        }
    },mounted(){
        this.getAssetInfo();
    },methods:{
        getAssetInfo(){
            let vue = this;
            vue.$get('/asset/asset/queryById',{
                params:{
                    id: vue.$route.query.id
                }
            }).then(function(result){
                if(result){
                    vue.form.id = result.id;
                    vue.form.name = result.name;
                    vue.form.status = result.status;
                    vue.form.osName = result.osName;
                    vue.form.osVersion = result.osVersion;
                    vue.form.status = result.status;
                    vue.form.ip = result.ip;
                    vue.form.accountList = result.accountList;
                    vue.form.protocolList = result.protocolList;
                }
                vue.changeOsName();
            })
        },
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
        },delAcc(index){
            this.form.accountList.splice(index,1);
        },goBack(){
            this.$router.push({name:'assetList'})
        },handleCloseAcc(){
            this.dialogAccVisible = false;
        },handleClosePro(){
            this.dialogProVisible = false;
        },showAccDialog(name){
            if(this.$refs['formAcc']){
                this.$refs['formAcc'].resetFields();
            }
            let vue = this;
            vue.dialogAccVisible = true;
            vue.getAccInfo(name);
        },getAccInfo(name){
            let vue = this;
            if(name){
                let index = 0;
                for(var acc of vue.form.accountList){
                    if(acc.name == name){
                        vue.formAcc.id = acc.id;
                        vue.formAcc.name = acc.name;
                        vue.formAcc.password = acc.password;
                        vue.formAcc.type = acc.type;
                        vue.formAcc.index = index;
                        break;
                    }
                    
                    index++;
                }
            } else {
                vue.formAcc.id = 0;
                vue.formAcc.name = '';
                vue.formAcc.password = '';
                vue.formAcc.type = 0;
                vue.formAcc.index = -1;
            }
        },saveAccInfo(){
            let vue = this;
            vue.$refs['formAcc'].validate((valid) => {
                if(valid){
                    let index = 0;
                    for(var acc of vue.form.accountList){
                        if(vue.formAcc.index == index){
                            acc.id = vue.formAcc.id;
                            acc.name = vue.formAcc.name;
                            if(vue.formAcc.password != ''){
                                acc.password = vue.formAcc.password;
                            }
                            acc.type = vue.formAcc.type;
                            index = -1;
                            break;
                        }
                        index++;
                    }
                    if(index > -1){
                        vue.form.accountList.push({
                            id:0,
                            name:vue.formAcc.name,
                            password: vue.formAcc.password,
                            type: vue.formAcc.type
                        })
                    }
                    vue.handleCloseAcc();
                }
            });
            
        },delAllAcc(){
            this.form.accountList = [];
        },showProDialog(type){
            if(this.$refs['formPro']){
                this.$refs['formPro'].resetFields();
            }
            let vue = this;
            var index = 0;
            for(var p of vue.form.protocolList){
                if(type == p.type){
                    vue.formPro.id = p.id;
                    vue.formPro.index = index;
                    vue.formPro.type = p.type;
                    vue.formPro.port = p.port;
                    vue.formPro.status = p.status;
                    index = -1;
                    break;
                }
                index++;
            }
            if(index > -1){
                vue.formPro.id = 0;
                vue.formPro.index = index;
                vue.formPro.type = 0;
                vue.formPro.port = '';
                vue.formPro.status = 1;
            }
            vue.dialogProVisible = true;
        },saveProInfo(){
            let vue = this;
            vue.$refs['formPro'].validate((valid) => {
                if(valid){
                    var index = 0;
                    for(var p of vue.form.protocolList){
                        if(vue.formPro.type == p.type){
                            p.id = vue.formPro.id;
                            p.type = vue.formPro.type;
                            p.port = vue.formPro.port;
                            p.status = vue.formPro.status;
                            index = -1;
                            break;
                        }
                        index++;
                    }
                    if(index > -1){
                        vue.form.protocolList.push({
                            id:0,
                            type:vue.formPro.type,
                            port:vue.formPro.port,
                            status:vue.formPro.status
                        });
                    }
                    vue.dialogProVisible = false;
                }
            })
            
        },delPro(scope){
            let vue = this;
            vue.form.protocolList.splice(scope.$index,1);
        },subData(){
            let vue = this;
            vue.$refs['form'].validate((valid) => {
                if(valid){
                    var path = vue.form.id > 0 ? '/asset/asset/updateById' : '/asset/asset/insert';
                    vue.$post(path,{
                        data: vue.form
                    }).then(function(result){
                        console.log(result);
                        vue.$router.push({name:'assetList'})
                    }).catch(function(e){
                        console.log(e);
                    })
                }
            });
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