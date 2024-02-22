<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{$t(`algorithm['算法库']`)}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/lists' }">{{$t(`algorithm['算法列表']`)}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/detail/' + $route.params.algorithemId }">{{ $route.query.name
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ details ? details.version : '' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <div class="title-panel">
        <div class="info">
          <div class="info-detail">
            <b>{{ details ? details.version : '' }}</b>
          </div>
          <div class="info-btn-group">
            <el-button type="primary" class="info-btn" @click="createAlias">{{$t(`algorithm['创建别名']`)}}</el-button>
            <el-button type="primary" class="info-btn" @click="publish">{{$t(`algorithm['发布算法']`)}}</el-button>
            <!-- <el-button type="info" plain class="info-btn" @click="remove">删除</el-button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="detail">
      <el-descriptions :title="$t(`algorithm['详细信息']`)">
        <el-descriptions-item label="ID:">{{ details.id }}</el-descriptions-item>
        <el-descriptions-item :label="$t(`algorithm['版本号']`)">{{ details.version }}</el-descriptions-item>
        <el-descriptions-item :label="$t(`algorithm['描述']`)">{{ details.description }}</el-descriptions-item>
        <el-descriptions-item :label="$t(`algorithm['别名']`)">
          <el-tag  
            style="margin-right: 10px" 
            @close="handleCloseTag(item)"
            v-for="item in alias" closable  :key="item">{{ item }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="summary">
      <el-tabs v-model="activeName" class="layer-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t(`algorithm['代码']`)" name="code">
          <div class="editor">
            <Editor language="python" 
              :hideButton="true"
              :content="codeContent"  
              :zipUrl="zipUrl"
              theme="dracula" :height="500" :title="$t(`algorithm['算法代码']`)"></Editor>
          </div>
          <el-divider></el-divider>
          <div class="config-area">
            <div class="select-form">
              <b class="title">{{ $t(`algorithm['环境']`) }}</b>
            </div>
            <div class="list-panel">
              <el-descriptions title="">
                <el-descriptions-item :label="$t(`algorithm['环境名称']`)">{{ envdata.name }}</el-descriptions-item>
                <el-descriptions-item :label="$t(`algorithm['环境版本']`)">{{ envdata.version }}</el-descriptions-item>
                <el-descriptions-item :label="$t(`algorithm['环境描述']`)">{{ envdata.description }}</el-descriptions-item>
                <el-descriptions-item :label="$t(`algorithm['处理程序']`)">{{ details.handler }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <el-divider v-if="envdata.id"></el-divider>
          <div class="config-area" v-if="envdata.id">
            <div class="select-form">
              <b class="title">{{ $t(`algorithm['依赖层']`) }}</b>
            </div>
            <div class="list-panel">
              <el-table ref="multipleTableRef" 
                :data="layerdata" style="width: 100%">
                <el-table-column property="name" :label="$t(`algorithm['依赖名称']`)">
                  <template #default="scope">
                    <el-button link>{{ scope.row.name }}</el-button>
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
            :arguments="details.arguments"
            :algorithemversionId="details.id"
            :algorithemId="$route.params.id" ></Params>
        </el-tab-pane>
        <el-tab-pane :label="$t(`algorithm['配置']`)" name="config">
          <Config 
            :name="details ? details.name : ''"
            :configData="details.config"
            :algorithemversionId="details.id"
            :algorithemId="$route.params.id" ></Config>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal = "false"
      :title="$t(`algorithm['发布算法']`)"
      class="publish_algo"
      width="30%"
      :before-close="handleClose"
    >
        <el-form
          ref="form1Ref" 
          :rules="rules"
          :model="form1" label-width="120px">
          <el-form-item :label="$t(`algorithm['请选择空间']`)" prop="space">
            <el-select
              v-model="form1.space" 
              :placeholder="$t(`algorithm['请选择空间']`)">
              <el-option
                v-for="item in spacesList"
                :key="item.id"
                :label="item.alias"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t(`algorithm['算法展示名称']`)" prop="name">
            <el-input v-model="form1.resourcetitle" />
          </el-form-item>
        </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">{{ $t(`common['取消']`) }}</el-button>
          <el-button type="primary" @click="publishAlgoSubmit(form1Ref)">
            {{ $t(`common['确认']`) }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, Plus, Delete } from "@element-plus/icons-vue"
import { ref, reactive, onMounted, h } from "vue"
import Versions from './Versions.vue'
// import Alias from './Alias.vue'
import Config from './Config.vue'
import Params from './Params.vue'
import Editor from "@/components/Algorithm/Common/fileTreeEditor.vue"
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import gostore from '@/services/algorithm-store'
import { findItem, findAllSpace, patchItem } from '@/api/jsonApi'
import {funcReleaseToSpace } from '@/api/api'
import type { FormRules} from "element-plus"

interface Row {
  space: String,
  resourcetitle?: String
}
const route = useRoute();
const { t } = useI18n()

const form1 = reactive({
  space: '',
  resourcetitle: ''
})
const alias = ref<any>([])

const rules = reactive<FormRules<Row>>({
    space: [
        { required: true, message: t(`algorithm['请选择空间']`), trigger: 'blur' },
    ],
})
const form1Ref = ref()
const spacesList = ref<any>([])
const dialogVisible = ref<boolean>(false)
const activeName = ref<string>("code")
const details = ref<any>({})
const zipUrl = ref<string>('')
const codeContent = ref<string>('')
const envdata = ref<any>({})
const layerdata = ref([])

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.paneName
}

const handleClose = () => {
  form1Ref && form1Ref.value.resetFields()
  dialogVisible.value = false
}

const publishAlgoSubmit = (formEl) => {
  if (!formEl) return
  formEl.validate((valid: any, fields: any) => {
    if (valid) {
      const params = {
        "resourcetype": "algorithm",
        "resourceid": route.params.versionId,
        "spaceid": form1.space,
        "resourcetitle": form1.resourcetitle
      }
      funcReleaseToSpace(params).then(res => {
        ElMessage({
          message: t(`algorithm['发布算法成功']`),
          type: 'success',
        })
        handleClose()
      }).catch(err => {
        const {response:{data:{errors}}} = err
        let msg = t(`algorithm['发布算法失败']`)
        if(errors && errors[0]) {
          const errmsg = errors[0]['detail']
          msg =  t(`algorithm['${errmsg}']`)
        }
        ElMessage({
          message: msg,
          type: 'error',
        })
      })

    } else {
        console.log('error submit!', fields)
    }
  })
}

// 发布算法
const publish = () => {
  dialogVisible.value = true
}

// 创建别名
const createAlias = () => {
  ElMessageBox.prompt(h('p', null, [
    h('i', { style: 'color: red' }, '*'),
    h('span', null, t(`algorithm['请输入别名']`))
  ]), t(`algorithm['创建别名']`), {
    confirmButtonText: t(`common['确认']`),
    cancelButtonText: t(`common['取消']`),
    inputPattern:
      /^(?!^\d+$).+$/,
    inputErrorMessage: t(`algorithm['别名必填且不能为纯数字']`),
  })
  .then(({ value }) => {
    if (details.value.alias.includes(value)) {
      ElMessage({
        message: t(`algorithm["当前别名已存在"]`),
        type: 'error',
      })
      return;
    }
    const alias = [value]
    const aliasArr = alias.concat(details.value.alias)
    const params = {
      data: {
        type: 'algorithmversions',
        id: route.params.versionId,
        attributes: {
          "alias": aliasArr
        }
      }
    }
    patchItem('algorithmversions', params).then(res=>{
      ElMessage({
        message: t(`algorithm['新建别名成功']`),
        type: 'success',
      })
      getDetail()
    }).catch((err) => {
      const {response:{data:{errors}}} = err
      let msg = t(`algorithm["新建别名失败"]`)
      if (errors[0] && errors[0]["code"] == 11000) {
        msg = t(`algorithm["当前别名已存在"]`)
      }
      ElMessage({
        message:  msg,
        type: 'error',
      })
    })
  }).catch((err) => {
    console.log(err)
  })
}

// 删除别名
const handleCloseTag = (name) => {
  ElMessageBox.alert(`${t(`algorithm["确认删除别名"]`)} ${name} ？`, t(`algorithm['删除别名']`), {
    confirmButtonText: t(`common['确认']`),
    cancelButtonText: t(`common['取消']`),
    callback: (action) => {
      if (action === "cancel") return;
      const aliasArr = details.value.alias.filter(it => it !== name)
      const params = {
        data: {
          type: 'algorithmversions',
          id: route.params.versionId,
          attributes: {
            "alias": aliasArr
          }
        }
      }
      patchItem('algorithmversions', params).then(res=>{
        ElMessage({
          message: t(`algorithm['删除别名成功']`),
          type: 'success',
        })
        getDetail()
      }).catch((err) => {
        let msg = t(`algorithm["删除别名失败"]`)
        ElMessage({
          message:  msg,
          type: 'error',
        })
      })
    },
  })
}

const getspaces = () => {
  findAllSpace('spaces', {status: 'deployed'}).then((res:any) => {
    const data = gostore.sync(res.data)
    spacesList.value = data
  })
}

// 查询详情
const getDetail = async () => {
  const detailsData = await findItem('algorithmversions', route.params.versionId, {include: ['envversion,layerversions']})
  const data = gostore.sync(detailsData.data)
  details.value = data
  alias.value = data.alias
  zipUrl.value = details.value.url
  envdata.value = data.envversion
  layerdata.value = data.layerversions
}

onMounted(() => {
  getDetail()
  getspaces()
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

:deep(.el-dialog__header) {
  text-align: left;
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