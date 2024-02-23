<template>
  <div class="logsContainer">
    <div class="header">
      <span class="Time-Line">Time Line</span>

      <!-- <div class="Time-Line-Set">
        <svg-icon icon-class="projectInfoLogsSet" class="projectInfoLogsSet" style="width:16px;height:4px"/>
      </div> -->
      
    </div>
    <div class="logs-list">
      <div class="logs-item" v-for="(item,index) in logsList" :key="index"> 
        <div class="operator">
          <div class="log-label"> 
            <svg-icon icon-class="projectInfoLogsOperator" class="projectInfoLogsOperator" style="width:24px;height:24px"/>
            <span class="log-label-name">{{ item.name }}</span>
          </div>
          <div class="log-time">
            {{ formatter(item.created,"yyyy-MM-dd hh:mm:ss") }}
          </div>
        </div>
        <div class="log-content">
          {{ item.description }}
        </div>
        <div class="log-comment">
          <div class="color-box"></div>
          <span>
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      logsList:[
        {
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        },{
          label:"#FullName#",
          dateTime:'12:24',
          content:"君不见，黄河之水天上来，奔流到海不复回。君不见，高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。"
        }
      ]
    }
  },
  created(){
    this.getActions()
  },
  methods:{
    getActions(){
      this.$api['findAll']('actions',{project:this.$route.params.id,sort:'-created'}).then(res=>{
        this.logsList = res.data
      })
    },
    formatter(thistime, fmt) {
      if (!thistime) return '--'
      const isUTC = thistime.indexOf('Z') > -1 ? 'UTC' : ''
      let $this = new Date(thistime)
      let o = {
        'M+': $this[`get${isUTC}Month`]() + 1,
        'd+': $this[`get${isUTC}Date`](),
        'h+': $this[`get${isUTC}Hours`](),
        'm+': $this[`get${isUTC}Minutes`](),
        's+': $this[`get${isUTC}Seconds`](),
        'q+': Math.floor(($this[`get${isUTC}Month`]() + 3) / 3),
        'S': $this[`get${isUTC}Milliseconds`]()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this[`get${isUTC}FullYear`]() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
  }
}
</script>

<style lang="scss">
.logsContainer{
  width: 23%;
  height: 100%;
  padding: 16px 0px;
  background: #FCFCFD;
  border-radius: 16px;
  .header{
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    .Time-Line{
      font-family: 'Noto Sans SC';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      /* identical to box height, or 140% */

      /* 01 Netural/N700 */
      color: #2D2F39;
    }
    .Time-Line-Set{
      width: 24px;
      height: 24px;
      border: 1px solid #E1E3EB;
      cursor:pointer;
      border-radius: 4px;
      line-height: 10px;
      text-align: center;
    }
    .Time-Line-Set:hover{
      background: #D9D9D9;
    }
  }
  .logs-list{
    width: 100%;
    height: calc(100% - 24px);
    padding: 28px 24px;
    overflow: auto;
    .logs-item{
      .operator{
        display: flex;
        justify-content: space-between;
        .log-label{
          display: flex;
          align-items: center;
          .log-label-name{
            font-family: 'Noto Sans SC';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            /* identical to box height, or 150% */


            /* 01 Netural/N700 */

            color: #2D2F39;
            margin-left: 4px;
          }
        }
        .log-time{
          /* General/text-md/I-EL-Regular */

          font-family: 'Poppins';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */

          text-align: right;

          /* 01 Netural/N300 */

          color: #8D91A5;
        }
      }
      .log-content{
        width: 246px;
        margin-top: 8px;
        margin-left: 8px;
        border-right: 1px solid #F3F4F7;
        padding: 0 19px;

        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        /* or 157% */
        /* 01 Netural/N300 */
        color: #8D91A5;
        /* Inside auto layout */
        flex: none;
        order: 0;
        flex-grow: 0;
      }
      .log-comment{
        display: flex;
        width: 151px;
        margin-left: 27px;
        margin-top: 4px;
        background: #F3F4F7;
        border-radius: 4px;
        margin-bottom: 48px;
        .color-box{
          /* 01 Netural/N080 */

          background: #E1E3EB;
          border-radius: 4px;

          width: 20px;
          height: 20px;

          margin: 2px;
        }

        span{
          margin-left: 6px;
          /* General/text-md/I-EL-Regular */

          font-family: 'Poppins';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */


          /* 01 Netural/N300 */

          color: #8D91A5;
        }
      }
    }
  }
}
</style>