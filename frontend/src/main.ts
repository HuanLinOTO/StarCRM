import { createApp } from 'vue'
import './style.css' 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import getRouter from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App)
.use(pinia)
.use(ElementPlus, {
    locale: zhCn
})
.use(getRouter(pinia))
.mount('#app')
