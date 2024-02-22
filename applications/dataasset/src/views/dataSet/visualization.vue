<template>
  <iframe :src="iframeUrl" frameborder="0" style="width: 100%;height: 100%;"></iframe>
</template>

<script>
export default {
  data(){
    return{
      iframeUrl:'/bevfront/visualization'
    }
  },
  created(){
    this.iframeUrl += `?dataset=${this.$route.params.dataset}&client_name=${window.server.client_name}&app_name=dataset`
  }
}
</script>

<style>

</style>