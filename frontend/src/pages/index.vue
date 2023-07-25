<template>
    只写重点 <br>

    <router-link to="/login" class="rlink">
        登录
    </router-link>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useLoginStore } from "../store";

const store = useLoginStore();
const router = useRouter()

if(store.isLogin) {
    router.push("/birdview")
}
</script>
