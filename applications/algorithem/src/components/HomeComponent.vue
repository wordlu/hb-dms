<template>
  <div>
    home页面-----{{ $store.state.count }}
    <button @click="modifyCount">修改count</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeComponent',
  data() {

  },
  computed: {
    count() {
      return this.$store.state.count;
    }
  },
  methods: {
    modifyCount() {
      this.$store.commit('increment');
      this.$store.commit('increment');
    }
  }
 })
</script>