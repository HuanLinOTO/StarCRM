<template>
    <el-button @click="addCustomer">添加客户</el-button>
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
    <editCustomer
      :dialogVisible="editor.dialogVisible"
      :defaultData="(editor.defaultData as poolDB)"
      :isCreate="editor.isCreate"
      :showAdmin="store.user.role === 'admin'"
      @callback="editor.callback"
    ></editCustomer>
  </template>
  
  <script lang="tsx" setup>
  import { h, ref, MaybeRef, toRaw } from "vue";
  // import user from "../api/user";
  import { useLoginStore } from "../store";
  import { poolDB } from "./../../../backend/db/types.d";
  import e2c from "../utils/e2c";
  import { ElButton, ElMessage } from "element-plus";
  import editCustomer, { CallbackParams } from "../components/editCustomer.vue";
  import tableCol from "../utils/tableCol";
  import pool from "../api/pool";
  const store = useLoginStore();
  
  // if (store.isLogin) user.getPrivate(store.token as string);
  
  var editor = ref({
    dialogVisible: false,
    defaultData: {},
    isCreate: false,
    async callback(params: CallbackParams) { 
      editor.value.dialogVisible = false;
      console.log(params.data,params.isCancel,params.isCreate);
      if(params.isCancel) return;
      if(params.isCreate) {
        // TODO: create customer
        const result = await pool.addCustomer(params.data) as any;
        if(result.code === 0) ElMessage.success(result.msg);
        else ElMessage.error(result.msg)
      } else {
        const result = await pool.editCustomer(params.data) as any;
        if(result.code === 0) ElMessage.success(result.msg);
        else ElMessage.error(result.msg)
      }
      getData()
    }
  });
  
  const addCustomer = () => {
    editor.value.defaultData = { owner: store.user.id };
    editor.value.isCreate = true
    editor.value.dialogVisible = true
  }
  
  const columns = [
    ...tableCol.customer,
    {
      key: "allData",
      dataKey: "allData",
      title: "操作",
      width: 240,
      cellRenderer: ({ cellData }: Record<string, poolDB>) => {
        // console.log(JSON.stringify(cellData),"cellData");
        
        return h(
          ElButton, 
          {
            size: "small",
            onClick: () => {
              // console.log(cellData.contactMethod,"celldata onclick");
              editor.value.dialogVisible = true;
              editor.value.defaultData = cellData;
            },
          },
          "编辑"
        )
      }
    },
  ];
  
  const data = ref<poolDB[] & any>([]);
  
  const getData = async () => {
    data.value = await pool.getAll();
    // console.log(toRaw(data.value),"raw");
    
    data.value = toRaw(data.value).map((item: MaybeRef<poolDB[] & any> & any) => {
      // if exception there replace `item` to `toRaw(item)` may be solve the problem
      item.allData = structuredClone(item);
      item.contactMethod = e2c.ContactMethod[item.contactMethod];
      item.learnFrom = e2c.LearnFrom[item.learnFrom];
      item.status = e2c.Status[item.status];
      console.log(item.allData,"raw")
      return item;
      
    });
    console.log(data.value, store.token);
  };
  
  getData();
  console.log(columns, data);
  </script>
  <style lang="less" scoped>
  .container {
    height: auto;
  }
  </style>