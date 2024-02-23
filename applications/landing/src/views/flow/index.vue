<template>
  <div id="flow">
    <flowView :execution="execution" :isStop="isStop" :isRuning="isRuning" :pollingNum="pollingNum" @setClickNode="getClickNode" :clickNodeId="clickNodeId" :clickDataSetName="clickDataSetName"/>
    <params :execParams="execParams" :isRuning="isRuning" @run="updateParams" @stop="stopRuning"  :switchClick="switchClick"/>
    <dataSet v-if="showDataSet" @handler="setDataSet" />
  </div>
</template>

<script>
import { onBeforeUnmount , setup } from 'vue'
import params from '@/components/flow/params.vue'
import { fetchFlowExecute , updateFlowExecute , stopFlowExecute , fetchFlowHistory , fetchFlowstatus } from '@/api/flow'
import flowView from '@/components/flow/flowView.vue';
import jsCookie from 'js-cookie';
import dataSet from '@/components/flow/dataSet/index.vue'
import { ElMessageBox } from 'element-plus'

let timer = null
let isUnmount = false

export default {
  components: {
    params,flowView,dataSet
  },
  data() {
    this.flowId = ''
    this.runResult = {}
    return {
      execParams: {},
      isRuning: false, // 是否在运行中
      isStop:true,
      showDataSet: false, // 是否显示选择数据集组件
      clickNodeId: null,
      clickDataSetName: null,
      clickDataSetId: null,
      activeRunId:null,
      pollingNum:0,
      dagName:null,
      execution:'',
      isUnmount:false,
      switchClick: true,
      nodeDatasetArray: []
    }
  },
  created() {
    this.getParams()
    isUnmount = false
  },
  methods: {
    async getClickNode(info,node){
      if (node.type === 'inputCustom') {
        this.clickNodeId = node.id
        this.showDataSet = true
      }
    },
    // 获取参数模板
    getParams() {
      this.flowId = jsCookie.get('flowId')
      fetchFlowExecute({ flow: this.flowId, get_parameters: 1 }).then(res=> {
        this.execParams = res.data
      })
    },
    // 选择数据集弹窗点击取消/确定
    setDataSet(isSave, dataSet) {
      if (isSave) {
        this.clickDataSetName = dataSet.name;
        this.clickDataSetId = dataSet.id;
        //当前节点已经选过ds
        if (this.nodeDatasetArray.filter(it => it.clickNodeId === this.clickNodeId)[0]) {
          this.nodeDatasetArray = this.nodeDatasetArray.filter(it => it.clickNodeId !== this.clickNodeId)
        }
        this.nodeDatasetArray.push({
          clickNodeId: this.clickNodeId,
          clickDataSetName: this.clickDataSetName,
          clickDataSetId: this.clickDataSetId
        })
      }
      this.showDataSet = false;
    },
    // 点击运行,更新算法参数
    updateParams(params) {
      this.switchClick = false
      const input_node_datasets_array = this.nodeDatasetArray.map(it => {
        return {'node': it.clickNodeId, 'dataset': it.clickDataSetId}
      })
      if(this.clickDataSetId){
        const postData = {
          flow: this.flowId,
          owner: jsCookie.get('account'),
          parameters: params,
          // input_node_datasets: [{'node': this.clickNodeId, 'dataset': this.clickDataSetId}]
          input_node_datasets: input_node_datasets_array
        }
        updateFlowExecute(postData).then(res => {
          this.runResult = res.data.attributes || {}
          if (this.runResult.runid) {
            this.isRuning = true
            this.isStop = false
            this.switchClick = true
            this.activeRunId = res.data.attributes.runid
            this.dagName = res.data.attributes.dagname
            this.execution = res.data.id
            this.updateStatus()
          }
        }).catch(err => {
          ElMessageBox.alert('启动失败！', '操作提示', { confirmButtonText: 'OK' })
        })
      }else{
        ElMessageBox.alert('未指定数据集', '操作提示', { confirmButtonText: 'OK' })
        this.switchClick = true
      }
    },
    // 点击停止运行
    stopRuning() {
      const { runid, dagname } = this.runResult
      stopFlowExecute({ runid, dagname, state: "failed"}).then(res => {
        this.isRuning = false
      })
    },
    polling(){
      if(this.activeRunId && !isUnmount){
        this.pollingNum++;
        timer = setTimeout(()=>{
          fetchFlowHistory({runids:this.activeRunId}).then(res=>{
            let data = (res.data || []).map(i => i.attributes)
            if(data[0].status == 'failed'){
              ElMessageBox.confirm('运行失败，请前往历史界面查看具体详情', 'Warning', { confirmButtonText: '前往历史记录',cancelButtonText: '取消',type: 'warning' }).then(() => {
                this.$router.push(`/project/projectFlowHistory/${jsCookie.get('flowId')}`)
              }).catch(() => {})
              this.isRuning = false
            }else if(data[0].status == 'success'){
              ElMessageBox.confirm('运行成功，请前往历史界面查看具体详情', 'Success', { confirmButtonText: '前往历史记录',cancelButtonText: '取消',type: 'success' }).then(() => {
                this.$router.push(`/project/projectFlowHistory/${jsCookie.get('flowId')}`)
              }).catch(() => {})
              this.isRuning = false
              this.activeRunId = null
              this.dagName = null
              this.execution = ''
            }else{
              this.updateStatus()
            }
          })
        },3000)
      }
    },
    updateStatus(){
      console.log(isUnmount,'isUnmount')
      fetchFlowstatus({
        dagname:this.dagName,
        runid:this.activeRunId
      }).then(res=>{
        this.polling()
      })
    }
  },
  setup(){
    onBeforeUnmount(()=>{
      isUnmount = true;
      clearTimeout(timer)
      timer = null
    })
  }
}

</script>

<style scoped lang="scss">
#flow {
  position: relative;
  background-color: #f3f4f7;
  height: 100%;
}
</style>