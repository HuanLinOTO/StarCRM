<template>
  <el-button @click="addUser">新建用户</el-button>
  <div class="container">
    <el-auto-resizer>
      <template #default="{ width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="800"
          fixed
        />
      </template>
    </el-auto-resizer>
  </div>
  <editUser
    :dialogVisible="editor.dialogVisible"
    :defaultData="(editor.defaultData as userDB)"
    :isCreate="editor.isCreate"
    @callback="editor.callback"
  ></editUser>
</template>

<script lang="tsx" setup>
import { h, ref } from "vue";
// import user from "../api/user";
import { poolDB, userDB } from "./../../../backend/db/types.d";
import { ElButton, ElMessage } from "element-plus";
import tableCol from "../utils/tableCol";
import user from "../api/user";
import editUser from "../components/editUser.vue";

import { CallbackParams } from "../components/editUser.vue";
// if (store.isLogin) user.getPrivate(store.token as string);

var editor = ref({
  dialogVisible: false,
  defaultData: {},
  isCreate: false,
  async callback(params: CallbackParams) { 
    editor.value.dialogVisible = false;
    // console.log(params.data,params.isCancel,params.isCreate);
    if(params.isCancel) return;
    console.log(params.data);
  
    if(params.isCreate) {
      // TODO: create customer
      const result = await user.addUser(params.data.name,params.data.password,params.data.role) as any;
      if(result.code === 0) ElMessage.success(result.msg);
      else ElMessage.error(result.msg)
    } else {
      const result = await user.editUser(params.data) as any;
      if(result.code === 0) ElMessage.success(result.msg);
      else ElMessage.error(result.msg)
    }
    getData()
  }
});

const addUser = () => {
  editor.value.defaultData = {dailyCreation: 50};
  editor.value.isCreate = true
  editor.value.dialogVisible = true
}

const columns = [
  ...tableCol.user,
  {
    key: "allData",
    dataKey: "allData",
    title: "操作",
    width: 240,
    cellRenderer: ({ cellData }: Record<string, userDB>) => {
      // console.log(JSON.stringify(cellData),"cellData");

      return h(
        ElButton,
        {
          size: "small",
          onClick: async () => {
            console.log(666);
            editor.value.defaultData = cellData
            editor.value.dialogVisible = true
            //   const result = await pool.claim({ token: store.token as string, cid: cellData.id as number });
            //   if(result.code != 0) ElMessage.error(result.msg)
            //   else ElMessage.success(result.msg)
            //   getData()
          },
        },
        "编辑"
      );
    },
  },
];

const data = ref<poolDB[] & any>([]);

const getData = async () => {
  // @ts-ignore
  data.value = (await user.getUser("all")).users.map(
    (item: userDB & { allData: userDB }) => {
      item.allData = structuredClone(item);
      // item.password = "******";
      // item.token = item.token.substring(0, 4) + "******";
      return item;
    }
  );
};

getData();
console.log(columns, data);
</script>
<style lang="less" scoped>
.container {
  height: auto;
}
</style>
