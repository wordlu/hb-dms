<template>
  <div class="search-filter">
    <div class="filter-btn" @click="openFilterContent">
      <svg-icon icon-class="dataSetListFilter" class="dataSetListFilter" style="width:15px;height:15px"/>
      <span>
        筛选
      </span>
      <svg-icon icon-class="dataSetlistRight" class="dataSetlistRight" style="width:12px;height:12px"/>
    </div>
    <div class="filter-btn-content" v-if="showFilterContent">
      <div class="filter-bar">
        <el-autocomplete
          placeholder="搜索标签"
          :prefix-icon="Search"
          style="height:32px;width:208px"
          :fetch-suggestions="querySearchAsync"
          clearable
          @select="handleSelect"
          @clear="showAllTags"
          v-model="input">
        </el-autocomplete>

        <button class="refilter-btn" type='button' @click="reFilter">
          重置筛选
        </button>
      </div>

      <div class="filter-icons">
        <el-tooltip class="item" v-for="(item,index) in icons_all" :key="index" effect="dark" :content="item.name" placement="bottom">
          <el-badge :value="icons.includes(item.id) ? '已选' : '' " class="item" type="primary">
            <span @click="seticons(item)" :key="index" class="icon-item" :style="{'background':item.color}" >
              <img :src="'/'+item.pattern" alt="" style="width:32px;height:32px">
            </span>
          </el-badge>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue'

import { useRoute } from 'vue-router'
import jsCookie from 'js-cookie'

const { proxy } = getCurrentInstance()

const emits = defineEmits(['setIcon', 'reFilter', 'setAllTags'])
const props = defineProps({ 
  icons: { // 选中的标签
    type: Array,
    default: []
  } 
})

const showFilterContent = ref(false)

function openFilterContent() {
  showFilterContent.value = !showFilterContent.value
}

const icons_all = ref([]) // 标签全部图标

onMounted(() => {
  getIcons()
})

function getIcons(){
  proxy.$api['findAll']('tags', { project: jsCookie.get('projectId'), category: '环境,道路,车辆,trip' }).then(res=>{
    emits('setAllTags', res.data)
    icons_all.value = res.data
    // this.$emit('setAllTags',this.icons_all)
    // this.setIconsAllStatus()
    // this.restaurants = JSON.parse(JSON.stringify(this.icons_all))
  })
}

function createStateFilter(queryString) {
  return (state) => {
    return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
  };
}

function querySearchAsync(queryString, cb) {
  var restaurants = JSON.parse(JSON.stringify(icons_all.value));
  restaurants.forEach(item => {
    item.value = item.name
  });

  var results = queryString ? restaurants.filter(createStateFilter(queryString)) : restaurants;
  clearTimeout(this.timeout);
  cb(results);
}

function handleSelect(item) {
  let hasTag = false;
  for(let i=0;i<props.icons.length;i++){
    if(props.icons[i].name == item.name){
      hasTag = true
      this.restaurants = [JSON.parse(JSON.stringify(props.icons[i]))]
    }
  }
  if(!hasTag){
    this.restaurants = [JSON.parse(JSON.stringify(item))]
  }
}

function seticons(tag) {
  emits('setIcon', tag)
} 

function reFilter() {
  emits('reFilter')
}

</script>

<style lang="scss">
.search-filter{
  margin-left: 12px;
  display: flex;
  position: relative;

  .filter-btn{
    height: 32px;
    width: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select:none;
    span{
      margin: 0px 6.5px;
    }

    /* 01 Netural/N000 */
    background: #FFFFFF;
    /* 01 Netural/N080 */

    border: 1px solid #E1E3EB;
    border-radius: 8px;
    
  }
  .filter-btn-content{
    width: 320px;
    height: 240px;
    position: absolute;
    top: 36px;
    left: 0px;
    /* 01 Netural/N000 */
    background: #FFFFFF;
    /* Light/Depth-Z300 */
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 16px 12px 0px 0px;
    z-index: 10;
    .filter-bar{
      display: flex;
      margin-left: 12px;
      .el-input__inner{
        height: 32px;
      }
      .el-input__icon{
        line-height: 32px!important;
      }
      .refilter-btn{
        width: 85px;
        height: 32px;
        padding: 5px 12px;
        margin-left: 8px;
        background: #F3F4F7;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        /* identical to box height, or 157% */
        text-align: center;
        /* 01 Netural/N500 */
        color: #5A5E72;
        /* Inside auto layout */
        flex: none;
        order: 0;
        flex-grow: 0;

        outline: none;
        border:none;
        cursor:pointer;
      }
    }
    .filter-icons{
      width: 100%;
      height: calc(240px - 64px);
      overflow: auto;
      // display: flex;
      flex-wrap: wrap;
      padding: 16px 0px 12px;
      .icon-item{
        width: 32px;
        height: 32px;
        border-radius: 8px;
        margin-left: 12px;
        // padding: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        margin-bottom: 12px;
      }
    }
  }
  .filter-btn:hover{
    cursor:pointer;
    border: 1px solid #FF7900;
  }
  .el-badge__content.is-fixed {
    right: 35px;
  }
}
</style>