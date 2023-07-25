<template>
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
</template>

<script lang="tsx" setup>
import { h, ref, MaybeRef, toRaw } from "vue";
// import user from "../api/user";
import { useLoginStore } from "../store";
import { poolDB } from "./../../../backend/db/types.d";
import e2c from "../utils/e2c";
import { ElButton, ElMessage } from "element-plus";
import tableCol from "../utils/tableCol";
import pool from "../api/pool";
const store = useLoginStore();

// if (store.isLogin) user.getPrivate(store.token as string);
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
          onClick: async () => {
            const result = await pool.claim({ token: store.token as string, cid: cellData.id as number });
            if(result.code != 0) ElMessage.error(result.msg)
            else ElMessage.success(result.msg)
            getData()
          },
        },
        "认领"
      );
    },
  },
];

const data = ref<poolDB[] & any>([]);

const getData = async () => {
  data.value = await pool.getPublic();
  // console.log(toRaw(data.value),"raw");

  data.value = toRaw(data.value).map((item: MaybeRef<poolDB[] & any> & any) => {
    // if exception there replace `item` to `toRaw(item)` may be solve the problem
    item.allData = structuredClone(item);
    item.contactMethod = e2c.ContactMethod[item.contactMethod];
    item.learnFrom = e2c.LearnFrom[item.learnFrom];
    item.status = e2c.Status[item.status];
    console.log(item.allData, "raw");
    return item;
  });
};

getData();
console.log(columns, data);
</script>
<style lang="less" scoped>
.container {
  height: auto;
}
</style>
