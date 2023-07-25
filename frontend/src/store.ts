import { defineStore } from 'pinia'

import { ref, computed } from 'vue'
import { userDB } from '../../backend/db/types'
import settings from './api/settings'

const defaultUserState = {
    id: 0,
    name: "",
    password: "",
    token: "",
    role: "user"
} as const

export const useLoginStore = defineStore('login', () => {
    const token = ref<string>() // 这边之前都是 var

    const isLogin = computed(()=>Boolean(token.value))
    // console.log(token.value,isLogin.value);
    
    const user = ref<userDB>(structuredClone(defaultUserState))

    function setUser(newUserer: userDB) {
        user.value = newUserer
    }

    function unsetUser() {
        user.value = structuredClone(defaultUserState)
        token.value = ""
    }

    return { isLogin, token, user, setUser, unsetUser }
}, {
    persist: {
        enabled: true,
        strategies: [{
            key: "login",
            storage: localStorage
        }]
    }   
})
