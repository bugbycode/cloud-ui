<template>
    <div>
      <el-card class="box-card" :body-style="{ padding: '0px' }">
        <el-menu
            default-active="0"
            class="el-menu-vertical-demo"
            active-text-color="#545c64"
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="0"  @click="toRouter('userList')">
                <i class="el-icon-user"></i>
                <span slot="title">用户信息</span>
            </el-menu-item>
        </el-menu>
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            active-text-color="#545c64"
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="1"  @click="toRouter('assetList')">
                <i class="el-icon-s-platform"></i>
                <span slot="title">设备信息</span>
            </el-menu-item>
        </el-menu>
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            active-text-color="#545c64"
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="2"  @click="toRouter('ruleList')">
                <i class="el-icon-lock"></i>
                <span slot="title">运维授权</span>
            </el-menu-item>
        </el-menu>
      </el-card>
    </div>
</template>
<script>
  export default {
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },toRouter(path){
          this.$router.push({name:path})
      }
    }
  }
</script>