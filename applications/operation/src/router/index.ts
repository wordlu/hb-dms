import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Regions from '../views/Regions.vue'
import Lines from '../views/Lines.vue'
import Dispatchs from '../views/dispatchs.vue'
import Tasks from '../views/tasks.vue'
import layout from '../layout/Component.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/operation',
      component: layout,
      children:[
        {
          path: 'regions',
          component: Regions
        },
        {
          path: 'lines',
          component: Lines
        },
				{
          path: 'dispatchs',
          component: Dispatchs
        },
				{
          path: 'tasks',
          component: Tasks
        },
      ]
    }
  ]
})

export default router
