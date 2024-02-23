<template>
  <div class="algo">
    <div class="algo-name">
      <span>{{ data.name }}</span>
      <span class="run-status" :class="data.status">{{ statusMap[data.status] }}</span>
    </div>
    <div class="params">
      <p class="params-label">参数值</p>
      <div class="params-list">
        <div class="params-item" v-for="( val , key, index) in data.params" :key="index">
          <div>
            <p class="params-item-key">{{ val.title }}</p>
            <p class="params-item-val">{{ val.value == ''?'无':val.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    this.statusMap = {
      'failed': '失败',
      'running': '进行中',
      'success': '已通过',
      null:"未执行"
    }
    return {
      
    }
  }
}
</script>

<style scoped lang="scss">
.algo {
  height: 100%;
  width: 320px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 16px;
  &-name {
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    display: flex;
    align-items: center;
  }
  &-info {
    flex: 1;
    overflow: auto;
  }

  .params {
    height: calc(100% - 28px);
    overflow: auto;
    &-label {
      font-size: 16px;
      line-height: 24px;
      margin-top: 24px;
    }
    &-item {
      &-key {
        font-size: 14px;
        line-height: 22px;
        color: #5A5E72;
        margin: 16px 0 4px;
      }
      &-val {
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
  
}
.run-status {
  transform-origin: left bottom;
  margin-top: -18px;
  margin-left: 8px;
}
</style>