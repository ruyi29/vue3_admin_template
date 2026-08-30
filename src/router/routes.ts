//对外暴露配置路由（常量路由）
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login', //命名路由
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
  },
  {
    // 如果上面都没匹配上
    path: '/:pathMatch(.*)*', //匹配所有路由
    redirect: '/404', //重定向到404页面
    name: 'Any',
  },
]
