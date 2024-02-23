<template>
  <div class="data-set">
    <!-- 头部 -->
    <div class="header">
      <div class="title">
        <div class="Grey-Background-box">
          <img src="/icon/default/数据集首页图标.svg" style="width: 40px;height: 40px;" alt="">
        </div>
        <span class="title-name">数据集</span>
        <span class="title-num">共计{{ totalNum }}项</span>
      </div>
      <div class="header-btn">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="sureClick">确定</el-button>
      </div>
    </div>
    <!-- 筛选 -->
    <div class="search">
      <div class="search-input">
        <el-input
          placeholder="搜索数据集名称"
          :prefix-icon="Search"
          size="small"
          style="width:320px"
          clearable
          v-model="searchText"
          @input="getSearchList"
          @compositionstart="searchLock = true"
          @compositionend="searchLock = false">
        </el-input>
        <div class="vertical"></div>
      </div>
      <!-- 筛选按钮 -->
      <filterTags
        :showFilterContent="showFilterContent" 
        :oneClearTag="oneClearTag" 
        :icons="selIcons"
        @setIcon="setIcon"
        @setAllTags="setAllTags"
        @reFilter="reFilter"
        @setShowFilterContent="setShowFilterContent" />
      <tags :icons="searchIcons" @clearTag="clearTag"/>
    </div>

    <!-- 列表 -->
    <div class="table_list" v-infinite-scroll="getList" :infinite-scroll-disabled="loading || noMore">
      <tableList :dataList="dataList" :allTags="allTags" :selectedId="selectedId" @select="selectDataSet" />
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import filterTags from '@/components/flow/dataSet/filterTags.vue'
import tags from './tags.vue'
import { Search } from '@element-plus/icons-vue'
import tableList from './tableList.vue'
import { ElMessage } from 'element-plus'
import jsCookie from 'js-cookie'

const { proxy } = getCurrentInstance()
const route = useRoute()

const emits = defineEmits('handler')

const loading = ref(false) // 是否正在加载中
const noMore = ref(false) // 是否加载完毕
const curPage = ref(1) // 数据集列表当前页码
const dataList = ref([]) // 数据集列表数据
const totalNum = ref(0) // 数据集列表总数
const selectedId = ref('') // 当前所选数据集id

const searchText = ref('') // 数据集搜索关键字
const searchIcons = ref([]) // 搜索标签
const allTags = ref([]) // 全部标签
const searchLock = ref(false)

const selIcons = computed(() => searchIcons.value.map(i => i.id)) // 已选tag的id集合

onMounted(async () => {
  
})

// 获取全部数据集列表数据
function getList() {
  loading.value = true
  const query = {
    limit: 10,
    offset: (curPage.value - 1) * 10,
    project: jsCookie.get('projectId'),
    sort:'-created',
    "filter[created][min]":'2000-01-01 00:00:00'
  }
  if (selIcons.value.length > 0) {
    query.tags = selIcons.value.join(',')
  }
  if (searchText.value) {
    // query.name = searchText.value

    query.fuzzyMatch = [
      'name',searchText.value
    ]
  }

  
  proxy.$api['findAll']('datasets', query).then(res=>{
    dataList.value = dataList.value.concat(res.data)
    curPage.value++
    loading.value = false
    totalNum.value = res.count
    if (dataList.value.length >= res.count) { 
      noMore.value = true
    }
    // this.tableData = res.data
  })
}
function getSearchList() {
  curPage.value = 1
  dataList.value = []
  getList()
}
// 点击指定数据集
function selectDataSet(id) {
  selectedId.value = id
}

function setAllTags(tags) {
  allTags.value = tags
}
// 筛选组件设置标签选择
function setIcon(tag) {
  const _index = searchIcons.value.findIndex(i => i.id === tag.id)
  if (_index > -1) {
    searchIcons.value.splice(_index, 1)
  } else {
    searchIcons.value.push(tag)
  }
  getSearchList()
}
// 清除指定标签
function clearTag(id) {
  const _ind = searchIcons.value.findIndex(i => i.id === id)
  searchIcons.value.splice(_ind, 1)
  getSearchList()
}

// 重置筛选
function reFilter() {
  searchIcons.value = []
  getSearchList()
}

function cancelClick() {
  emits('handler', false)
}
function sureClick() {
  if (!selectedId.value) {
    return ElMessage.error('请选择数据集')
  }
  const dataset = dataList.value.find(i => i.id === selectedId.value)
  emits('handler', true, dataset)
}


</script>

<style scoped lang="scss">
.data-set {
  height: 380px;
  width: calc(100% - 368px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
  font-family: 'PingFang SC';
  position: absolute;
  bottom: 16px;
  left: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  .header {
    display: flex;
    justify-content: space-between;
      align-items: center;
    .title {
      display: flex;
      align-items: center;
      .Grey-Background-box{
        width: 40px;
        height: 40px;
        background: #F3F4F7;
        border-radius: 8px;
      }
      &-name {
        margin: 0 8px 0 12px;
        font-family: 'Poppins';
        font-weight: 600;
        font-size: 24px;
        line-height: 40px;
      }
      &-num {
        font-size: 14px;
        line-height: 22px;
        color: #8D91A5;
        margin-top: 6px;
      }
    }
  }

  // 搜索
  .search{
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    background: #F9F9FB;
    border-radius: 12px;
    display: flex;
    .search-input{
      width: 332px;
      padding-right: 12px;
      position: relative;

      .el-input--prefix .el-input__inner {
        padding-left: 16px !important;
      }

      .vertical{
        width: 2px;
        height: 28px;
        background: #E1E3EB;
        border-radius: 99px;
        position: absolute;
        top: 50%;
        margin-top: -14px;
        right: -1px;
      }
    }
  }

  .table_list  {
    height: calc(100% - 100px);
    overflow: auto;
  }
}
</style>