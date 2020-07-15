<template>
    <div>
        <el-row>
            <el-col :span="24"><app-header></app-header></el-col>
        </el-row>
        <el-row>
        <el-col :span="4">
            <app-left></app-left>
        </el-col>
        <el-col :span="20">
            <div class="mainPage">
            <router-view></router-view>
            </div>
        </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },mounted(){
        
    },methods:{
        
    }
}
</script>
<style>
.mainPage{
  padding: 10px 10px;
}
</style>