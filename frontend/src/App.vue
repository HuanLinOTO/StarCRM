<script setup lang="ts">
import { useRouter } from "vue-router";
import user from "./api/user";
import Layout from "./components/layout.vue";
import { useLoginStore } from "./store";
import { ElMessage } from "element-plus";
const store = useLoginStore();

const logout = () => {
  // localStorage = new Map()
  localStorage.clear();
  window.location.reload();
};
const router = useRouter();

const checkLogin = async () => {
  // @ts-ignore
  const wuser = await user.getUser(store.token);
  console.log(wuser);

  if (!wuser.found) {
    router.push("/login");
    store.unsetUser();
    ElMessage.error("请重新登录");
  }
};

checkLogin();
</script>

<template>
  <Layout>
    <template #default>
      <div class="main-container">
        <router-view>
        </router-view>
        <!-- <div v-show="show" class="transition-box">.el-zoom-in-top</div> -->
      </div>
    </template>
    <template #header>
      <!-- <div class="header">
        <span class="header-title"> 润才 RCM </span>
      </div> -->
      <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
        <el-menu-item>润才 RCM</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item @click="logout">
          <!-- <el-button>aaa</el-button> -->
          退出登录
        </el-menu-item>
      </el-menu>
    </template>
    <template #aside>
      <el-menu default-active="1" class="el-menu-vertical">
        <router-link to="/birdview" class="rlink">
          <el-menu-item index="1">
            <template #title>
              <span class="rlink">数据总览</span>
            </template>
          </el-menu-item>
        </router-link>
        <router-link to="/private" class="rlink">
          <el-menu-item index="2">
            <span class="rlink">客户私库</span>
          </el-menu-item>
        </router-link>
        <router-link to="/public" class="rlink">
          <el-menu-item index="3">
            <span class="rlink">客户公库</span>
          </el-menu-item>
        </router-link>
        <template v-if="store.user.role == 'admin'">
          <el-divider content-position="left" style="margin: 0; z-index: 10"
            ><div style="font-size: 8px; color: grey; background: none">
              管理员
            </div></el-divider
          >
          <router-link to="/user" class="rlink">
            <el-menu-item index="4">
              <span class="rlink">用户管理</span>
            </el-menu-item>
          </router-link>
          <router-link to="/customer" class="rlink">
            <el-menu-item index="5">
              <span class="rlink">客户管理</span>
            </el-menu-item>
          </router-link>
          <router-link to="/settings" class="rlink">
            <el-menu-item index="5">
              <span class="rlink">设置</span>
            </el-menu-item>
          </router-link>

        </template>
      </el-menu>
    </template>
  </Layout>
</template>

<style scoped lang="less">
.header {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  // box-shadow: 10px 5px 5px black;
  box-shadow: 0px -2px 5px #000000d1;
  position: relative;
  z-index: 99999;
  .header-title {
    font-size: 24px;
    padding-left: 20px;
    font-weight: bold;
  }
}

.flex-grow {
  flex-grow: 1;
}

.rlink {
  color: black;
  text-decoration: none;
}

.el-menu-vertical {
  height: 100%;
}
</style>
