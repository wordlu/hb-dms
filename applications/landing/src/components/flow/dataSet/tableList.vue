<template>
  <!-- <el-radio-group> -->
  <el-table :data="dataList" :show-header="false" stripe @row-click="rowClick">
    <el-table-column prop="name" />
    <el-table-column prop="tags">
      <template #default="scope">
        <!-- {{ scope.row }} -->
        <!-- {{ filterTags(scope.row.tags) }} -->
        <tags :icons="filterTags(scope.row.tags)" :clickDisable="true" />
      </template>
    </el-table-column>
    <el-table-column prop="select" width="100">
      <template #default="scope">
        <svg-icon v-if="selectedId === scope.row.id" icon-class="radioSelected" style="width:16px;height:16px"/>
        <svg-icon v-else icon-class="radioDefault" style="width:16px;height:16px"/>
      </template>
    </el-table-column>
  </el-table>
  <!-- </el-radio-group> -->
</template>

<script setup>
import tags from './tags.vue';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance()
const $filter = proxy.$filter
console.log(proxy.$filter,'$filter')

const props = defineProps({
  dataList: {
    type: Array,
    default: []
  },
  allTags: {
    type: Array,
    default: []
  },
  selectedId: {
    type: String,
    default: ''
  } 
})

const emits = defineEmits(['select'])

function rowClick(row, col, event) {
  emits('select', row.id,row)
}
// 筛选指定标签
function filterTag(id) {
  if (Array.isArray(id)) {
    return props.allTags.filter(item => id.includes(item.id) )
  }
  return props.allTags.find(item => item.id === id)
}
function filterTags(ids) {
  // console.log(proxy)
  if (!ids) return
  // return $filter.filterTag(ids) || []
  return filterTag(ids) || []
}

</script>