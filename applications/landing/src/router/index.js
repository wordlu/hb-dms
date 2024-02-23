import { createRouter, createWebHistory } from 'vue-router'
import layout from '../layout'
import landing from '../views/project/landing'
import projects from '../views/project/projects'
import spaces from '../views/project/spaces'
import wovespaces from '../views/project/wovespaces'
import dataprojects from '../views/project/dataprojects'
const routerHistory = createWebHistory()

const routes = [
  {
    path: '/landing',
    component: layout,
    children:[
      {
        path: 'landing',
        name: 'landing',
        component: landing
      },
      {
        path: 'projects',
        name: 'projects',
        component: projects
      },
      {
        path: 'spaces',
        name: 'spaces',
        component: spaces
      },
      {
        path: 'wovespaces',
        name: 'wovespaces',
        component: wovespaces
      },
      {
        path: 'dataprojects',
        name: 'dataprojects',
        component: dataprojects
      }
      // {
      //   path: 'projectInfo/:id',
      //   name: 'projectInfo',
      //   component: projectInfo
      // },
      // {
      //   path: 'projectFlow/:id',
      //   name: 'projectFlow',
      //   component: projectFlow
      // },
      // {
      //   path: 'projectFlowHistory/:id',
      //   name: 'projectFlowHistory',
      //   component: projectFlowHistory
      // }
    ]
  },
]

const router = new createRouter({
  history: routerHistory,
  routes
})

export default router;
