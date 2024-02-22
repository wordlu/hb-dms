<template>
  <div id="addData">
    <el-dialog
      v-dialogDrag
      :title="$t(`common['数据详情']`)"
      v-loading="loading"
      :visible.sync="showDetailVisible"
      width="480px"
      :before-close="() => this.$emit('closeShowDetailDialog')">
      <span>
        <el-form :model="activeRow" ref="ruleForm" size="mini" label-width="100px" class="demo-ruleForm">
          <el-form-item label="数据集名称:" prop="name">
            {{ activeRow.name }}
          </el-form-item>
          <el-form-item :label="$t(`common['连接器类型']`) + ':'">
            {{ activeConnectorCategory }}
          </el-form-item>
          <el-form-item :label="$t(`common['连接器名称']`) + ':'" prop="connector">
            {{ formatterConnector(activeRow.connector) }}
          </el-form-item>
          <el-form-item :label="$t(`common['数据位置']`) + ':'" prop="prefix">
            {{ activeRow.prefix }}
          </el-form-item>
          <el-form-item :label="$t(`common['数据类型']`) + ':'" prop="category">
            {{ activeRow.category }}
          </el-form-item>
          <el-form-item :label="$t(`common['数据大小']`) + ':'" prop="size">
            -
            <!-- {{ byteToTB(activeRow.size) }} -->
          </el-form-item>
          <el-form-item :label="$t(`common['创建时间']`) + ':'" prop="created">
            {{formatter(activeRow.created, "yyyy-MM-dd hh:mm:ss")}}
          </el-form-item>
          <el-form-item :label="$t(`common['数据集tag标']`) + ':'" prop="tags">
            <tags :icons="filterTags(activeRow.tags)" style="width:240px"/>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="() => this.$emit('closeShowDetailDialog')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addTagsVue from '../tags/addTags.vue';
import addConnector from './addConnector.vue';
import fileManager from '@/components/fileManager/fileManager.vue'
import tags from '@/components/tags/tags.vue'
export default {
  components:{
    tags , addTagsVue , addConnector , fileManager
  },
  props:{
    showDetailVisible:Boolean,
    activeRow: Object,
    iconsall:Array,
  },
  data() {
    return {
      loading: true,
      ruleForm: {
        name: '',
        project: this.$route.params.id,
        connector: '',
        tags: [],
        prefix: '',
        category: '',
      },
      connectorconfigs:[],
      connectors:[],
      activeConnectorCategory:'',
      activeConnectorConnecttype:''
    };
  },
  watch:{
  },
  created(){
    this.getConnectorConfig()
  },
  methods:{
    filterTags(tags){
      let tagsArr = []
      let iconsall = this.iconsall;
      for(let i=0;i<tags.length;i++){
        for(let j=0;j<iconsall.length;j++){
          if(iconsall[j].id == tags[i]){
            tagsArr.push(iconsall[j])
          }
        }
      }
      return tagsArr;
    },  
    formatterConnector(value) {
      const connetData = this.connectorconfigs.filter(item => item.connectors.filter(it => it.id === value)[0])[0]
      if (connetData) {
        const data = connetData.connectors.filter(it => it.id === value)[0]
        this.activeConnectorCategory = connetData.category
        return data.name
      }
      return ''
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

    byteToTB(e){
        let byte = e
        if(byte > 0){
            let kb = byte / 1024
            if(kb >= 1024){
                let mb = kb / 1024
                if(mb >= 1024){
                    let gb = mb / 1024
                    if(gb >= 1024){
                      let tb = gb / 1024
                      return tb.toFixed(1) + 'TB'
                    }else{
                      return gb = gb.toFixed(1)+'GB'
                    }
                }else{
                    return mb = mb.toFixed(1)+'MB'
                }
            }else{
                return kb = kb.toFixed(1)+'KB'
            }
        }else{
            return '0KB'
        }
    },
    getConnectorConfig(){
      this.$api['findAll']('connectors').then(res=>{
        this.connectors = res.data
        this.connectorconfigs = []
        this.$api['findAll']('connectorconfigs').then(res=>{
          for(let i=0;i<res.data.length;i++){
            if(this.connectorconfigs.length == 0){
              this.connectorconfigs.push({
                category:res.data[i].category,
                params:res.data[i].params,
                connectors:this.filterConnectors(res.data[i].category)
              })
              this.ruleForm.connector = this.connectorconfigs[0].connectors[0].id
              this.ruleForm.prefix = this.connectorconfigs[0].connectors[0].params.path
            }else{
              let hasItem = false
              for(let j=0;j<this.connectorconfigs.length;j++){
                if(res.data[i].category == this.connectorconfigs[j].category){
                  this.connectorconfigs[j].params.push(res.data[i].params[0])
                  hasItem = true
                }
              }
              if(!hasItem){
                this.connectorconfigs.push({
                  category:res.data[i].category,
                  params:res.data[i].params,
                  connectors:this.filterConnectors(res.data[i].category)
                })
              }
            }
          }
          console.log(this.connectorconfigs,'this.connectorconfigs')
          this.activeConnectorCategory = this.connectorconfigs[0].category
          this.loading = false;
        })
      })
    },
    filterConnectors(configCategory){
      let connectors = []
      for(let k=0;k<this.connectors.length;k++){
        if(configCategory == this.connectors[k].category) {
          connectors.push(this.connectors[k])
        }
      }
      return connectors;
    },
    handleClose(){
      this.$confirm('确认关闭？')
        .then(_ => {
          this.addDataProps.dialogVisible = false
        })
        .catch(_ => {});
    },
  }
}
</script>

<style lang="scss">
.tagsFromBtn{
  display: flex;
}
.el-message-box{
    .el-button--primary{
      background-color:#FF7900!important;
      border-color: #FF7900!important;
    }
  }
#addData{
  .el-dialog__body{
    .el-button--primary{
      color:#FF7900;
      border-color: #FF7900;
      background: #ffffff;
    }
    .el-button--primary:hover{
      background-color: rgba($color: #FF7900, $alpha: .1);
    }
  }
  
  .el-dialog__title{
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    color: #313235;
  }
  .el-form-item__label{
    color: #8D91A5;
    font-family: 'Noto Sans SC';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
  }

  .el-radio__input.is-checked .el-radio__inner{
    border-color: #884DFF;
    background: #884DFF;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color:#2D2F39
  }
  .dialog-footer{
    .el-button--primary{
      background-color:#FF7900;
      border-color: #FF7900;
    }
  }
  .el-dialog{
    border-radius: 12px;
  }
}
</style>