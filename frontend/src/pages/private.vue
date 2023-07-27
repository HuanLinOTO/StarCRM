<template>
  <el-alert title="warning alert" type="warning" show-icon v-if="c_notice.length > 0" style="margin-bottom: 10px;">
    有 {{ c_notice.length }} 个客户即将进入公库，请及时处理
    <br>
    <el-button size="small" style="margin: 3px" type="primary" @click="filter.notice = !filter.notice,ElMessage.info('已在下方表格显示，再次点击回到正常视图')">点击查看</el-button>
  </el-alert>
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
  <!-- <div style="margin: 10px">
  </div> -->
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
          :columns="columns"
          :data="current_data"
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
    console.log(params.data, params.isCancel, params.isCreate);
    if (params.isCancel) return;
    if (params.isCreate) {
      const result = (await pool.addCustomer(params.data)) as any;
      if (result.code === 0) ElMessage.success(result.msg);
      else ElMessage.error(result.msg);
    } else {
      const result = (await pool.editCustomer(params.data)) as any;
      if (result.code === 0) ElMessage.success(result.msg);
      else ElMessage.error(result.msg);
    }
    getData();
  },
});

const addCustomer = () => {
  editor.value.defaultData = {
    owner: store.user.id,
    contact: [
      {
        contactMethod: "",
        contactContent: "",
      },
    ],
  };
  editor.value.isCreate = true;
  editor.value.dialogVisible = true;
};

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
            editor.value.isCreate = false;
            editor.value.defaultData = cellData;
            console.log(cellData);
          },
        },
        "编辑"
      );
    },
  },
];

const data = ref<poolDB[] & any>([]);

const c_notice = ref<number[]>([])

const currentPage = ref(1)

const current_data = computed(() => {
  return c_data.value.slice((currentPage.value - 1) * 100, currentPage.value * 100)
})

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
  if (filter.notice) {
    tmp = tmp.filter((item: any) => c_notice.value.includes(item.id));
  }
  console.log(tmp);

  return tmp;
});

const getData = async () => {
  data.value = await pool.getPrivate(store.token as string);
  // console.log(toRaw(data.value),"raw");

  data.value = toRaw(data.value).map((item: MaybeRef<poolDB[] & any> & any) => {
    // if exception there replace `item` to `toRaw(item)` may be solve the problem
    item.allData = structuredClone(item);
    item.contactMethod = e2c.ContactMethod[item.contactMethod];
    item.learnFrom = e2c.LearnFrom[item.learnFrom];
    item.status = e2c.Status[item.status];
    return item;
  });
  const today = new Date();
  const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
  const notice = data.value.filter((item: poolDB) => {
    const lastOperateTime = new Date(item.lastOperateTime);
    return (
      lastOperateTime < sixtyDaysAgo
    );
  });
  console.log(notice,"notice");
  for (const com of notice) {
    c_notice.value.push(com.id)
  }
  c_notice.value = c_notice.value.filter(item => item)
  console.log(c_notice,"notice");

  // console.log(data.value, store.token);

  
  
};

const filter = reactive({
  status: undefined,
  name: undefined,
  production: undefined,
  notice: false,
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

getData();
console.log(columns, data);
</script>
<style lang="less" scoped>
.container {
  height: auto;
}
</style>
