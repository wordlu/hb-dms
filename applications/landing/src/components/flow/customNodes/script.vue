<script setup>
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  sourcePosition:{
    type: String,
    required: true
  },
})

</script>

<template>
  <div class="flow-icon-script">
    
    <!-- <img :src="data.pattern" alt="" style="width:44px;height:44px" v-if="data.pattern"> -->
    <!-- <object
      v-if="data.pattern"
      :data="data.pattern" 
      width="44" 
      height="44"
    /> -->
  </div>
  <div>
    {{ sourcePosition }}
  </div>
  <Handle id="Left" :type="data.position_left" v-if="data.position_left" :position="Position.Left" />
  
  <Handle id="Right" :type="data.position_right" v-if="data.position_right" :position="Position.Right" />
</template>
