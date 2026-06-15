import { createRouter, createWebHistory } from "vue-router";
import MarketplacePage from "./views/MarketplacePage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: MarketplacePage, props: { view: "home" } },
    { path: "/entrar", name: "login", component: MarketplacePage, props: { view: "login" } },
    { path: "/cadastro", name: "register", component: MarketplacePage, props: { view: "register" } },
    { path: "/painel", name: "dashboard", component: MarketplacePage, props: { view: "dashboard" } },
    { path: "/conta", name: "account", component: MarketplacePage, props: { view: "account" } },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

