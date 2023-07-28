<template>
    <el-button @click="addCustomer">添加客户</el-button>
    <el-collapse accordion style="margin: 10px">
      <el-collapse-item title="筛选" name="1">
        <!-- <el-text>筛选</el-text> -->
        <!-- <el-select v-model="value" placeholder="请选择"> -->
        <el-select placeholder="客户状态" v-model="filter.status">
          <el-option
            v-for="(value, key) in e2c.Status"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
        <br />
        <el-autocomplete
          v-model="filter.name"
          :fetch-suggestions="getComName"
          clearable
          style="margin-top: 10px"
          placeholder="公司名称"
        />
        <br />
        <el-autocomplete
          v-model="filter.production"
          :fetch-suggestions="getByProduction"
          clearable
          style="margin-top: 10px"
          placeholder="意向产品"
        />
        <br />
        <el-button
          type="danger"
          size="small"
          style="margin-top: 10px"
          @click="() => ((filter.status = undefined), (filter.name = undefined), filter.production = undefined)"
          >清空筛选条件</el-button
        >
      </el-collapse-item>
    </el-collapse>
    <div class="container">
      <el-auto-resizer>
        <template #default="{ width }">
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="c_data.length"
            :page-size=100
            v-model:current-page="currentPage"
            class="mt-4"
          />
          <el-table-v2
            cache="10"
            :columns="columns"
            :data="current_data"
            :width="width"
            :height="600"
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
  import { h, ref, MaybeRef, toRaw, reactive, computed } from "vue";
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

  
  const currentPage = ref(1)

  const current_data = computed(() => {
    return c_data.value.slice((currentPage.value - 1) * 100, currentPage.value * 100)
  })

  
  const addCustomer = () => {
    editor.value.defaultData = { owner: store.user.id, contact: [] };
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
  
  const c_data = computed(() => {
    var tmp = data.value;
    // console.log(tmp);

    if (filter.name) {
      tmp = tmp.filter((item: any) => item.name.includes(filter.name));
    }
    if (filter.status) {
      tmp = tmp.filter((item: any) => item.allData.status == filter.status);
    }
    if (filter.production) {
      tmp = tmp.filter((item: any) => item.allData.production == filter.production);
    }
    console.log(tmp);

    return tmp;
  });

  const filter = reactive({
    status: undefined,
    name: undefined,
    production: undefined,
  });

  const getComName = (query: string, cb: any) => {
  const result = data.value
    .map((item: any) => ref(item.name))
    .filter((item: any) => item.value.includes(query));
  console.log(result);

  cb(result);
};

const getByProduction = (query: string, cb: any) => {
  // function unique (arr) {
  //   return Array.from(new Set(arr))
  // }
  // console.log(Array.from(new Set(data.value)));

  const result = Array.from(
    new Set(data.value.map((item: any) => item.production))
  )
    .filter((item: any) => item.includes(query))
    .map((item: any) => ref(item))
  // console.log(Array.from(new Set(result)));

  cb(result);
};


  const getData = async () => {
    data.value = await pool.getAll();
    // console.log(toRaw(data.value),"raw");
    
    data.value = toRaw(data.value).map((item: MaybeRef<poolDB[] & any> & any) => {
      // if exception there replace `item` to `toRaw(item)` may be solve the problem
      item.allData = structuredClone(item);
      // item.contactMethod = e2c.ContactMethod[item.contactMethod];
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