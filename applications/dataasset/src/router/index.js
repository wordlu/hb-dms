import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../layout'
import dataSetList from '../views/dataSet/list'
import overview from '../views/dataSet/overview.vue'
import visualization from '../views/dataSet/visualization.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/dataasset',
    component: layout,
    children:[
      {
        path: 'search',
        name: 'search',
        component: dataSetList
      },
      {
        path: 'overview',
        name: 'overview',
        component: overview
      },
      {
        path: 'visualization/:dataset/:app_name/:prefix',
        name: 'visualization',
        component: visualization
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
