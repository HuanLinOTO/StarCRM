import { createApp } from 'vue'
import './style.css' 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import getRouter from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App)
.use(pinia)
.use(ElementPlus)
.use(getRouter(pinia))
.mount('#app')
