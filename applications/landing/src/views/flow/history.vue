<template>
  <div id="flowHistory">
    <div class="left">
      <div class="left-top">
        <historyFlow :pollingNum="pollingNum" :execution="execution" @setClickNode="getClickNode" @dataSetName="setDataSetName"/>
        <div class="legend">
          <div class="legend-item" v-for="(item,index) in statusLegend" :key="index">
            <div class="legend-item-color" :style="{background:item.color}"></div>
            {{ item.lable }}
          </div>
        </div>
      </div>
      <div class="resize" id="resize"></div>
      <div class="left-bot" id="bot-div">
        <algoDetail :data="clickNode.execution_params" />
        <historyLog :data="logData" />
      </div>
    </div>
    <div class="right">
      <historyList 
        :data="historyData" 
        :loading="historyloading" 
        :noMore="historyNomore" 
        @item-click="getLog" 
        :selectedId="selectedId"
        @setSelectedId="getSelectedId"
        @loadMore="getHistory" />
    </div>
  </div>
</template>

<script setup>
import { nextTick , onUpdated } from 'vue'
onUpdated(()=>{
  nextTick(()=>{
    const resize = document.querySelector('#resize');
    const botDiv = document.querySelector('#bot-div');
    const pageH = document.documentElement.clientHeight;
    // 鼠标按下事件
    resize.onmousedown = function (e) {
      const startY = e.clientY;
      resize.top = resize.offsetTop;
      // 鼠标拖动事件
      document.onmousemove = function (e) {
        let height = pageH - e.clientY;
        if (height < 100) {
          height = 100;
        }
        botDiv.style.height = height + 'px';
      };
      // 鼠标松开事件
      document.onmouseup = function (evt) {
        document.onmousemove = null; 
        document.onmouseup = null;
        resize.releaseCapture && resize.releaseCapture();
      };
      resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
      return false;
    };
  })
})
</script>
<script>

import historyList from '@/components/flow/historyList.vue';
import algoDetail from '@/components/flow/algoDetail.vue';
import historyLog from '@/components/flow/historyLog.vue';
import historyFlow from '@/components/flow/historyFlow.vue';
import jsCookie from 'js-cookie'

import { fetchFlowHistory, fetchFlowLog , fetchFlowstatus } from '@/api/flow';

