<template>
  <div class="log">
    <p class="title">Log</p>
    <div class="content">
      {{ data || '暂无数据' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: String
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
.log {
  flex: 1;
  margin-left: 24px;
  .title {
    font-family: 'Poppins';
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #2D2F39;
    margin-bottom: 12px;
  }
  .content {
    height: calc(100% - 40px);
    overflow: auto;
    font-size: 16px;
    line-height: 32px;
    color: #000000;
    white-space: pre-line;
  }
}
</style>