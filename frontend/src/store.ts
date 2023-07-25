import { defineStore } from 'pinia'

import { ref, computed } from 'vue'
import { userDB } from '../../backend/db/types'

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
    
    // @ts-ignore
    const user = ref<userDB>(structuredClone(defaultUserState))

    function setUser(
        newUserer: userDB) {
        // @ts-ignore
        user.value = newUserer
    }

    function unsetUser() {
        // @ts-ignore

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