export default {
  components: { historyList, algoDetail, historyLog , historyFlow },
  data() {
    this.flowId = ''
    return {
      dataSetName:'',//从子组件 historyFlow获取 dataSetName
      historyData: [],
      selectedLog: {
        name: '算法标题-算法1',
        status: 'success',
        params: [{key: 'key1', placeholder: 'placeholder1'}, {key: 'key2', placeholder: 'placeholder2'}]
      },
      logData: '',
      historyPage: 0, // 历史数据当前页码
      historyloading: false, // 历史数据是否正在加载
      historyNomore: false, // 历史数据是否全部到底
      timer:null,
      runids:[],
      runid:null,
      execution:'',
      clickNode:{},
      activeDag:{},
      selectedId:'',
      pollingNum:0,
      statusLegend:[
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
      ]
    }
  },
  created() {
    this.flowId = this.$route.params.id
  },
  methods: {  
    setDataSetName(val){
      //flow 传值到场景库搜索
      this.dataSetName = val;
    },
    toAppPage(application_id){
      this.$api['findItem']('applications',application_id).then(res=>{
        // this.$router.push(`${res.attributes.path}${jsCookie.get('projectId')}`)
         //flow 传dataSetName值到场景库搜索
        this.$router.push({
          path:`${res.attributes.path}${jsCookie.get('projectId')}`,
          query: {
            dataSetName:this.dataSetName
          }
        });
      })
    },
    async getClickNode(info,node){
      if(node.type == 'outputCustom'){
        if(this.activeDag.status == 'success'){
          this.toAppPage(info.application)
        }else if(this.activeDag.status == 'failed'){
          
        }
        return;
      }
      await fetchFlowstatus({
        dagname:this.activeDag.dagname,
        runid:this.activeDag.runid,
        taskname:info.taskname
      }).then(res=>{
        for(let i=0;i<res.data.length;i++){
          if(res.data[i].attributes.taskname == info.taskname){
            if(!info.execution_params){
              info.execution_params = {}
            }
            info.execution_params.status = res.data[i].attributes.status;
          }
        }
      })
      this.clickNode = info
      this.getLog(this.activeDag)
    },
    getHistory(){
      this.historyloading = true
      this.historyPage++
      const query = {
        offset: (this.historyPage - 1) * 10,
        limit: 10
      }
      fetchFlowHistory({ page: query, flow: this.flowId }).then(res=>{
        const list = (res.data || []).map(i => i.attributes)
        this.historyData = this.historyData.concat(list)
        this.historyloading = false
        if(this.historyData.length !== 0){
          this.execution = this.historyData[0]['_id']
          if(this.historyData.length < 10){
            this.historyNomore = true
          }
          if (!res.data?.length) {
            this.historyNomore = true
          }
          for(let i=0;i<this.historyData.length;i++){
            if(this.historyData[i].status == 'running'){
              this.runids.push(this.historyData[i].runid)
            }
          }
          this.activeDag = this.historyData[0]
          this.selectedId = this.activeDag._id
          this.updateStatus()
        }else{
          this.historyNomore = true
        }
        this.showFlow = true
      })
    },
    getSelectedId(id,runid,item){
      this.activeDag = item
      this.selectedId = id
      this.execution = id
      this.logData = null
      this.clickNode = {}
    },
    getLog(item) {
      this.activeDag = item
      fetchFlowLog({ dagname: item.dagname, runid: item.runid, taskname: this.clickNode.task.taskname }).then(res=>{
        this.logData = res.data
      })
      // const xhr = new XMLHttpRequest();
      // xhr.open("GET", '?dagname=hello_dag&runid=lyctest-003&taskname=end');
      // xhr.responseType = 'json'
      // xhr.send()
      // xhr.onload = (res) => {
      //   console.log(xhr.response)
      //   // this.historyData = (xhr.response.data || []).map(i => i.attributes)
      //   // console.log(this.historyData)
      // }
    },
    dragResize() {
      const resize = document.querySelector('#resize');
      const botDiv = document.querySelector('#bot-div')
      const pageH = document.documentElement.clientHeight
      // 鼠标按下事件
      resize.onmousedown = function (e) {
        console.log(pageH - e.clientY)
        const startY = e.clientY;
        resize.top = resize.offsetTop;
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          let height = pageH - e.clientY;
          console.log(height)
          if (height < 100) {
            height = 100
          }
          botDiv.style.height = height + 'px'
        };
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          document.onmousemove = null; 
          document.onmouseup = null;
          resize.releaseCapture && resize.releaseCapture();
        };
        resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false;
      };
    },
    polling(){
      if(this.runids.length>0){
        this.pollingNum++
        this.timer = setTimeout(()=>{
          fetchFlowHistory({runids:this.runids.toString()}).then(res=>{
            let data = (res.data || []).map(i => i.attributes)
            let hasRunning = false
            for(let i=0;i<this.historyData.length;i++){
              if(this.historyData[i].status == 'running'){
                hasRunning = true
              }
              for(let j=0;j<data.length;j++){
                if(this.historyData[i].runid == data[j].runid){
                  this.historyData[i].status = data[j].status
                }
              }
            }
            if(hasRunning){
              this.updateStatus()
            }
          })
        },3000)
      }
    },
    updateStatus(){
      fetchFlowstatus({
        dagname:this.activeDag.dagname,
        runid:this.activeDag.runid
      }).then(res=>{
        this.polling()
      })
    }
  },
  beforeDestrioy(){
    console.log('销毁前')
  }
}
</script>

<style scoped lang="scss">
#flowHistory {
  height: 100%;
  display: flex;
  background-color: #f3f4f7;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    &-top {
      height: 320px;
      flex: 1;
    }
    &-bot {
      height: 320px;
      display: flex;
      background: #ffffff;
      // height: 100%;
      padding: 24px;
      display: flex;
      font-family: 'PingFang SC';
      color: #2D2F39;
    }
    .resize {
      height: 6px;
      background-color: #ffffff;
      cursor: row-resize;
    }
  }
  .right {
    width: 320px;
  }

  .left-top{
    position: relative;
    .legend{
      position: absolute;
      padding: 8px;
      border-radius: 12px;
      overflow: hidden;
      width: 155px;
      background: rgba($color: #ece9e9, $alpha: .7);
      right: 15px;
      bottom: 150px;
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
  }
}
</style>

<style lang="scss">
.run-status {
  display: inline-block;
  box-sizing: border-box;
  font-size: 24px;
  line-height: 38px;
  border-radius: 8px;
  width: 104px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  transform: scale(0.5);
  &.success {
    color: #15B881;
    background: rgba(21, 184, 129, 0.12);
    border-color: #50BBAE;
  }
  &.running {
    color: #FF7900;
    background: rgba(255, 146, 51, 0.12);;
    border-color: #FF7900;
  }
  &.failed {
    color: #EB4747;
    background: rgba(235, 71, 71, 0.12);;
    border-color: #EB4747;
  }
  &.queued {
    color:#ffdd00;
    background: rgba(255, 222, 0, 0.12);;
    border-color: #ffdd00;
  }
}
</style>