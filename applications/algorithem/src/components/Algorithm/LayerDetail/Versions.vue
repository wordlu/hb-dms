<template>
  <div class="container">
    <div class="panel">
      <div class="mid-panel">
        <el-input v-model="search" class="search-bar" :placeholder="$t(`algorithm['搜索版本号']`)" @change="change" @input="change" :prefix-icon="Search" />
        <div class="mid-group">
          <div class="ver-mid">
            <el-button type="text" :disabled="current + 1 >= currentmax" :icon="ArrowRightBold" @click="nextPage" />
          </div>
          <el-text size="large">{{ current + 1 }}</el-text>
          <div class="ver-mid">
            <el-button type="text" :disabled="current === 0" :icon="ArrowLeftBold" @click="prevPage" />
          </div>
          <div class="ver-mid">
            <el-button type="info" class="info-btn" plain :disabled="!currentRow.id" @click="remove" :icon="Delete">{{ $t('common["删除"]') }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-panel">
        <el-table ref="multipleTableRef" 
          :data="tableData" 
          style="width: 100%">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column label=""  width="65">
            <template #default="scope">
              <el-radio 
                :label="scope.$index"
                v-model="radio"
                @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="ID" property="id"></el-table-column>
          <el-table-column property="version" :label="$t(`algorithm['版本号']`)" width="300">
            <template #default="scope">
              <el-button link style="text-decoration: underline; color: #606266;"  @click="rowClicked(scope.row)">{{ scope.row.version }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t(`algorithm['别名']`)" width="300">
            <template #default="scope">
              <div style="white-space: pre;">{{ formatterAlias(scope.row.alias) }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t(`algorithm['版本描述']`)" property="description"></el-table-column>
          <el-table-column :label="$t(`algorithm['创建时间']`)">
            <template #default="scope">{{ formatter(scope.row.created, "yyyy-MM-dd hh:mm:ss") }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { ElTable, ElMessage, ElMessageBox  } from 'element-plus'
// @ts-ignore 
import { ArrowRight, Search, ArrowRightBold, ArrowLeftBold, Plus, Delete } from "@element-plus/icons-vue" // eslint-disable-line
import gostore from '@/services/algorithm-store'
import { findItem, findAll, deleteItem } from '@/api/jsonApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  layerId: String,
  name: String
})

interface Row {
  id: string
  version: number
  name: string
  date: string
}

const current = ref(0)
const search = ref('')
const count = ref(0)
const step = ref(10)
const currentmax = ref(0)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// const multipleSelection = ref<Row[]>([])
// const isDeleteBtnDisabled = ref<boolean>(true)
const currentRow = ref<any>({})
const tableData = ref<Row[]>([])
const radio = ref<string>('')

// const handleSelectionChange = (val: Row[]) => {
//   multipleSelection.value = val
//   if (multipleSelection.value.length === 0) isDeleteBtnDisabled.value = true
//   else isDeleteBtnDisabled.value = false
// }

const getCurrentRow = (row) => {
  currentRow.value = row
}

const formatterAlias = (data) => {
  return data.join('\n')
}

const nextPage = () => {
  getList(current.value + 1)
}

const prevPage = () => {
  getList(current.value - 1)
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
  ).then(() => {
    const params = {
      data: {
        id: currentRow.value.id,
        type: 'layerversions'
      }
    }
    deleteItem('layerversions', params).then(res => {
      ElMessage({
        message: t(`common["删除成功"]`),
        type: 'success',
      })
      refresh()
    }).catch(err => {
      const {response:{data:{errors}}} = err
      let msg =  t(`common["删除失败"]`)
      if(errors && errors[0]) {
        const errmsg = errors[0]['detail']
        msg =  t(`algorithm['${errmsg}']`)
      }
      ElMessage({
        message: msg,
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
  getList(0)
}

const change = () => {
  getList(0)
}

const rowClicked = (row: Row) => {
  window.history.pushState(null, '', `/algorithem/layer/${props.layerId}/version/${row.id}?name=${props.name}`)
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

const getList = async (page: number) => {
  const params = {
    offset: step.value * page,
    limit: step.value,
    version: search.value,
    'filter[version][min]': 1,
    layer: props.layerId,
  }
  findAll('layerversions', params).then(res => {
    const layerversion = gostore.sync(res.data)
    current.value = page
    count.value = res.data.meta.count
    currentmax.value = Math.ceil(count.value / step.value)
    tableData.value = layerversion
  })
}

getList(0)

</script>

<style lang="scss">
.el-message-box {
  .el-button:hover {
    color: #FF7900;
    background: rgba(255,121,0,0.1);
    border-color: #FF7900;
  }
  .el-button--primary, .el-button--primary:hover, .el-button--primary:focus {
    background: #FF7900;
    border: none;
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>


.user-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
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

      

      .el-button--text {
        color: #FF7900;
      }

      .el-button--text.is-disabled {
        color: rgba(255, 121, 0, 0.4);
      }


      button {
        margin: 0 15px
      }
    }
  }

  .list {
    border-top: 1px solid transparent;
    margin-top: 10px;
  }
}
</style>