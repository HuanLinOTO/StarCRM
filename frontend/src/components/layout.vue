<script setup lang="ts">
// import isLogin from "../utils/isLogin"
import { useLoginStore } from '../store'

const store = useLoginStore()

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-layout"><slot name="header">Header</slot></el-header>
      <el-container>
        <el-aside width="200px" v-if="store.isLogin" class="aside-layout"><slot name="aside"></slot></el-aside>
        <el-container>
          <el-main class="main-layout"><slot></slot></el-main>
          <!-- <el-footer class="footer-layout"><slot name="footer">小磊机器人</slot></el-footer> -->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout {
  height: 100vh;
  width: 100vw;
  .header-layout {
    padding: 0;
    .el-page-header__header {
      height: 60px;
    }
    // background-color: cadetblue;
  }
  .main-layout {
    width: 100%;
    height: 100%;
    // background-color: red;
  }
  .footer-layout {
    height: 40px;
    // background-color: rgb(211, 211, 211);
    border-top: 0.5px solid;
  }
  .aside-layout {
    // z-index: 99;
    // background-color: green;
  }
  section {
    height: 100%;
  }
}
</style>
