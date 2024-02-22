import { createRouter, createWebHistory } from 'vue-router'
import AlgorithemsPanel from '../components/Algorithm/AlgorithemsPanel/Component.vue'
import AlgorithemsList from '../components/Algorithm/AlgorithemsList/Component.vue'
import AlgorithemCreation from '../components/Algorithm/AlgorithemCreation/Component.vue'
import AlgorithemDetail from '../components/Algorithm/AlgorithemDetail/Component.vue'
import AlgorithemVersionDetail from '../components/Algorithm/AlgorithemVersionDetail/Component.vue'
import AlgorithemVersionCreation from '../components/Algorithm/AlgorithemVersionCreation/Component.vue'
import AlgorithemAliasDetail from '../components/Algorithm/AlgorithemAliasDetail/Component.vue'
import AlgorithemParamsCreation from '../components/Algorithm/AlgorithemParamsCreation/Component.vue'
import AlgorithemenvVariableDetail from '../components/Algorithm/AlgorithemVariableCreation/Component.vue'
import AlgorithemConfigDetail from '../components/Algorithm/AlgorithemConfigCreation/Component.vue'
import AlgorithemsLayers from '../components/Algorithm/LayersList/Component.vue'
import LayerDetail from '../components/Algorithm/LayerDetail/Component.vue'
import LayerCreation from '../components/Algorithm/LayerCreation/Component.vue'
import LayerVersionDetail from '../components/Algorithm/LayerVersionDetail/Component.vue'
import LayerVersionCreation from '../components/Algorithm/LayerVersionCreation/Component.vue'
import LayerAliasCreation from '../components/Algorithm/LayerAliasCreation/Component.vue'
import LayerAliasDetail from '../components/Algorithm/LayerAliasDetail/Component.vue'
import EnvList from '../components/Algorithm/Envs/Component.vue'
import EnvCreation from '../components/Algorithm/EnvsCreation/Component.vue'
import EnvDetail from '../components/Algorithm/EnvsDetail/Component.vue'
import EnvVersionCreation from '../components/Algorithm/EnvVersionCreation/Component.vue'
import EnvVersionDetail from '../components/Algorithm/EnvVersionDetail/Component.vue'
import layout from '../layout/Component.vue'

const router = createRouter({
    history:createWebHistory(),
    routes:[
      {
        path: '/algorithem',
        component: layout,
        children:[
          {
              path: 'algorithempanel',
              component:AlgorithemsPanel
          },
          {
              path: 'lists',
              component:AlgorithemsList
          },
          {
              path: 'detail/:id',
              component:AlgorithemDetail
          },
          {
              path: 'creation',
              component:AlgorithemCreation
          },
          {
              path: 'detail/:algorithemId/version/:versionId',
              component:AlgorithemVersionDetail
          },
          {
              path: 'detail/:algorithemId/version/creation',
              component:AlgorithemVersionCreation
          },
          {
              path: 'detail/:algorithemId/config/creation',
              component:AlgorithemConfigDetail
          },
          {
            path: 'detail/:algorithemId/envVariable/creation',
            component:AlgorithemenvVariableDetail
        },
          {
              path: 'detail/:algorithemId/params/creation',
              component:AlgorithemParamsCreation
          },
          {
              path: 'layers',
              component:AlgorithemsLayers
          },
          {
              path: 'layer/creation',
              component:LayerCreation
          },
          {
              path: 'layer/:id',
              component:LayerDetail
          },
          {
              path: 'layer/:layerId/version/:versionId',
              component:LayerVersionDetail
          },
          // {
          //     path: 'layer/:layerId/alias/:aliasId',
          //     component:LayerAliasDetail
          // },
          {
              path: 'layer/:layerId/version/creation',
              component:LayerVersionCreation
          },
          // {
          //     path: 'layer/:layerId/alias/creation',
          //     component:LayerAliasCreation
          // },
          {
              path: 'envs',
              component:EnvList
          },
          {
            path: 'env/creation',
            component: EnvCreation
          }, 
          {
            path: 'env/:id',
            component: EnvDetail
          },
          {
            path: 'env/:envId/version/creation',
            component: EnvVersionCreation
          },
          {
            path: 'env/:envId/version/:versionId',
            component: EnvVersionDetail
          }
        ]
      }
        
    ]
})
export default router