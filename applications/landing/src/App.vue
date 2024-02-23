<template>
  <div id="app_project">
    <router-view/>
  </div>
</template>
<script setup>

console.log('landing App vue 执行了')

</script>
<style lang="scss">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html,body{
  width: 100%;
  height: 100%;
}
#app_project {
  width: 100%;
  height: calc(100vh - 130px);
  overflow: auto;
}

::-webkit-scrollbar-track-piece {
  background: #d3dce6;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

::-webkit-scrollbar-thumb {
  background: #99a9bf;
  border-radius: 20px;
}
</style>
