<template>
    <div>
        <el-menu
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <span class="title hand">Spring Cloud Security Oauth2 本地事务、分布式事务实践</span>
        </el-menu>
        
    </div>
</template>
<script>
export default {
    methods:{
        handleSelect(){

        }
    }
}
</script>
<style scoped>
.el-menu{
    height: 45px;
    padding-top: 15px;
}
.hand{
    cursor:pointer
}
.title{
    color: white;
    font-size: 1.5em;
    margin-left: 10px;
    font-family: 楷体;
    font-weight: bolder;
    outline: none;
}
</style>