<template>
  <el-dialog
    v-model="(props.dialogVisible as boolean)"
    :title="props.isCreate?'创建客户':'编辑客户'"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form :model="form">
      <el-form-item label="公司全称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="跟进内容">
        <el-input v-model="form.contactContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
      </el-form-item>
      <el-button @click="addContactNum" size="small">增加联系方式</el-button>
      <el-button @click="reduceContactNum" size="small">删除联系方式</el-button>
      <template v-for="i in contactNum">
        <el-form-item label="联系工具">
          <!-- @vue-ignore -->
          <el-select
            v-model="form.contact[i-1].contactMethod"
            class="m-2"
            placeholder="Select"
          >
            <el-option
              v-for="(key, item) in e2c.ContactMethod"
              :label="key"
              :value="item"
            >
              <span style="float: left">{{ key }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
              >
                {{ item }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式">
          <!-- @vue-ignore -->
          <el-input v-model="form.contact[i-1].contactContent"></el-input>
        </el-form-item>
      </template>
      <!-- <el-form-item label="沟通内容">
        <el-input type="textarea" v-model="form.Content"></el-input>
      </el-form-item> -->
      <el-form-item label="客户状态">
        <el-select v-model="form.status" class="m-2" placeholder="Select">
          <el-option
            v-for="(key, item) in e2c.Status"
            :label="key"
            :value="item"
          >
            <span style="float: left">{{ key }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              {{ item }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户来源">
        <el-select v-model="form.learnFrom" class="m-2" placeholder="Select">
          <el-option
            v-for="(key, item) in e2c.LearnFrom"
            :label="key"
            :value="item"
          >
            <span style="float: left">{{ key }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              {{ item }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form-item label="分配员工" v-if="props.showAdmin">
      <!-- <el-input v-model="form.owner" placeholder="-1 即下发到公池"></el-input> -->
      <el-select v-model="form.owner" class="m-2" placeholder="Select">
          <!-- @vue-ignore -->
          <el-option
            v-for="(item, index) in userList"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              {{ item.value }}
            </span>
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="意向产品">
      <el-autocomplete
        v-model="form.production"
        :fetch-suggestions="(query: string, cb: any) => {
          const result = ['HR','社保']
            .map((item: any) => ref(item))
            .filter((item: any) => item.value.includes(query));
          // console.log(result);
          cb(result);
        }"
        clearable
        class="inline-input w-50"
        placeholder="可输入其他的"
      />
    </el-form-item>
    <h3>预览(发生变更后此处为元数据)</h3>
    <el-auto-resizer>
      <template #default="{ width }">
        <el-table-v2
          :columns="columns"
          :data="[form]"
          :width="width"
          :height="100"
          fixed
        />
      </template>
    </el-auto-resizer>
    <!-- <el-button type="primary" @click="">Close</el-button></el-button> -->
    <template #footer>
      <span class="dialog-footer">
        <!-- @vue-ignore -->
        <el-button @click="callback({ isCancel: true, data: form })"
          >取消</el-button
        >
        <!-- @vue-ignore -->
        <el-button
          type="primary"
          @click="callback({ isCancel: false, data: form })"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { poolDB } from "../../../backend/db/types";
import e2c from "../utils/e2c";
import tableCol from "../utils/tableCol";
import user from "../api/user";

const props = defineProps<{
  dialogVisible: Boolean;
  defaultData: poolDB;
  showAdmin: Boolean
  isCreate: Boolean
}>();

// @ts-ignore
interface FormData extends poolDB {
  contact: []
}

var form = computed<FormData>(() => {
  // @ts-ignore
  return props.defaultData as FormData;
});


export type CallbackParams = {
  isCancel: boolean;
  isCreate?: boolean;
  data: poolDB;
};

const emit = defineEmits<{
  (e: "callback", params: CallbackParams): void;
}>();

const callback = (params: CallbackParams) => {
  console.log(params.data.contact);
  
  emit("callback", {...params, isCreate: props.isCreate as boolean});
};

const columns = [...tableCol.customer];

const contactNum = ref(0)

watch(() => props.defaultData,(val) => {
  contactNum.value = val.contact.length
  console.log("Change contactNum to",contactNum.value);
  
})

const userList = ref([{label: "wait", value: "wait"}])

const getUsers = async () => {
  // 返回 id: name
  // @ts-ignore
  userList.value = [...(await user.getUser("all")).users.map(item => {
  // @ts-ignore
    return {
  // @ts-ignore
      label: item.name,
  // @ts-ignore
      value: item.id
  // @ts-ignore
    }    
  // @ts-ignore
  }),{
  // @ts-ignore
    label: "公池",
  // @ts-ignore
    value: -1
  }]
  console.log(userList.value);
  
}

getUsers()

const addContactNum = () => {
  contactNum.value ++
  // @ts-ignore 
  form.value.contact[contactNum.value-1] = {
    contactMethod: '',
    contactContent: ''
  }
}
const reduceContactNum = () => {
  contactNum.value --
  // @ts-ignore
  form.value.contact.pop()
}

</script>
