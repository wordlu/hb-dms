<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/lists' }">{{ $t('algorithm["算法列表"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ details ? details.name : '' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <div class="title-panel">
        <div class="info">
          <div class="info-detail">
            <b>{{ details ? details.name : '' }}</b>
          </div>
          <div class="info-btn-group">
            <el-button type="primary" class="info-btn" @click="createVersion">{{ $t('algorithm["发布版本"]') }}</el-button>
            <!-- <el-button type="info" plain class="info-btn" @click="remove">删除</el-button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="detail">
      <el-descriptions :title="$t(`algorithm['详细信息']`)">
        <el-descriptions-item label="ID:">{{ details.id }}</el-descriptions-item>
        <el-descriptions-item :label="$t(`common['类型']`)">{{ details.cat }}</el-descriptions-item>
        <el-descriptions-item :label="$t(`algorithm['描述']`)">{{ details.description }}</el-descriptions-item>
        <el-descriptions-item :label="$t(`algorithm['创建时间']`)">{{ formatter(details.created, "yyyy-MM-dd hh:mm:ss") }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="summary">
      <el-tabs v-model="activeName" class="layer-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t(`algorithm['代码']`)" name="code">
          <div class="editor">
            <Editor language="python" 
              :content="codeContent"  
              :zipUrl="zipUrl"
              theme="dracula" :height="500" :title="$t(`algorithm['算法代码']`)"
              @onsave="onsave"></Editor>
          </div>
          <el-divider></el-divider>
          <div class="config-area">
            <div class="select-form">
              <b class="title">{{ $t(`algorithm['环境']`) }}</b>
              <el-form :inline="true" 
                ref="form1Ref" 
                :model="form1" label-width="80px">
                <el-form-item prop="env">
                  <el-select 
                    @change="selectEnvOptions"
                    v-model="form1.env" 
                    :placeholder="$t(`algorithm['环境']`)">
                    <el-option
                      v-for="item in envOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="envversion">
                  <el-select v-model="form1.envversion" :placeholder="$t(`algorithm['版本']`)">
                    <el-option
                      v-for="item in envversionOptions"
                      :key="item.id"
                      :label="item.version"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button 
                  :disabled="!form1.envversion"
                  @click="addEnvVersion"
                  type="primary" 
                  class="info-btn">{{ $t(`common['保存']`) }}</el-button>
                <!-- <el-button type="info" plain 
                  class="info-btn" 
                  :disabled="!envdata.id" 
                  @click="removeEnv"
                  :icon="Delete">删除</el-button> -->
              </el-form>
            </div>
            <div class="list-panel">
              <el-descriptions title="">
                <el-descriptions-item :label="$t(`algorithm['环境名称']`)">{{ envdata.name }}</el-descriptions-item>
                <el-descriptions-item :label="$t(`algorithm['环境版本']`)">{{ envdata.version }}</el-descriptions-item>
                <el-descriptions-item :label="$t(`algorithm['环境描述']`)">{{ envdata.description }}</el-descriptions-item>
                <el-descriptions-item :label="$t(`algorithm['处理程序']`)">{{ algorithmVersion0Data.handler }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <el-divider v-if="envdata && envdata.id"></el-divider>
          <div class="config-area" v-if="envdata && envdata.id">
            <div class="select-form">
              <b class="title">{{$t(`algorithm['依赖层']`)}}</b>
              <el-form :inline="true" 
                ref="form2Ref" 
                :model="form2" label-width="80px">
                <el-form-item prop="layer">
                  <el-select 
                    @change="selectLayerOptions"
                    v-model="form2.layer" 
                    :placeholder="$t(`algorithm['依赖层']`)">
                    <el-option
                      v-for="item in layerOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="layerversion">
                  <el-select v-model="form2.layerversion" :placeholder="$t(`algorithm['版本']`)">
                    <el-option
                      v-for="item in layerversionOptions"
                      :key="item.id"
                      :label="item.version"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button 
                  :disabled="!form2.layerversion"
                  @click="addLayerVersion"
                  type="primary" 
                  class="info-btn" 
                  :icon="Plus">{{$t(`algorithm['添加']`)}}</el-button>
                <el-button type="info" plain 
                  class="info-btn" 
                  :disabled="!currentRow.id" 
                  @click="remove"
                  :icon="Delete">{{$t(`common['删除']`)}}</el-button>
              </el-form>
            </div>
            <div class="list-panel">
              <el-table ref="multipleTableRef" 
                :data="layerdata" style="width: 100%">
                <!-- <el-table-column type="selection" width="55" /> -->
                <el-table-column label=""  width="65">
                  <template #default="scope">
                    <el-radio 
                      :label="scope.$index"
                      v-model="radio"
                      @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column property="name" :label="$t(`algorithm['依赖名称']`)">
                  <template #default="scope">
                    <el-button link @click="rowClicked(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column property="version" :label="$t(`algorithm['依赖版本']`)"/>
                <el-table-column property="description" :label="$t(`algorithm['依赖描述']`)" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t(`algorithm['参数']`)" name="params">
          <Params 
            :name="details ? details.name : ''"
            :arguments="algorithmVersion0Data.arguments"
            :algorithemversionId="algorithmVersion0Data.id"
            :algorithemId="$route.params.id" ></Params>
        </el-tab-pane>
        <el-tab-pane :label="$t(`algorithm['配置']`)" name="config">
          <Config 
            :name="details ? details.name : ''"
            :configData="algorithmVersion0Data.config"
            :algorithemversionId="algorithmVersion0Data.id"
            :algorithemId="$route.params.id" ></Config>
        </el-tab-pane>
        <el-tab-pane :label="$t(`algorithm['版本']`)" name="versions">
          <Versions 
            :name="details ? details.name : ''"
            :algorithem="$route.params.id"></Versions>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, Plus, Delete } from "@element-plus/icons-vue"
import { ref, reactive, onMounted } from "vue"
import Versions from './Versions.vue'
import Config from './Config.vue'
// import Alias from './Alias.vue'
import Params from './Params.vue'
import Editor from "@/components/Algorithm/Common/fileTreeEditor.vue"
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import gostore from '@/services/algorithm-store'
import { findItem, findAll, patchItem } from '@/api/jsonApi'
import { funcUploadCode, funcPathContent } from '@/api/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();

const form1 = reactive({
  env: '',
  envversion: ''
})
const form2 = reactive({
  layer: '',
  layerversion: ''
})


const form1Ref = ref()
const form2Ref = ref()
const envOptions = ref<any>([])
const envversionOptions = ref<any>([])
const layerOptions = ref<any>([])
const allLayerData = ref<any>([])
const layerversionOptions = ref<any>([])
const dialogVisible = ref<boolean>(false)
const activeName = ref<string>("code")
const details = ref<any>({})
const zipUrl = ref<string>('')
const codeContent = ref<string>('')
const algorithmVersion0Data = ref<any>({})
const radio = ref<string>('')
const envdata = ref<any>({})
const layerdata = ref([])
const currentRow = ref<any>({})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.paneName
  console.log(activeName.value)
}

const rowClicked = (row: Row) => {
  // window.history.pushState(null, '', `/algorithem/env/${row.id}`)
}

const formatter = (thistime: any, fmt: string) => {
  if (!thistime) return '--'
  // const isUTC = thistime.indexOf('Z') > -1 ? 'UTC' : ''
  const isUTC = ""
  let $this = new Date(thistime)
  let o = {
    'M+': $this[`get${isUTC}Month`]() + 1,
    'd+': $this[`get${isUTC}Date`](),
    'h+': $this[`get${isUTC}Hours`](),
    'm+': $this[`get${isUTC}Minutes`](),
    's+': $this[`get${isUTC}Seconds`](),
    'q+': Math.floor(($this[`get${isUTC}Month`]() + 3) / 3),
    'S': $this[`get${isUTC}Milliseconds`]()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ($this[`get${isUTC}FullYear`]() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
const getCurrentRow = (row) => {
  currentRow.value = row
}
const onsave = (res, node) => {
  const params = {
    "type": "edit",
    "content": res
  }
  if (!node.path) {
    ElMessage({
      message: t(`algorithm['请先选择需要修改的文件']`),
      type: 'error',
    })
    return false
  }
  funcUploadCode(params, `${node.path}`).then(res => {
    ElMessage({
      message: t(`common['保存成功']`),
      type: 'success',
    })
  })
}

const createVersion = () => {
  window.history.pushState(null, '', "/algorithem/detail/" + route.params.id + "/version/creation" + `?name=${details.value.name}`)
}

// 添加环境
const addEnvVersion = () => {
  const params = {
    data: {
      type: 'algorithmversions',
      id: algorithmVersion0Data.value.id,
      attributes: {
        "envversion": form1.envversion
      }
    }
  }
  patchItem('algorithmversions', params).then(res=>{
    ElMessage({
      message: t(`algorithm['更新环境成功']`),
      type: 'success',
    })
    refresh()
    getLayerOptions()
  }).catch((err) => {
    const {response:{data:{errors}}} = err
    let msg = t(`algorithm['更新环境失败']`)
    if(errors && errors[0]) {
      const errmsg = errors[0]['detail']
      msg =  t(`algorithm['${errmsg}']`)
    }
    ElMessage({
      message:  msg,
      type: 'error',
    })
  })
}

// 删除环境
const removeEnv = () => {
  ElMessageBox.confirm(
    t(`common['确认删除']`)+'？',
    t(`common['删除']`),
    {
      confirmButtonText: t(`common['确认']`),
      cancelButtonText: t(`common['取消']`),
      type: 'warning',
    }
  )
  .then(() => {
    const params = {
      data: {
        type: 'algorithmversions',
        id: algorithmVersion0Data.value.id,
        attributes: {
          "envversion": ''
        }
      }
    }
    patchItem('algorithmversions', params).then(res=>{
      ElMessage({
        message: t(`algorithm['删除环境成功']`),
        type: 'success',
      })
      refresh()
    }).catch((err) => {
      const {response:{data:{errors}}} = err
      let msg = t(`algorithm['删除环境失败']`)
      if(errors && errors[0]) {
        const errmsg = errors[0]['detail']
        msg =  t(`algorithm['${errmsg}']`)
      }
      ElMessage({
        message:  msg,
        type: 'error',
      })
    })
  })
  .catch(() => {
  })
}

// 添加依赖层
const addLayerVersion = () => {
  const ids = layerdata.value.map(it => it.id)
  const params = {
    data: {
      type: 'algorithmversions',
      id: algorithmVersion0Data.value.id,
      attributes: {
        "layerversions": Array.from(new Set(ids.concat([form2.layerversion])))
      }
    }
  }
  patchItem('algorithmversions', params).then(res=>{
    ElMessage({
      message: t(`algorithm['添加依赖层成功']`),
      type: 'success',
    })
    // getDetail()
    refresh()
  }).catch((err) => {
    const {response:{data:{errors}}} = err
    let msg =  t(`algorithm['添加依赖层失败']`)
    if(errors && errors[0]) {
      const errmsg = errors[0]['detail']
      msg =  t(`algorithm['${errmsg}']`)
    }
    ElMessage({
      message:  msg,
      type: 'error',
    })
  })
}

// 删除依赖层
const remove = () => {
  ElMessageBox.confirm(
    t(`common['确认删除']`)+'？',
    t(`common['删除']`),
    {
      confirmButtonText: t(`common['确认']`),
      cancelButtonText: t(`common['取消']`),
      type: 'warning',
    }
  )
  .then(() => {
    const ids = layerdata.value.filter((it:any) => it.id !== currentRow.value.id).map((item:any) => item.id)
    const params = {
      data: {
        type: 'algorithmversions',
        id: algorithmVersion0Data.value.id,
        attributes: {
          "layerversions": ids
        }
      }
    }
    patchItem('algorithmversions', params).then(res=>{
      ElMessage({
        message: t(`algorithm['删除依赖层成功']`),
        type: 'success',
      })
      // getDetail()
      refresh()
    }).catch((err) => {
      const {response:{data:{errors}}} = err
      let msg = t(`algorithm['删除依赖层失败']`)
      if(errors && errors[0]) {
        const errmsg = errors[0]['detail']
        msg =  t(`algorithm['${errmsg}']`)
      }
      ElMessage({
        message:  msg,
        type: 'error',
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
}

const refresh = () => {
  radio.value = ''
  currentRow.value = {}
  form1Ref.value && form1Ref.value.resetFields()
  form2Ref.value && form2Ref.value.resetFields()
  getEnvList()
}

const selectEnvOptions = (id:string) => {
  form1Ref.value.resetFields('envversion')
  const data = envOptions.value.find(it => it.id === id)
  envversionOptions.value = data.versions.filter(it => it.version > 0)
}

const selectLayerOptions = (id:string) => {
  form2Ref.value.resetFields('layerversion')
  const data = layerOptions.value.find(it => it.id === id)
  layerversionOptions.value = data.versions.filter(it => it.version > 0)
}

// 查询详情
const getDetail = async () => {
  const detailsData = await findItem('algorithms', route.params.id, {})
  const data = gostore.sync(detailsData.data)
  details.value = data
  // 获取环境下拉
  getAllEnvList()
  // 获取依赖层下拉
  getAllLayerList()
  // 获取version=0版本数据
  getVersion0Data()
}

const getAllEnvList = () => {
  findAll('environments', {include: 'versions'}).then((res: any) => {
    gostore.reset()
    gostore.sync(res.data)
    envOptions.value = gostore.findAll('environments')
  }).catch((err: any) => {
    console.log(err, 'err')
  })
}

const getLayerOptions = () => {
  const envid = envdata.value.id
  layerOptions.value = allLayerData.value.filter(it => {
    const arr = it.versions.filter(it => {
      return it.envversions.filter(it => it.id === envid).length > 0
    })
    return arr.length > 0
  })
}

const getAllLayerList = () => {
  findAll('layers', {include: 'versions'}).then((res: any) => {
    gostore.reset()
    gostore.sync(res.data)
    allLayerData.value = gostore.findAll('layers')
  }).catch((err: any) => {
    console.log(err, 'err')
  })
}

const getVersion0Data = async () => {
  const params = {
    'filter[version]': 0,
    algorithm: route.params.id,
  }
  findAll('algorithmversions', params).then(res => {
    const layerversion = gostore.sync(res.data)
    algorithmVersion0Data.value = layerversion[0]
    zipUrl.value = algorithmVersion0Data.value.url
    // 获取0版本的环境
    getEnvList()
  })
}

const getEnvList = async () => {
  const detailsData = await findItem('algorithmversions', algorithmVersion0Data.value.id, {include: ['envversion,layerversions']})
  const data = gostore.sync(detailsData.data)
  envdata.value = data.envversion ? data.envversion : {}
  layerdata.value = data.layerversions
  if (envdata.value && envdata.value.id) getLayerOptions()
  
}

onMounted(() => {
  getDetail()
})

</script>

<style lang="scss" scoped>
.user-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-button--primary {
  background: #FF7900;
  border: none;
}

.ver-mid {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.container {
  display: flex;
  flex-direction: column;
  margin: 0 30px;

  .bread-font {
    font-weight: 700;
  }

  .panel {
    margin-top: 15px;
    flex-grow: 1;
    // border: 1px solid transparent;
  }

  .title-panel {
    // background-color: white;
    display: flex;
    flex-direction: row;

    .info {
      padding: 10px;
      width: 100%;
      display: flex;
      flex-direction: row;

      .info-detail {
        display: flex;
        flex-direction: column;

        b {
          display: flex;
        }

        p {
          font-weight: 400;
          margin-top: 2px;
        }
      }

      .info-btn-group {
        flex-grow: 1;
        width: 100px;
        display: flex;
        flex-direction: row-reverse;

        .info-btn {
          margin: 5px;
        }
      }
    }
  }

  .summary {
    margin-top: 15px;
    padding: 15px;
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;

    .config-area {
      margin-top: 40px;
      .select-form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40px;
        .el-form-item {
          margin-bottom: 0;
        }
      }

      .title {
        font-size: 16px;
        color: #2c3e50;
      }
    }
  }

  .detail {
    margin-top: 15px;
    background: #F9F9FB;
    // padding: 14px;
    border-radius: 12px;

    :deep(.el-descriptions) {
      border: 1px solid #E1E3EB;
    }

    :deep(.el-descriptions__body) {
      background: #F9F9FB;
    }

    :deep(.el-descriptions__header) {
      padding: 14px 14px 0;
    }

    :deep(.el-descriptions__body) {
      background: #fff;
      padding: 14px;
    }

    .detail-panel {
      .detail-message {
        display: flex;
        flex-direction: column;
        background-color: lightgray;
      }
    }
  }
}
</style>