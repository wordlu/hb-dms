<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{$t('algorithm["算法库"]')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/layers' }">{{ $t('algorithm["依赖层"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/layer/' + $route.params.layerId }">{{ $route.query.name
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('algorithm["版本"]') }}: {{ details ? details.version : '' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <div class="title-panel">
        <div class="info">
          <div class="info-detail">
            <b>{{ details ? details.version : '' }}</b>
          </div>
          <div class="info-btn-group">
            <el-button type="primary" class="info-btn" @click="createAlias">{{ $t('algorithm["创建别名"]') }}</el-button>
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
    <div class="editor">
      <Editor language="python" 
        :content="codeContent"  
        :zipUrl="zipUrl"
        :hideButton="true"
        theme="dracula" :height="500" :title="$t(`algorithm['依赖层代码']`)"></Editor>
    </div>
    <el-divider></el-divider>
    <div class="config-area">
      <div class="select-form">
        <b class="title">{{ $t('algorithm["兼容的环境"]') }}</b>
      </div>
      <div class="list-panel">
        <el-table ref="multipleTableRef" 
          :data="envdata" style="width: 100%">
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
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import { ref, reactive, onMounted, h } from "vue"
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import jsCookie from 'js-cookie'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import gostore from '@/services/algorithm-store'
import { findItem, patchItem } from '@/api/jsonApi'
import Editor from "@/components/Algorithm/Common/fileTreeEditor.vue"
const codeContent = ref<string>('')
const zipUrl = ref<string>('')
const { t } = useI18n()
const route = useRoute()
const alias = ref<any>([])
const envdata = ref([])
const radio = ref<string>('')
const details = ref<any>({})

const rowClicked = (row) => {
  // window.history.pushState(null, '', `/algorithem/env/${row.id}`)
}

const handleCloseTag = (name) => {
  ElMessageBox.alert(`${t(`algorithm["确认删除别名"]`)} ${name} ？`, t(`algorithm['删除别名']`), {
    confirmButtonText: t(`common['确认']`),
    cancelButtonText: t(`common['取消']`),
    callback: (action) => {
      if (action === "cancel") return;
      const aliasArr = details.value.alias.filter(it => it !== name)
      const params = {
        data: {
          type: 'layerversions',
          id: route.params.versionId,
          attributes: {
            "alias": aliasArr
          }
        }
      }
      patchItem('layerversions', params).then(res=>{
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
  }).then(({ value }) => {
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
        type: 'layerversions',
        id: route.params.versionId,
        attributes: {
          "alias": aliasArr
        }
      }
    }
    patchItem('layerversions', params).then(res=>{
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

const getDetail = async () => {
  const detailsData = await findItem('layerversions', route.params.versionId, {include: 'envversions'})
  const data = gostore.sync(detailsData.data)
  details.value = data
  alias.value = data.alias
  zipUrl.value = details.value.url
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
  }

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
        background-color: lightgray;
      }
    }
  }
}
</style>