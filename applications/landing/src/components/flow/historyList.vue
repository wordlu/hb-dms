<template>
  <div class="history">
    <p class="title">历史数据</p>
    <!-- list列表 -->
    <div class="list" v-infinite-scroll="loadData" :infinite-scroll-disabled="loading || noMore" v-if="!isShow">
      <div class="list-item" v-for="item in data" :key="item.id" :class="{ 'selected': selectedId === item._id }"  @click="itemClick(item)">
        <!-- runId & 状态 -->
        <div class="list-item-line">
          <span class="list-item-id" :title="item.runid">{{ item.runid }}</span>
          <span class="run-status" :class="getStatusClass(item.status)">{{ getStatus(item.status) }}</span>
        </div>
        
        <!-- 执行时间 & 执行人 -->
        <div  v-if="getStatus(item.status) ==='进行中'" class="list-item-line mt-4">
          <span class="list-item-time">{{ item.startdate || '--' }}</span>
          <span class="list-item-user">
            <span class="run-status" :class="getStatusClass('失败')"  @click="stopRuning(item)">停止</span>
          </span>
        </div>
        <div v-else class="list-item-line mt-4">
          <span class="list-item-time">{{ item.startdate || '--' }}</span>
          <span class="list-item-user">
            <span>owner</span>
            <span class="list-item-user-icon"></span>
          </span>
        </div>
      </div>
      <p v-if="!data.length" class="tip-text">暂无数据</p>
      <p v-else-if="loading" class="tip-text">加载中...</p>
      <p v-else-if="noMore" class="tip-text">到底了</p>
    </div>
  </div>
</template>

<script>
import { stopFlowExecute  } from '@/api/flow'
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false
    },
    noMore: {
      type: Boolean,
      default: false
    },
    selectedId:{
      type: String,
      default: false
    }
  },
  data() {
    this.statusMap = {
      'failed': '失败',
      'running': '进行中',
      'success': '已通过',
      'queued': '排队中'
    }
    return {
      isShow:false
    }
  },
  methods: {
    // 点击停止运行
    stopRuning(item) {
      const { runid, dagname } = item
      
      stopFlowExecute({ runid, dagname, state: "failed"}).then(res => {
        this.isRuning = false
      })
    },
    getStatusClass(status) {
      if (!status) return 'queued' 
      return status
    },
    getStatus(status) {
      if (!status) return '排队中' 
      return this.statusMap[status]
    },
    itemClick(item) {
      this.$emit('setSelectedId',item._id,item.runid,item)
    },
    loadData() {
      this.$emit('loadMore')
    }
  },
  beforeUnmount(){
    this.isShow = true
  }
}
</script>

<style scoped lang="scss">
.history {
  height: 100%;
  overflow: hidden;
  font-family: 'PingFang SC';
  background-color: #ffffff;
  border-radius: 0 0 12px 12px;
  padding: 0 8px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
  .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #2D2F39;
    padding: 16px;
  }
  .list {
    height: calc(100% - 60px);
    overflow: auto;
    &-item {
      padding: 12px 16px;
      color: #9194A1;
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;
      &.selected {
        background: linear-gradient(90deg, #FFF1E5 -3.88%, rgba(255, 241, 229, 0) 100%);
        border-radius: 8px;
      }
      &-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      &-id {
        font-family: 'Poppins';
        font-weight: 600;
        font-size: 18px;
        line-height: 28px;
        color: #2D2F39;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
      }
      &-user {
        display: flex;
        align-items: center;
        &-icon {
          display: inline-block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          margin-left: 6px;
          background-image: url('@/assets/avatar.png');
          background-size: contain;
        }
      }
    }
  }
  .mt-4 {
    margin-top: 4px;
  }
  .run-status {
    margin-left: -48px;
    margin-top: -20px;
    transform-origin: right bottom;
  }
  .tip-text {
    text-align: center;
    color: #2D2F39;
  }
}
</style>