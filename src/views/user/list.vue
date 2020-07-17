<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户列表</span>
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
                    <el-button size="mini" icon="el-icon-plus" class="tableBtn" circle type="primary" @click="showEdit(0)"></el-button>
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
                        prop="name"
                        label="姓名">
                        </el-table-column>
                        <el-table-column
                        prop="username"
                        label="登录账号">
                        </el-table-column>
                        <el-table-column
                        prop="role.name"
                        label="所属角色">
                        </el-table-column>
                        <el-table-column
                        prop="email"
                        label="邮箱">
                        </el-table-column>
                        <el-table-column
                        prop="mobile"
                        label="手机号码">
                        </el-table-column>
                        <el-table-column
                        prop="createTime"
                        label="创建时间">
                        </el-table-column>
                        <el-table-column 
                        prop="updateTime"
                        label="更新时间">
                        </el-table-column>
                        <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                        <template slot-scope="scope">
                            <el-button @click="showEdit(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button @click="delUser(scope.row.id)" type="text" size="small">删除</el-button>
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
    </div>
</template>
<script>
export default {
    data(){
        return {
            tableData:[],
            page: {
                currentPage: 1,
                pageCount: 1,
                pageSize: 20,
                startIndex: 0,
                totalCount: 1,
            },
            input1:'',
        }
    },mounted(){
        this.query(this.input1,this.page.startIndex,this.page.pageSize);
    },methods:{
        query(keyword,offset,limit) {
            let vue = this;
            vue.$get('/user/user/query',{
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
        },delUser(val){
            let vue = this;
            vue.$post('/user/user/deleteById',{
                params:{
                    id:val
                }
            }).then(function(result){
                vue.query(vue.input1,0,vue.page.pageSize);
                console.log(result);
            }).catch(function(e){
                console.log(e)
            })
        },showEdit(id){
            this.$router.push({name: 'editUser',query:{
                id:id
            }})
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