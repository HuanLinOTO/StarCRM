<template>

<el-form :model="form" label-width="120px">
    <!-- <el-label>a1</el-label> -->
    <el-form-item label="每日入库">
        <el-input-number v-model="form.dailyCreation" :min="1" />
    </el-form-item>
</el-form>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue';
import settings from '../api/settings';
import debounce from '../utils/debounce';
import { ElMessage } from 'element-plus';

var isInited = false;

var form = reactive({
    dailyCreation: 1
})


const getSettings = async () => {
  const cloudSettings = await settings.getSettings()
  for (const key in cloudSettings) {
    // @ts-ignore
    form[key] = cloudSettings[key]
  }
  console.log("读取到云端配置",form);

  setTimeout(() => {
    isInited = true;
  }, 20);  
}

getSettings()

const saveSuccessAlert = debounce(() => {
  ElMessage.success('保存成功') 
}, 1000)

for (let key in form) {
    // @ts-ignore
    watch(() => form[key], async () => {
        // @ts-ignore
        console.log(`配置 ${key} 变动为 ${form[key]}`,isInited  )
        
        if(!isInited) return;
        // @ts-ignore
        await settings.setSettings({ key, value: form[key] })
        saveSuccessAlert()
    })
}

</script>