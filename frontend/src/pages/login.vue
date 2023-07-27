<template>
  <div class="center-container">
    <el-form :model="form" label-width="70px" class="form">
      <el-form-item label="平台 ID">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="form.captcha" />
        <div @click="getCaptcha" v-html="captchaIMG">
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import user from "../api/user";
import { ElMessage } from "element-plus";
import { useLoginStore } from '../store'
import { useRouter } from "vue-router";
// import isLogin from "../utils/isLogin";

const store = useLoginStore()
const router = useRouter()
// do not use same name with ref
// const formRef = ref<FormInstance>({
//   name: "",
//   password: "",
// });

const captchaIMG = ref<string>("")
const captchaToken = ref<string>("")
const getCaptcha = async () => {
  const data = await user.getCaptcha()
  captchaIMG.value = data.img
  captchaToken.value = data.token
}
getCaptcha()

// do not use same name with ref
const form = ref({
  name: "",
  password: "",
  captcha: "",
});

const onSubmit = async () => {
  const result = await user.login(form.value.name, form.value.password, form.value.captcha, captchaToken.value);
  const { code, msg, token } = result;
  if (code !== 0) {
    console.log(msg);
    
    ElMessage.error(msg);

    return false
  }
  
  ElMessage.success(msg);

  console.log(result);
  

  store.token = token as string
  store.setUser(result.user as any)
  
  router.push("/birdview")
};
</script>

<style scoped lang="less">
.form {
  width: 50%;
}
</style>
