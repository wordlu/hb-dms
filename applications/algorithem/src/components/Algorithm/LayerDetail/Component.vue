<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/layers' }">{{ $t('algorithm["依赖层"]') }}</el-breadcrumb-item>
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
      </el-descriptions>
      
    </div>
    <div class="summary">
      <el-tabs v-model="activeName" class="layer-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t(`algorithm['代码']`)" name="code">
          <div class="editor">
            <Editor language="python" 
              :content="codeContent"  
              :zipUrl="zipUrl"
              theme="dracula" :height="500" :title="$t(`algorithm['依赖层代码']`)"
              @onsave="onsave"></Editor>
          </div>
          <el-divider></el-divider>
          <div class="config-area">
            <div class="select-form">
              <b class="title">{{ $t('algorithm["兼容的环境"]') }}</b>
              <el-form :inline="true" 
                ref="form" 
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
                  class="info-btn" 
                  :icon="Plus">{{ $t('common["添加"]') }}</el-button>
                <el-button type="info" plain 
                  class="info-btn" 
                  :disabled="!currentRow.id" 
                  @click="remove"
                  :icon="Delete">{{ $t('common["删除"]') }}</el-button>
              </el-form>
            </div>
            <div class="list-panel">
              <el-table ref="multipleTableRef" 
                :data="envdata" style="width: 100%">
                <!-- <el-table-column type="selection" width="55" /> -->
                <el-table-column label=""  width="65">
                  <template #default="scope">
                    <el-radio 
                      :label="scope.$index"
                      v-model="radio"
                      @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column property="name" :label="$t(`algorithm['环境名称']`)">
                  <template #default="scope">
                    <el-button link @click="rowClicked(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column property="version" :label="$t(`algorithm['环境版本']`)"/>
                <el-table-column property="description" :label="$t(`algorithm['描述']`)" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t(`algorithm['版本']`)" name="versions">
          <Versions 
            :layerId="$route.params.id"
            :name="details ? details.name : ''"></Versions>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, Plus, Delete } from "@element-plus/icons-vue"
import { ref, reactive, onMounted } from "vue"
import Versions from './Versions.vue'
// import Alias from './Alias.vue'
// import Editor from "./fileTreeEditor.vue"
import Editor from "@/components/Algorithm/Common/fileTreeEditor.vue"
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import jsCookie from 'js-cookie'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import gostore from '@/services/algorithm-store'
import { findItem, findAll, patchItem } from '@/api/jsonApi'
import { funcUploadCode, funcPathContent } from '@/api/api'

const route = useRoute();
const { t } = useI18n()
interface Row {
  env: '',
  envversion: '',
}

const form1 = reactive<Row>({
  env: '',
  envversion: '',
})
const form = ref()
const envOptions = ref<any>([])
const envversionOptions = ref<any>([])
const dialogVisible = ref<boolean>(false)
const activeName = ref<string>("code")
const details = ref<any>({})
const zipUrl = ref<string>('')
const codeContent = ref<string>('')
const layerversion0Data = ref({})
const radio = ref<string>('')
const envdata = ref([])
const currentRow = ref<any>({})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.paneName
}

const rowClicked = (row: Row) => {
  // window.history.pushState(null, '', `/algorithem/env/${row.id}`)
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
      message: t(`common["保存成功"]`),
      type: 'success',
    })
  })
}

const createVersion = () => {
  window.history.pushState(null, '', "/algorithem/layer/" + route.params.id + "/version/creation" + `?name=${details.value.name}`)
}

const addEnvVersion = () => {
  const ids = envdata.value.map(it => it.id)
  const params = {
    data: {
      type: 'layerversions',
      id: layerversion0Data.value.id,
      attributes: {
        "envversions": Array.from(new Set(ids.concat([form1.envversion])))
      }
    }
  }
  patchItem('layerversions', params).then(res=>{
    ElMessage({
      message: t(`algorithm['添加环境成功']`),
      type: 'success',
    })
    // getDetail()
    refresh()
  }).catch((err) => {
    const {response:{data:{errors}}} = err
    let msg = t(`algorithm["添加环境失败"]`)
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
    const ids = envdata.value.filter(it => it.id !== currentRow.value.id).map(item => item.id)
    const params = {
      data: {
        type: 'layerversions',
        id: layerversion0Data.value.id,
        attributes: {
          "envversions": ids
        }
      }
    }
    patchItem('layerversions', params).then(res=>{
      ElMessage({
        message: t(`algorithm['删除环境成功']`),
        type: 'success',
      })
      // getDetail()
      refresh()
    }).catch((err) => {
      const {response:{data:{errors}}} = err
      let msg = t(`algorithm["删除环境失败"]`)
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

const refresh = () => {
  radio.value = ''
  currentRow.value = {}
  form.value.resetFields()
  getEnvList()
}

const selectEnvOptions = (id:string) => {
  form.value.resetFields('envversion')
  const data = envOptions.value.find(it => it.id === id)
  envversionOptions.value = data.versions.filter(it => it.version > 0)
}

const getDetail = async () => {
  const detailsData = await findItem('layers', route.params.id, {include: 'versions'})
  const data = gostore.sync(detailsData.data)
  details.value = data
  zipUrl.value = data.versions.find(it => it.version === 0).url
  // getEditorCode()
  // versionArray.value = data.versions ? data.versions : []
  getAllEnvList()
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

const getVersion0Data = async () => {
  const params = {
    'filter[version]': 0,
    layer: route.params.id,
  }
  findAll('layerversions', params).then(res => {
    const layerversion = gostore.sync(res.data)
    layerversion0Data.value = layerversion[0]
    getEnvList()
  })
}

const getEnvList = async () => {
  const detailsData = await findItem('layerversions', layerversion0Data.value.id, {include: 'envversions'})
  const data = gostore.sync(detailsData.data)
  envdata.value = data.envversions
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
      .select-form {
        display: flex;
        align-items: center;
        justify-content: space-between;

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

    // .detail-title {
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: space-around;
    //   height: 50px;
    //   background-color: gray;

    //   .detail-title-row {
    //     display: flex;
    //     flex-direction: row;

    //     .left {
    //       display: flex;
    //       flex-direction: row;
    //       flex-grow: 0;

    //       b {
    //         padding: 15px;
    //         font-size: 14px;
    //       }
    //     }

    //     .right {
    //       display: flex;
    //       flex-direction: row-reverse;
    //       flex-grow: 1;
    //       margin: 15px 30px;
    //     }
    //   }

    // }

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