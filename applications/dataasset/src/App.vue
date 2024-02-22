<template>
  <div id="dataasset">
    <router-view/>
  </div>
</template>

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
#dataasset {
  width: 100%;
  height: 100%;
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
