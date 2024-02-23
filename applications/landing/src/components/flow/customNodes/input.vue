<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref , watch } from 'vue'
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})


watch(() => props.data, (newValue, oldValue) => {
  console.log(newValue,'props.text')
  // data.value = newValue
},{ deep: true })

</script>

<template>
  <div class="flow-icon-input">
    <svg-icon icon-class="flowInput" class="flowInput" style="width:44px;height:44px"/>
<!--     
    <div class="node-text">
      {{ data.text }}
    </div> -->
  </div>
  <div>
    
  </div>
  <!-- <Handle id="Left" :type="data.position_left" :position="Position.Left" /> -->
  
  <Handle id="Right" :type="data.position_right" :position="Position.Right" />
</template>
