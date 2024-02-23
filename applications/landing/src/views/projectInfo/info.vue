<template>
  <div id="projectInfo">
    <!-- 信息及图表展示部分 -->
    <infoContainer />
    <!-- 日志信息展示部分 -->
    <logsContainer />
  </div>
</template>

<script>
import infoContainer from '@/components/projectInfo/infoContainer.vue';
import logsContainer from '@/components/projectInfo/logsContainer.vue';
export default {
  components:{
    infoContainer , logsContainer
  },
  created(){
    console.log(' 进入 info')
  }
}
</script>

<style lang="scss">
#projectInfo{
  width: 100%;
  height: calc(100vh - 130px);
  overflow: auto;
  padding: 24px 24px 24px 0px;
  display: flex;
}
</style>