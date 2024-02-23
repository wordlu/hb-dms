<script setup>
import { VueFlow, useVueFlow , MarkerType, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import './lib/flow.css'
import { func_flow_adapter } from '@/api/flow'

// customNodes
import taskNode from './customNodes/script.vue'
import inputNode from './customNodes/input.vue'
import outputNode from './customNodes/output.vue'

import jsCookie from 'js-cookie'

import { getCurrentInstance , watch , ref } from 'vue'

const props = defineProps({
  execution: {
    type: String,
    required: true,
  },
  pollingNum:{
    type: Number,
    required: true,
  }
})

const emit = defineEmits(["setClickNode"])
const { onConnect, addEdges } = useVueFlow()
let elements = ref();
let nodes_info=ref({});
let click_node=ref()
const LineType = {
  marker_type_arrow:MarkerType.Arrow,
  position_right:Position.Right,
  position_left:Position.Left
}

watch(()=>props.execution,(newValue)=>{
  if(newValue){
    getFlowAdapter()
  }
})


watch(()=>props.pollingNum,(newValue)=>{
  getFlowAdapter()
})

function getFlowAdapter(){
  func_flow_adapter({
    flow:jsCookie.get('flowId'),
    execution:props.execution
  }).then(res=>{
    let data = res.data.node_adapter;
    nodes_info.value = res.data.nodes_info;
    console.log(data,nodes_info.value,'data')
    for(let i=0;i<data.length;i++){
      if(data[i].type == 'task'){
        data[i].data.pattern = '/'+data[i].pattern
        data[i].data.title = data[i].title
        const {status,status_class } = setStatus(res.data.nodes_info,data[i].id)
        data[i].data.status = status
        data[i].data.status_class = status_class
      }
      if(data[i].id){
        if(data[i].data){
          data[i].data.id = data[i].id
        }
      }
      

      if(data[i].type == 'input'){
        const { dataSetName } = getDataSetname(res.data.nodes_info,data[i].id)
        // console.log(dataSetName,'输入找输入的场景名称');
        // 传值 用来跳转场景库搜索
        emit('dataSetName',dataSetName);
        data[i].type = 'inputCustom'
        data[i].data.text = dataSetName
      }

      if(data[i].type == 'output'){
        data[i].type = 'outputCustom'
      }
      // data[i].style = {}
      // data[i].style.stroke = 'red'
      // style: { stroke: 'red' }
      if(data[i].hasOwnProperty('sourcePosition')){
        data[i].sourcePosition = LineType[data[i].sourcePosition]
      }
      if(data[i].hasOwnProperty('targetPosition')){
        data[i].targetPosition = LineType[data[i].targetPosition]
      }
      if(!data[i].hasOwnProperty('type')){
        data[i].type = ''
        const { color,animated } = setLineStroke(data[i].id,nodes_info.value);
        data[i].animated=animated
        data[i].style={ stroke: color }
      }
      if(data[i].hasOwnProperty('markerEnd')){
        data[i].markerEnd = LineType[data[i].markerEnd]
      }
      if(data[i].data && data[i].data.hasOwnProperty('left')){
        data[i].data.position_left = data[i].data.left
      }
      if(data[i].data && data[i].data.hasOwnProperty('right')){
        data[i].data.position_right = data[i].data.right
      }
    }
    elements.value = data 
    onConnect((params) => addEdges(params))
  })
}

function nodeClick({connectedEdges,event,node}) {
  click_node.value = node.id;
  for(let key in nodes_info.value){
    if(key == node.id){
      emit("setClickNode", nodes_info.value[key],node)
    }
  }
}

function setLineStroke(id,info){
  let arr = id.split('-')
  if(info[arr[1]]){
    if(info[arr[1]].task.status == 'success'){
      return {
        color:'green',
        animated:false
      }
    }else if(info[arr[1]].task.status == 'failed'){
      return {
        color:'red',
        animated:false
      }
    }else if(info[arr[1]].task.status == 'running'){
      return {
        color:'orange',
        animated:true
      }
    }else{
      return {
        color:"black",
        animated:false
      }
    }
  }
}

function setStatus(info,id){
  for(let key in info){
    if(key == id){
      let status_class;
      if(info[key].task.status == 'no_status'){
        status_class = 'script-queuing'
      }else if(info[key].task.status == 'success'){
        status_class = 'script-Finished'
      }else if(info[key].task.status == 'failed'){
        status_class = 'script-fail'
      }else if(info[key].task.status == 'running'){
        status_class = 'script-running'
      }
      return {
        status:info[key].task.status,
        status_class:status_class
      }
    }
  }
}

function getDataSetname(info,id){
  for(let key in info){
    if(key == id){
      return {
        dataSetName:info[key].execution_params?info[key].execution_params.name:''
      }
    }
  }
}

</script>
<template>
  <div id="flowView">
    <VueFlow
      v-model="elements"
      class="basicflow"
      :default-edge-options="{ type: 'smoothstep' }"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.2"
      :max-zoom="4"
      @node-click="nodeClick" 
      fit-view-on-init 
    >
      <Background pattern-color="#aaa" gap="8" />
    
      <template #node-task="{ data }">
        <div class="node-text">
          {{ data.title }}
        </div>
        <div :class="`flowScript-task ${data.status_class} ${data.id == click_node?'click-node':''}`">
          <el-tooltip :content="data.title" effect="customized">
            <svg-icon :icon-class="data.title" :class="`flowScript ${data.status_class}`" style="width:44px;height:44px;"/>
          </el-tooltip>
          
          <img :src="'/icon/default/task/选中状态.svg'" alt="" v-if="data.id == click_node" style="width:18px;height:18px;" :class="`click-node-svg`">
        </div>
        <taskNode :data="data"/>
      </template>

      <template #node-inputCustom="{ data , sourcePosition }">
        <div class="node-text">
          {{ data.text }}
        </div>
        <inputNode :sourcePosition="sourcePosition" :data="data"/>
      </template>

      <template #node-outputCustom="{ data , sourcePosition }">
        <outputNode :sourcePosition="sourcePosition" :data="data"/>
      </template>

      <!-- <MiniMap /> -->
      <Controls />

    </VueFlow>
  </div>
</template>

<style lang="scss">
  #flowView{
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-transform: uppercase;
    .vue-flow__minimap {
      transform: scale(75%);
      transform-origin: bottom right;
    }

  }
</style>