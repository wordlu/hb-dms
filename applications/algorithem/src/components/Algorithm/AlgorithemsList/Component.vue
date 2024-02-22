<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }"> {{ $t('algorithm["算法库"]') }} </el-breadcrumb-item>
      <el-breadcrumb-item>{{  $t('algorithm["算法列表"]') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <div class="title-panel">
        <div class="info">
          <div class="info-detail">
            <b class="title">{{ $t('algorithm["算法库"]') }}<span class="count">({{ count }})</span></b>
          </div>
          <div class="info-btn-group">
            <el-button type="primary" class="info-btn" @click="create" :icon="Plus">{{ $t('algorithm["创建算法"]') }}</el-button>
            <el-button type="info" plain class="info-btn" :disabled="!currentRow.id" @click="remove" :icon="Delete">{{ $t('common["删除"]') }}</el-button>
            <el-button type="info" plain class="info-btn" @click="refresh" :icon="Refresh">{{ $t('common["刷新"]') }}</el-button>
          </div>
        </div>
      </div>
      <div class="mid-panel">
        <el-input v-model="search" class="search-bar" 
          :placeholder="$t(`algorithm['搜索算法名称']`)"
          @change="change" @input="change"
          :prefix-icon="Search" />
        <div class="mid-group">
          <div class="ver-mid">
            <el-button type="text" :disabled="current + 1 >= currentmax" :icon="ArrowRightBold" @click="nextPage" />
          </div>
          <el-text size="large">{{ current + 1 }}</el-text>
          <div class="ver-mid">
            <el-button type="text" :disabled="current === 0" :icon="ArrowLeftBold" @click="prevPage" />
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-panel">
        <el-table ref="multipleTableRef" :data="data" style="width: 100%">
          <el-table-column label=""  width="65">
            <template #default="scope">
              <el-radio 
                :label="scope.$index"
                v-model="radio"
                @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column property="id" label="ID" width="300" />
          <el-table-column property="name" :label="$t(`algorithm['算法名称']`)" width="300">
            <template #default="scope">
              <el-button  style="text-decoration: underline; color: #606266;" link @click="rowClicked(scope.row)">{{ scope.row.name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column property="cat" :label="$t(`algorithm['算法类型']`)" width="160" />
          <el-table-column property="description" :label="$t(`algorithm['描述']`)"/>
          <el-table-column :label="$t(`algorithm['创建时间']`)">
            <template #default="scope">{{ formatter(scope.row.created, "yyyy-MM-dd hh:mm:ss") }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, Search, ArrowRightBold, ArrowLeftBold, Plus, Refresh, Delete } from "@element-plus/icons-vue"
import { ref, onMounted } from "vue"
import gostore from '@/services/algorithm-store'
import { findAll, deleteItem } from '@/api/jsonApi'
import { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

interface Row {
  id: string,
  name: string,
  cat: string,
  description: object,
  created: Date,
  modified: Date,
}
const count = ref(0)
const step = ref(15)
const search = ref('')
const current = ref(0)
const currentmax = ref(0)
const data = ref<Row[]>([])
  const radio = ref<string>('')
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const currentRow = ref<any>({})

const nextPage = () => {
  queryAlgorithemData(current.value + 1)
}

const prevPage = () => {
  queryAlgorithemData(current.value - 1)
}

const getCurrentRow = (row) => {
  currentRow.value = row
}

const rowClicked = (row: Row) => {
  window.history.pushState(null, '', `/algorithem/detail/${row.id}`)
}

onMounted(() => {
  queryAlgorithemData(current.value)
})

const queryAlgorithemData = (page: number) => {
  try {
    const params = {
      offset: step.value * page,
      limit: step.value,
      'filter[name][fuzzy-match]': search.value
    }
    findAll('algorithms', params).then((res: any) => {
      gostore.reset()
      gostore.sync(res.data)
      data.value = gostore.findAll('algorithms')
      count.value = res.data.meta.count
      current.value = page
      currentmax.value = Math.ceil(count.value / step.value)
    }).catch((err: any) => {
      console.log(err, 'err')
    })
  } catch (error) {
    console.log(error)
  }
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

const create = () => {
  window.history.pushState(null, '', `/algorithem/creation`)
}

const refresh = () => {
  radio.value = ''
  currentRow.value = {}
  queryAlgorithemData(0)
}

const change = () => {
  queryAlgorithemData(0)
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
        type: 'algorithms'
      }
    }
    deleteItem('algorithms', params).then(res => {
      ElMessage({
        message: t(`common['删除成功']`),
        type: 'success',
      })
      refresh()
    }).catch((err) => {
      const {response:{data:{errors}}} = err
      let msg = t(`common['删除失败']`)
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
  .catch(() => {
  })
}

</script>

<style lang="scss" scoped>
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
    border: 1px solid transparent;
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

  .title-panel {
    background-color: white;
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

        .title {
          padding: 4px 0;
        }

        .count {
          color: #687078;
          margin-left: 4px;
        }

        .desc {
          color: #545b64;
          font-size: 12px;
        }

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

        .el-button--primary {
          background: #FF7900;
          border: none;
        }

        .info-btn {
          margin: 5px;
        }
      }

    }
  }

  .list {
    // height: 100px;
    flex-grow: 1;
    border: 1px solid transparent;

    .list-panel {
      margin: 10px;
    }
  }
}
</style>