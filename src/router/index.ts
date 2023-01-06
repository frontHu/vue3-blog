import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/index.vue'),
    children: [{
      path: '',
      component: () => import(/* webpackChunkName: "index" */ '../views/article-index.vue')
    }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
