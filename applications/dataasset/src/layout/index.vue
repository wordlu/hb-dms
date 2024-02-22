<template>
  <div id="layout">
    <router-view/>
  </div>
</template>

<script>
export default {

}
</script>

<style>
#layout {
  width: 100%;
  height: calc(100vh - 130px);
  overflow: auto;
}
</style>