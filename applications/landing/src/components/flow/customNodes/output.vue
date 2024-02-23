<script setup>
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

</script>

<template>
  <div class="flow-icon-output">
    <svg-icon icon-class="flowInput" class="flowInput" style="width:44px;height:44px"/>
  </div>
  <div>
    
  </div>
  <Handle id="Left" :type="data.position_left" :position="Position.Left" />
  
  <!-- <Handle id="Right" :type="data.position_right" :position="Position.Right" /> -->
</template>
