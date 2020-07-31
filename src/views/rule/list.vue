<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>授权列表</span>
            </div>
            <el-row>
                <el-col :span="6">
                    <el-input class="searchText"
                        placeholder="请输入内容并按下回车键搜索"
                        suffix-icon="el-icon-search"
                        v-model="input1" @keydown.native.enter="query(input1,page.startIndex,page.pageSize)">
                    </el-input>
                </el-col>
                <el-col :span="18">
                    <el-button size="mini" icon="el-icon-plus" class="tableBtn" circle type="primary" @click="showEdit()"></el-button>
                </el-col>
            </el-row>
            <div class="br-line"></div>
             <el-row>
                <el-col :span="24">
                     <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="assetName"
                        label="设备名称">
                        </el-table-column>
                        <el-table-column
                        prop="assetIp"
                        label="IP地址">
                        </el-table-column>
                        <el-table-column
                        prop="osName"
                        label="设备类型">
                        </el-table-column>
                        <el-table-column
                        prop="osVersion"
                        label="操作系统">
                        </el-table-column>
						<el-table-column
                        prop="account"
                        label="设备账号">
                        </el-table-column>
                        <el-table-column
                        label="协议">
                            <template slot-scope="scope">
                                <span v-if="scope.row.protocol == 0">SSH</span>
                                <span v-if="scope.row.protocol == 1">SFTP</span>
                                <span v-if="scope.row.protocol == 2">RDP</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="授权用户">
                            <template slot-scope="scope">
                                {{ scope.row.fullName + '(' + scope.row.username + ')' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button @click="delRule(scope.row.id)" type="text" size="small">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <div class="br-line"></div>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-sizes="[20, 50,100]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.totalCount">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
        <!-- 授权弹窗 -->
        <el-dialog
            title="添加授权"
            :visible.sync="dialogAssetVisible"
            width="1200px"
            :before-close="handleAssetClose">
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-transfer
                        @change="changeAsset"
                        filterable
                        filter-placeholder="请输入内容搜索"
                        :titles="['待选择设备', '已选择设备']"
                        v-model="assetValue"
                        :data="assetData">
                    </el-transfer>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-transfer
                        @change="changeUser"
                        filterable
                        filter-placeholder="请输入内容搜索"
                        :titles="['待选择用户', '已选择用户']"
                        v-model="userValue"
                        :data="userData">
                    </el-transfer>
                </el-col>
            </el-row>
            <div class="br-line"></div>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-table
                        :data="ruleData"
                        style="width: 100%"
                        border>
                        <el-table-column
                        prop="assetName"
                        label="设备名称">
                        </el-table-column>
                        <el-table-column
                        prop="osName"
                        label="设备类型">
                        </el-table-column>
                        <el-table-column
                        prop="osVersion"
                        label="操作系统">
                        </el-table-column>
                        <el-table-column
                        prop="account"
                        label="授权账号">
                        </el-table-column>
                        <el-table-column
                        label="授权协议">
                            <template slot-scope="scope">
                                <span v-if="scope.row.protocol == 0">SSH</span>
                                <span v-if="scope.row.protocol == 1">SFTP</span>
                                <span v-if="scope.row.protocol == 2">RDP</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                        label="操作"
                        width="100px">
                            <template slot-scope="scope">
                                <el-button @click="removeRule(scope.$index)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAssetVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRule">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            dialogAssetVisible:false,
            tableData:[],
            page: {
                currentPage: 1,
                pageCount: 1,
                pageSize: 20,
                startIndex: 0,
                totalCount: 1,
            },
            input1:'',
            assetData:[],
            assetValue:[],
            userData:[],
            userValue:[],
            ruleData:[],
            assetList:[],
            userList:[],
            selectUserList:[],
        }
    },mounted(){
        this.query(this.input1,this.page.startIndex,this.page.pageSize);
    },methods:{
        query(keyword,offset,limit) {
            let vue = this;
            vue.$get('/rule/rule/query',{
                params:{
                    queryParam:keyword,
                    offset:offset,
                    limit:limit,
                }
            }).then(function(result){
                vue.tableData = result.list;
                let page = result.page;
                vue.page.currentPage = page.currentPage;
                vue.page.pageCount = page.pageCount;
                vue.page.pageSize = page.pageSize;
                vue.page.startIndex = page.startIndex;
                vue.page.totalCount = page.totalCount;
            }).catch(function(e){
                console.log(e);
            })
        },
        //分页处理
        handleSizeChange(val){
            this.page.pageSize = val;
            this.page.startIndex = 0;
            this.query(this.input1,this.page.startIndex,this.page.pageSize);
        },handleCurrentChange(val){
            var offset = val * this.page.pageSize - this.page.pageSize;
            this.page.startIndex = offset;
            this.query(this.input1,this.page.startIndex,this.page.pageSize);
        },delRule(val){
            let vue = this;
            vue.$post('/rule/rule/deleteById',{
                params:{
                    id:val
                }
            }).then(function(result){
                vue.query(vue.input1,0,vue.page.pageSize);
                console.log(result);
            }).catch(function(e){
                console.log(e)
            })
        },showEdit(){
            let vue = this;
            vue.dialogAssetVisible = true;
            vue.initAssetData('/asset/asset/query');
            vue.initUserData('/user/user/query');
        },getAllAsset(){
            let vue = this;
            vue.$get('/asset/asset/query',{
                params:{
                    offset:0,
                    limit:1
                }
            })
        },countData(path,callback){
            let vue = this;
            vue.$get(path,{
                params:{
                    offset:0,
                    limit:1
                }
            }).then(function(result){
               callback(result.page.totalCount);
            }).catch(function(e){
                console.log(e);
                callback(0);
            })
        },getAllData(path,limit,callback){
            let vue = this;
            vue.$get(path,{
                params:{
                    offset:0,
                    limit:limit
                }
            }).then(function(result){
               callback(result.list);
            }).catch(function(e){
                console.log(e);
                callback([]);
            })
        },initAssetData(path){
            let vue = this;
            vue.assetData = [];
            vue.countData(path,function(totalCount){
                vue.getAllData(path,totalCount,function(data){
                    vue.assetList = data;
                    for(var obj of data){
                        vue.assetData.push({
                            key:obj.id,
                            label:obj.name + '-' + obj.osName + '-' + obj.ip
                        })
                    }
                });
            })
        },handleAssetClose(){
            let vue = this;
            vue.dialogAssetVisible = false;
        },initUserData(path){
            let vue = this;
            vue.userData = [];
            vue.countData(path,function(totalCount){
                vue.getAllData(path,totalCount,function(data){
                    vue.userList = data;
                    for(var obj of data){
                        vue.userData.push({
                            key:obj.id,
                            label:obj.name + '(' + obj.username + ')'
                        })
                    }
                });
            })
        },changeAsset(val,offset,keyArr){
            let vue = this;
            console.log(val);
            console.log(offset);
            console.log(keyArr);
            if(offset == 'right'){
                for(var k of keyArr){
                    for(var obj of vue.assetList){
                        if(k == obj.id){
                            for(var acc of obj.accountList){
                                for(var p of obj.protocolList){
                                    vue.ruleData.push({
                                        id:0,
                                        assetId:obj.id,
                                        assetName:obj.name,
                                        assetIp:obj.ip,
                                        osName:obj.osName,
                                        osVersion:obj.osVersion,
                                        account:acc.name,
                                        protocol:p.type
                                    })
                                }
                            }
                        }
                    }
                }
            } else {
                while(keyArr.length > 0){
                    var key = keyArr.pop();
                    let flag = false;
                    do {
                        flag = vue.removeSelectRule(key);
                    } while(flag);
                }
            }
        },removeSelectRule(key){
            let vue = this;
            var index = 0;
            for(var r of vue.ruleData){
                if(key == r.assetId){
                    vue.ruleData.splice(index,1);
                    return true;
                }
                index++;
            }
            return false;
        },saveRule(){
            let vue = this;
            var subData = [];
            for(var r of vue.ruleData){
                for(var u of vue.selectUserList){
                    var user = vue.getUserObj(u);
                    subData.push({
                        id:r.id,
                        assetId:r.assetId,
                        assetName:r.assetName,
                        assetIp:r.assetIp,
                        osName:r.osName,
                        osVersion:r.osVersion,
                        account:r.account,
                        protocol:r.protocol,
                        username: user.username,
                        fullName: user.name
                    })
                }
            }
            console.log(subData);
            if(subData.length > 0) {
                vue.$post('/rule/rule/insert',{
                    data:subData
                }).then(function(result){
                    console.log(result);
                    vue.assetData = []
                    vue.assetValue = []
                    vue.userData = []
                    vue.userValue = []
                    vue.ruleData = []
                    vue.assetList = []
                    vue.userList = []
                    vue.selectUserList = []
                    vue.dialogAssetVisible = false;
                    vue.query(vue.input1,vue.page.startIndex,vue.page.pageSize);
                }).catch(function(e){
                    console.log(e);
                })
            }
            
        },changeUser(val,offset,keyArr){
            let vue = this;
            console.log(val);
            console.log(offset);
            console.log(keyArr);
            vue.selectUserList = val;
        },getUserObj(id){
            let vue = this;
            for(var u of vue.userList){
                if(id == u.id){
                    return u;
                }
            }
            return null;
        },removeRule(index){
            this.ruleData.splice(index,1);
        }
    }
}
</script>
<style scoped>
.br-line{
    display: block;
    height: 15px;
}
.tableBtn{
    float: right;
}

</style>
<style>
.el-transfer-panel{
    width: 480px;
}
</style>
