<template>
  <el-dialog
    v-model="(props.dialogVisible as boolean)"
    :title="props.isCreate ? '创建用户' : '编辑用户'"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form :model="form">
      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="form.token" disabled></el-input>
      </el-form-item>
      <el-form-item label="每日至少入库数">
        <el-input-number v-model="form.dailyCreation" :min="1" :max="666" />
      </el-form-item>
      <el-form-item label="身份">
        <!-- <el-input v-model="form.token" disabled></el-input> -->
        <el-select v-model="form.role">
          <el-option value="admin">
            <span style="float: left">管理员</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              Admin
            </span>
          </el-option>
          <el-option value="user">
            <span style="float: left">员工</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              User
            </span>
          </el-option>
          <el-option value="bot">
            <span style="float: left">机器人</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >
              Bot
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
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
      <el-text type="danger">请注意如果没有修改一定要点取消！！</el-text>
      <span class="dialog-footer">
        <el-button @click="callback({ isCancel: true, data: form })"
          >取消</el-button
        >
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
import { computed } from "vue";
import { userDB } from "../../../backend/db/types";
import tableCol from "../utils/tableCol";

const props = defineProps<{
  dialogVisible: Boolean;
  defaultData: userDB;
  isCreate: Boolean;
}>();

var form = computed<userDB>(() => {
  return props.defaultData as userDB;
});

export type CallbackParams = {
  isCancel: boolean;
  isCreate?: boolean;
  data: userDB;
};

const emit = defineEmits<{
  (e: "callback", params: CallbackParams): void;
}>();

const callback = (params: CallbackParams) => {
  // emit("callback", params);
  emit("callback", { ...params, isCreate: props.isCreate as boolean });
};

const columns = [...tableCol.user];
</script>
