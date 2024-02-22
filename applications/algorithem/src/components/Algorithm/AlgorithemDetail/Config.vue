<template>
  <div class="config-container">
    <el-tabs tab-position="left" class="config-tabs" type="card" v-model="tabName" @tab-click="handleClick">
      <el-tab-pane :label="$t(`algorithm['常规配置']`)" name="regularConfig">
        <div class="regualr-config">
          <div class="panel">
            <div class="mid-panel">
              <div class="mid-group">
                <div class="ver-mid">
                  <el-button type="primary" class="info-btn save-btn" @click="submitForm">{{ $t(`common['编辑']`) }}</el-button>
                </div>
              </div>
            </div>
          </div>
          <el-descriptions>
            <el-descriptions-item label="GPU:">{{ regularConfigData.gpu }}</el-descriptions-item>
            <el-descriptions-item label="CPU:">{{ regularConfigData.cpu }}</el-descriptions-item>
            <el-descriptions-item :label="$t(`algorithm['内存']`) + ':'">{{ regularConfigData.memory }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t(`algorithm['环境变量']`)" name="envVariable">
        <div class="panel">
          <div class="mid-panel">
            <div class="mid-group">
              <div class="ver-mid">
                <el-button type="primary" class="info-btn save-btn" @click="submitForm">{{ $t(`common['编辑']`) }}</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="list-panel">
            <el-table ref="multipleTableRef" :data="tableData" style="width: 100%">
              <el-table-column :label="$t(`algorithm['键']`)" property="key"></el-table-column>
              <el-table-column :label="$t(`algorithm['值']`)" property="value"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { ElTable, ElMessage} from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { patchItem } from '@/api/jsonApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  algorithemversionId: String,
  algorithemId: String,
  configData: Object,
  name: String
})

watch(
  () => props.configData,
  (newVal, oldVal) => {
    setConfigData(newVal)
  }
)

const setConfigData = (data:any) => {
  regularConfigData.gpu = data.gpu
  regularConfigData.cpu = data.resources.cpu ? Number(data.resources.cpu) : 0
  regularConfigData.memory = data.resources.memory ? Number(data.resources.memory) : 0
  tableData.value = Object.keys(data.env).map(it => {
    return {
      key: it,
      value: data.env[it]
    }
  })
}

interface Row {
  alias: string
  version: number
  name: string
  date: string
}

const tableData = ref<Row[]>([])
const tabName = ref<string>("regularConfig")
const regularConfigData = reactive({
  gpu: '',
  cpu: 0,
  memory: 0
})
const handleClick = (tab: TabsPaneContext, event: Event) => {
  tabName.value = tab.paneName
}

const submitForm = async () => {
  if (tabName.value === "regularConfig") {
    window.history.pushState(null, '', `/algorithem/detail/${props.algorithemId}/config/creation?name=${props.name}&version0=${props.algorithemversionId}`)
  } else {
    window.history.pushState(null, '', `/algorithem/detail/${props.algorithemId}/envVariable/creation?name=${props.name}&version0=${props.algorithemversionId}`)
  }
}
</script>

<style lang="scss" scoped>
.user-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-button--primary {
  color: #ff7900;
  border-color: #ff7900;
  background: #fff;
}

.ver-mid {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.config-container {
  display: flex;
  flex-direction: column;
  margin: 0px;

  .config-tabs {

    :deep(.el-tabs__item:hover) {
      color: #FF7900;
    }
    :deep(.is-active) {
      border-right: 1px solid#FF7900 !important;
      color: #FF7900;
    }

    .regualr-config {
      .el-descriptions {
        padding: 60px;
      }
    }

    .list-panel {
      padding: 30px;
    }
  }

  .bread-font {
    font-weight: 700;
  }

  .panel {
    margin-top: 15px;
    flex-grow: 1;
    // border: 1px solid transparent;
  }

  .mid-panel {
    display: flex;
    flex-direction: row;

    .search-bar {
      max-width: 300px;
      padding: 10px
    }

    .mid-group {
      flex-grow: 1;
      width: 100px;
      display: flex;
      flex-direction: row-reverse;
      margin: 0 15px;

      .save-btn {
        background: #FF7900;
        color: #fff;
      }

      button {
        margin: 0 15px
      }
    }
  }

  .list {
    border-top: 1px solid transparent;
    margin-top: 10px;

    .el-button--primary:hover{
      background-color: rgba($color: #FF7900, $alpha: .1);
    }

    .params {
      width: 100%;
      .input-output {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .script-params {
        color: #8D91A5;
        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        width: 50%;
        // margin-bottom: 20px;
        padding: 4px;

        &-title{
          border-bottom: 1px solid #dad5d5;
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
        }

        &-body{
          padding: 8px 0;
        }
        .script-ego-params{
          display: flex;
          margin-bottom: 6px;
        }

        .el-form-item {
            margin-bottom: 18px;
        }

        &-body-item{
          display: flex;
          width: 50%;
        }
      }

      .script-ego {
        width: 100%;
      }
    }
  }
}</style>