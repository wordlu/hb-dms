<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/envs' }">{{ $t('algorithm["环境列表"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ details ? details.name : '' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <div class="title-panel">
        <div class="info">
          <div class="info-detail">
            <b>{{ details ? details.name : '' }}</b>
          </div>
          <div class="info-btn-group">
            <el-button type="info" plain class="info-btn" @click="createVersion">{{ $t('algorithm["发布版本"]') }}</el-button>
            <!-- <el-button type="info" plain class="info-btn" @click="remove">删除</el-button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="detail">
      <el-descriptions :title="$t(`algorithm['详细信息']`)">
        <el-descriptions-item label="ID:">{{ details.id }}</el-descriptions-item>
        <el-descriptions-item :label="$t(`common['类型']`)">{{ details.cat }}</el-descriptions-item>
        <!-- <el-descriptions-item label="执行环境:">{{ details.runtime }}</el-descriptions-item> -->
        <!-- <el-descriptions-item label="版本:">{{ details.latestversion }}</el-descriptions-item> -->
        <el-descriptions-item :label="$t(`algorithm['描述']`)">{{ details.description }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="summary">
      <el-tabs v-model="activeName" class="layer-tabs" @tab-click="handleClick">
        <el-tab-pane :label="$t(`algorithm['代码']`)" name="code">
          <div class="editor">
            <Editor language="dockerfile" :content="codeContent" :zipUrl="zipUrl" theme="dracula" :hideButton="false" :height="500" :title="$t(`algorithm['环境代码']`)" @onsave="onsave"></Editor>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t(`algorithm['版本']`)" name="versions">
          <Versions 
            :name="details ? details.name : ''"
            :envId="$route.params.id" ></Versions>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import { ref, reactive, onMounted } from "vue"
import Versions from './Versions.vue'
// import Alias from './Alias.vue'
// import Layers from './Layers.vue'
import Editor from "../Common/Editor.vue"
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import jsCookie from 'js-cookie'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import gostore from '@/services/algorithm-store'
import { findItem } from '@/api/jsonApi'
import { funcUploadCode, funcPathContent } from '@/api/api'

interface Row {
  name: '',
  description: '',
  latestversion: '',
  created: ''
}
const route = useRoute();
const { t } = useI18n()
const data = ref<Row>({ name: '', description: '', latestversion: '', created: '' })
const form = reactive<Row>({
  name: '',
  description: '',
  latestversion: '',
  created: ''
})
const details = ref<any>({})
const dialogVisible = ref<boolean>(false)
const activeName = ref<string>("code")
// const versionArray = ref<any>([])
const zipUrl = ref<string>('')
const codeContent = ref<string>('')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.paneName
}

const onsave = (res) => {
  const params = {
    "type": "edit",
    "content": res
  }
  if (!zipUrl.value) {
    ElMessage({
      message: t(`algorithm['请先选择需要修改的文件']`),
      type: 'error',
    })
    return false
  }
  funcUploadCode(params, `${zipUrl.value}Dockerfile`).then(res => {
    ElMessage({
      message: t(`common['保存成功']`),
      type: 'success',
    })
  })
}

const createVersion = () => {
  window.history.pushState(null, '', "/algorithem/env/" + route.params.id + "/version/creation" + `?name=${details.value.name}`)
}

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
    //  删除逻辑
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Ld-Project": window.server.client_name,
      "Authorization": jsCookie.get('Token')
    }
    try {
      // axios.delete(`http://${window.server.ssoPrefix}/api/access-policy/users/${route.params.id}`, {
      //   headers: headers
      // }).then((res) => {
      //   ElMessage({
      //     message: t(`common['删除成功']`),
      //     type: 'success',
      //   })
      //   window.history.pushState(null, '', `/dmsshell/userlist`)
      // }).catch(err => {
      //   const { response: { data: { errorMessage } } } = err
      //   ElMessage({
      //     message: errorMessage ? errorMessage : t(`common['操作失败']`),
      //     type: 'error',
      //   })
      // })
    } catch (error) {
      console.log(error)
    }
    //删除逻辑结束
  })
  .catch(() => {
  })
}

const getDetail = async () => {
  const detailsData = await findItem('environments', route.params.id, {include: 'versions'})
  const data = gostore.sync(detailsData.data)
  details.value = data
  // versionArray.value = data.versions ? data.versions.filter(it => it.version > 0) : []
  zipUrl.value = data.versions.find(it => it.version === 0).url
  getEditorCode()
  // findAll('Environmentversion', {environment: details.value.id}).then(res => {
  //   const Environmentversion = gostore.sync(res.data)
  //   versionArray.value = Environmentversion
  // })
}

const getEditorCode = () => {
  funcPathContent(`${zipUrl.value}Dockerfile`).then(res => {
    codeContent.value = res.data.data.content
    console.log(codeContent, "codeContent")
  })
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

    .detail-title {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 50px;
      background-color: #fafafa;

      .detail-title-row {
        display: flex;
        flex-direction: row;

        .left {
          display: flex;
          flex-direction: row;
          flex-grow: 0;

          b {
            padding: 15px;
            font-size: 14px;
          }
        }

        .right {
          display: flex;
          flex-direction: row-reverse;
          flex-grow: 1;
          margin: 15px 30px;
        }
      }

    }

    .detail-panel {
      .detail-message {
        display: flex;
        flex-direction: column;
        background-color: #fff;
      }
    }
  }
}
</style>