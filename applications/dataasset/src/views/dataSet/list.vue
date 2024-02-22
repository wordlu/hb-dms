<template>
  <div id="dataSetList">
    <!-- 头部 -->
    <div class="header">
      <div class="title">
        <div class="Grey-Background-box">
          <img src="/icon/default/数据集首页图标.svg" style="width: 40px;height: 40px;" alt="">
        </div>
        <span>{{ $t('overview["数据资产"]') }}</span>
      </div>
      <div class="btn-add">
        <!-- <el-button type="primary" @click="openAddDataDom" icon="el-icon-plus">新增数据集</el-button> -->
      </div>
    </div>
    <!-- 筛选 -->
    <div class="search">
      <div class="search-input">
        <el-input
          :placeholder="$t(`common['搜索数据集名称']`)"
          prefix-icon="el-icon-search"
          style="height:40px;width:320px"
          clearable
          v-model="search.input">
        </el-input>
        <div class="vertical"></div>
      </div>
      <!-- 筛选按钮 -->
      <filterTagsVue 
        :reAllTags="reAllTags"
        :showFilterContent="showFilterContent" 
        :oneClearTag="oneClearTag" 
        :icons="search.icons"
        :categoryStr="'行为交互,环境,道路,车辆,trip,项目,批次'"
        @setAllTags="setAllTags"
        @reFilter="reFilter"
        @setShowFilterContent="setShowFilterContent" />
      <tagsVue style="height: 32px;margin-top: 4px;" :icons="search.icons" @clearTag="clearTag" :hasClear="true"/>
    </div>

    <!-- 列表 -->
    <div class="table_list">
      <dataSetTable :reList="reList" :iconsall="iconsall" :search="search" @openEditDataDom="openEditDataDom" @showDetailClick="showDetailClick" />
    </div>
    
    <addDataVue @closeAddDataDom="closeAddDataDom" :addDataProps="addDataProps" v-if="addDataProps.dialogVisible"/>
    <editData @closeEditDataDom="closeEditDataDom" :editDataProps="editDataProps" v-if="editDataProps.dialogVisible"/>
    <showConnectorDetail 
      @closeShowDetailDialog="closeShowDetailDialog" 
      :showDetailVisible="showDetailVisible"
      :activeRow="activeRow" 
      :iconsall="iconsall"
      v-if="showDetailVisible"/>
  </div>
</template>

<script>
import tagsVue from '@/components/tags/tags.vue'
import filterTagsVue from '@/components/tags/filterTags.vue'
import dataSetTable from '@/components/dataSet/table.vue'
import addDataVue from '@/components/dataSet/addData.vue'
import showConnectorDetail from '@/components/dataSet/showConnectorDetail.vue'
import editData from '@/components/dataSet/editData.vue'
export default {
  components:{
    tagsVue , filterTagsVue , dataSetTable , addDataVue, showConnectorDetail , editData
  },
  data(){
    return{
      search:{
        input:'',
        icons:[]
      },
      iconsall:[],
      showFilterContent:false,
      oneClearTag:{},
      addDataProps:{
        dialogVisible:false
      },
      editDataProps:{
        dialogVisible:false,
        row:{}
      },
      reList:0,
      reAllTags: 0,
      showDetailVisible: false,
      activeRow: null
    }
  },
  mounted(){
    document.domain = window.server.domain.substr(1)
  },
  methods:{
    openEditDataDom(row){
      this.editDataProps.dialogVisible = true
      this.editDataProps.row = row
    },
    closeEditDataDom(){
      this.reList ++;
      this.editDataProps.dialogVisible = false
    },
    openAddDataDom(){
      this.addDataProps.dialogVisible = true
    },
    closeAddDataDom(){
      this.reList ++;
      this.reAllTags ++;
      this.addDataProps.dialogVisible = false
    },
    setAllTags(tags){
      this.iconsall = tags
    },
    setShowFilterContent(bool){
      this.showFilterContent = bool
    },
    clearTag(item){
      this.oneClearTag = {}
      this.oneClearTag = item
    },
    reFilter(){
      this.search.icons = []
    },
    showDetailClick(row) {
      this.showDetailVisible = true
      this.activeRow = row
    },
    closeShowDetailDialog() {
      this.showDetailVisible = false
    }
  }
}
</script>

<style lang="scss">
#dataSetList{
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0 24px;
  // 头部
  .header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-add{
      .el-button--primary{
        background: #FF7900;
        border-color: #FF7900;
        border-radius: 8px;
      }
    }
    .title{
      display: flex;
      align-items: center;
      .Grey-Background-box{
        width: 40px;
        height: 40px;
        background: #F3F4F7;
        border-radius: 8px;
      }
      span{
        /* Header/text-3xl/I-EL-Medium */
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 28px;
        line-height: 40px;
        /* identical to box height, or 143% */
        /* 01 Netural/N700 */
        color: #2D2F39;
        margin-left: 12px;
      }
    }
  }
  // 搜索
  .search{
    width: 100%;
    padding: 12px;
    margin-top: 40px;
    background: #F9F9FB;
    border-radius: 12px;
    display: flex;
    .search-input{
      width: 332px;
      padding-right: 12px;
      position: relative;
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
  .tags{
    margin-left: 8px;
  }
  .table_list{
    height: calc(100% - 144px);

    .el-table::before {
      background-color: transparent;
    }
  }
}
</style>