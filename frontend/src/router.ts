import { Router, createRouter, createWebHashHistory } from "vue-router";

// import Accounts from "./pages/accounts.vue"
// import Default from './pages/default.vue'
import Index from "./pages/index.vue";
import Login from "./pages/login.vue";
import BirdView from "./pages/birdview.vue";
import Private from "./pages/private.vue";
import Public from "./pages/public.vue";
import User from "./pages/user.vue";
import Customer from "./pages/customer.vue";
import Settings from "./pages/settings.vue";
import { useLoginStore } from "./store";
import { Pinia } from "pinia";

interface Route {
  path: string;
  component: any;
}

const routes: Route[] = [
  // { path: '/accounts', component: Accounts },
  { path: "/", component: Index },
  { path: "/login", component: Login },
  { path: "/birdview", component: BirdView },
  { path: "/private", component: Private },
  { path: "/public", component: Public },
  { path: "/user", component: User },
  { path: "/customer", component: Customer },
  { path: "/settings", component: Settings },
];

let router: Router;

export default (pinia: Pinia) => {
  if (!router) {
    router = createRouter({
      history: createWebHashHistory(),
      routes, // `routes: routes` 的缩写
    });

    console.log("create router");

    const store = useLoginStore(pinia);
    
    console.log(store);

    router.beforeEach((to, _from, next) => {
      // console.log(store.isLogin,store.token,"islogin");
      
      if (!store.isLogin && to.path !== "/login") {
        // 这个 isLogin 我换成 computed 了 9 ()=>Boolean(token)
        console.log("go login");

        next({ path: "/login" })
      } else next()
    });
  }
  return router;
};
