import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../App.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "index" */ '../views/index.vue')
      },
      {
        path: 'article/:id',
        name: 'article',
        component: () => import(/* webpackChunkName: "index" */ '../views/articleDetail/index.vue')
      },
      {
        path: 'backend',
        component: () => import(/* webpackChunkName: "index" */ '../backend/index.vue'),
        children: [
          {
            path: '',
            component: () => import(/* webpackChunkName: "index" */ '../backend/write.vue')
          }
        ]
      },
      {
        path: 'web',
        component: () => import(/* webpackChunkName: "index" */ '../views/web/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
