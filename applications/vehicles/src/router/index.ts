import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import layout from '../layout/Component.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/vehicles',
      component: layout,
      children:[
        {
          path: 'home',
          component: HomeView
        },
        {
          path: 'about',
          component: About
        }
      ]
    }
  ]
})

export default router
