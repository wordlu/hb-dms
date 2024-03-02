import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import User from '../views/User.vue'
import Role from '../views/Role.vue'
import layout from '../layout/Component.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/personnel',
      component: layout,
      // redirect: '/personnel/user',
      children:[
        {
          path: 'user',
          component: User
        },
        {
          path: 'role',
          component: Role
        }
      ]
    }
  ]
})

export default router