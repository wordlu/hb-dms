<script setup>
import { VueFlow, useVueFlow , MarkerType, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import './lib/flow.css'
import { func_flow_adapter } from '@/api/flow'
import { ElNotification } from 'element-plus'

// customNodes
import taskNode from './customNodes/script.vue'
import inputNode from './customNodes/input.vue'
import outputNode from './customNodes/output.vue'

import jsCookie from 'js-cookie'

import { ref , watch} from 'vue'

const emit = defineEmits(["setClickNode"])

const { onConnect, addEdges } = useVueFlow()
let elements = ref();
let nodes_info=ref({});
let statusLegend = ref([
  {
    lable:'已完成',
    color:'#75D410'
  },
  {
    lable:'失败',
    color:'#FF3535'
  },
  {
    lable:'运行中',
    color:'#1392ED'
  },
  {
    lable:'等待',
    color:'#ffde00'
  }
])
let data;
const LineType = {
  marker_type_arrow:MarkerType.Arrow,
  position_right:Position.Right,
  position_left:Position.Left
}

const props = defineProps({
  clickNodeId: {
    type: String,
    required: true,
  },
  clickDataSetName: {
    type: String,
    required: true,
  },
  isRuning:{
    type: Boolean,
    required: true,
  },
  pollingNum:{
    type: Number,
    required: true,
  },
  execution:{
    type: String,
    required: true,
  },
  isStop:{
    type: Boolean,
    required: true,
  }
})

let faileds = []

watch(()=>props.isRuning,(newValue)=>{
  if(!newValue){
    faileds = []
  }
})

watch(() => props.clickDataSetName, (newValue, oldValue) => {
  data.forEach((item,index) => {
    if(item.id == props.clickNodeId){
      data[index].data.text = newValue;
    }
  });
  elements.value = data;
  onConnect((params) => addEdges(params));
},{ deep: true })

watch(() => props.pollingNum,(newValue, oldValue)=>{
  getFlowAdapter()
},{ deep: true })

getFlowAdapter()

function getFlowAdapter(){
  func_flow_adapter({
    flow:jsCookie.get('flowId'),
    execution:props.execution
  }).then(res=>{
    data = res.data.node_adapter
    nodes_info.value = res.data.nodes_info;
    for(let i=0;i<data.length;i++){
      if(data[i].type == 'task'){
        if(!data[i].data){
          data[i].data = {};
        }
        data[i].data.pattern = '/'+data[i].pattern;
        data[i].data.title = data[i].title;
        if(!props.isStop){
          const { status,status_class } = setStatus(res.data.nodes_info,data[i].id)
          data[i].data.status = status
          data[i].data.status_class = status_class
        }
      }
      if(data[i].type == 'input'){
        if(!data[i].data){
          data[i].data = {};
        }
        data[i].type = 'inputCustom';
        if(props.isRuning){
          const { dataSetName } = getDataSetname(res.data.nodes_info,data[i].id)
          data[i].data.text = dataSetName
        }else{
          data[i].data.text = data[i].name ? data[i].name + '：点击选择数据集' : '点击选择数据集'
        }
      }
      if(data[i].type == 'output'){
        data[i].type = 'outputCustom';
      }
      if(data[i].hasOwnProperty('sourcePosition')){
        data[i].sourcePosition = LineType[data[i].sourcePosition];
      }
      if(data[i].hasOwnProperty('targetPosition')){
        data[i].targetPosition = LineType[data[i].targetPosition];
      }
      if(!data[i].hasOwnProperty('type')){
        data[i].type = '';
        if(props.isRuning){
          const { color,animated } = setLineStroke(data[i].id,nodes_info.value);
          data[i].animated=animated
          data[i].style={ stroke: color }
        }
      }
      if(data[i].hasOwnProperty('markerEnd')){
        data[i].markerEnd = LineType[data[i].markerEnd];
      }
      if(data[i].data && data[i].data.hasOwnProperty('left')){
        data[i].data.position_left = data[i].data.left;
      }
      if(data[i].data && data[i].data.hasOwnProperty('right')){
        data[i].data.position_right = data[i].data.right;
      }
    }

    elements.value = data
    onConnect((params) => addEdges(params))
  })
}

function nodeClick({connectedEdges,event,node}) {
  emit("setClickNode",{},node)
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

function setLineStroke(id,info){
  let arr = id.split('-')
  if(info[arr[1]]){
    if(info[arr[1]].task.status == 'success'){
      return {
        color:'green',
        animated:false
      }
    }else if(info[arr[1]].task.status == 'failed'){
      console.log(info[arr[1]],'info[arr[1]]')
      let hasTask = faileds.filter((item)=>{
        return info[arr[1]].params.title == item
      })
      if(hasTask.length == 0){
        faileds.push(info[arr[1]].params.title)
        ElNotification({
          title: `${info[arr[1]].params.title} 执行失败`,
          dangerouslyUseHTMLString: true,
          message: '<strong>点击按钮查看详情</strong>',
          type: 'error',
          duration:100000,
          position:'bottom-right',
          onClick(){
            window.history.pushState(null,'',`/project/projectFlowHistory/${jsCookie.get('flowId')}`)
          }
        })
      }
      
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
        color:null,
        animated:false
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
        <div :class="`flowScript-task script-def`" v-if="isStop">
          <el-tooltip :content="data.title" effect="customized">
            <svg-icon :icon-class="data.title" :class="`flowScript script-def`" style="width:44px;height:44px;"/>
          </el-tooltip>
        </div>

        <div :class="`flowScript-task ${data.status_class}`" v-else>
          <el-tooltip :content="data.title" effect="customized">
            <svg-icon :icon-class="data.title" :class="`flowScript ${data.status_class}`" style="width:44px;height:44px;"/>
          </el-tooltip>
        </div>

        <taskNode :data="data"/>
      </template>

      <template #node-inputCustom="{ data , sourcePosition  }">
        <div class="node-text">
          {{ data.text }}
        </div>
        <inputNode :sourcePosition="sourcePosition" :data="data"/>
      </template>

      <template #node-outputCustom="{ data , sourcePosition }">
        <outputNode :sourcePosition="sourcePosition" :data="data"/>
      </template>
      <MiniMap />

      <Controls />
    </VueFlow>

    <div class="legend">
      <div class="legend-item" v-for="(item,index) in statusLegend" :key="index">
        <div class="legend-item-color" :style="{background:item.color}"></div>
        {{ item.lable }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .el-notification{
    right: 350px!important;
    cursor: pointer;
  }
  #flowView{
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-transform: uppercase;
    position: relative;
    .vue-flow__minimap {
      transform: scale(75%);
      transform-origin: bottom right;
    }
    
    .node-text{
      width: 120px;
      position: absolute;
      bottom: -55px;
      left: 50%;
      z-index: 999;
      text-align: center;
      margin-left: -60px;

      font-family: 'Noto Sans SC';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 28px;
      color: #FF7900;
    }
  }

  .legend{
    position: absolute;
    padding: 8px;
    border-radius: 12px;
    overflow: hidden;
    width: 155px;
    background: rgba($color: #ece9e9, $alpha: .7);
    right: 350px;
    bottom: 15px;
    .legend-item{
      display: flex;
      padding: 2px 25px;
      font-size: 12px;
      align-items: center;
      .legend-item-color{
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
  }

  .el-popper.is-customized {
    /* Set padding to ensure the height is 32px */
    padding: 6px 12px;
    background: linear-gradient(90deg, rgba(243, 134, 9, 0.8), rgba(243, 134, 9,.8));
    color: aliceblue;
  }

  .el-popper.is-customized .el-popper__arrow::before {
    background: linear-gradient(45deg, rgba(243, 134, 9, 0.8), rgba(243, 134, 9, 0.8));
    right: 0;
    color: aliceblue;
  }
</style>