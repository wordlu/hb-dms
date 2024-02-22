<template>
  <div id="addData">
    <el-dialog
      v-dialogDrag
      title="新增数据集"
      v-loading="loading"
      :visible.sync="addDataProps.dialogVisible"
      width="480px"
      :before-close="handleClose">
      <span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="100px" class="demo-ruleForm">
          <el-form-item label="数据集名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="连接器类型">
            <el-radio-group v-model="activeConnectorCategory" @change="changeActiveConnectorCategory">
              <el-radio v-for="(item,index) in connectorconfigs" :key="index" :label="item.category"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="连接器名称" prop="connector">
            <el-select v-model="ruleForm.connector" placeholder="请选择连接器名称" @change="changeConnector">
              <span v-for="(item,index) in connectorconfigs" :key="index">
                <span v-if="item.category == activeConnectorCategory">
                  <el-option v-for="(connector_item,connector_idx) in item.connectors" :key="connector_idx" :label="connector_item.name" :value="connector_item.id"></el-option>
                </span>
              </span>
            </el-select>
            <el-button type="primary" @click="openAddConnector" icon="el-icon-plus" style="margin-left:10px" size="mini" plain>新增连接器</el-button>
          </el-form-item>
          <el-form-item label="数据位置" prop="prefix">
            <el-input ref="input" v-model="ruleForm.prefix" @focus="getPrefix" @blur="setPrefix"></el-input>
          </el-form-item>
          <el-form-item label="数据类型" prop="category">
            <el-select v-model="ruleForm.category" placeholder="请选择数据类型" >
              <!-- <el-option label="点云" value="pointCloud"></el-option>
              <el-option label="视频" value="video"></el-option>
              <el-option label="bag" value="bag"></el-option>
              <el-option label="二维表" value="2dTable"></el-option> -->
              <el-option v-for="item in dataType" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 新增备注 -->
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请填写备注"
              v-model="ruleForm.description">
            </el-input>
          </el-form-item>
          <el-form-item label="数据集tag标" prop="tags">
            <tags :icons="search.icons" :hasClear="true" @clearTag="clearTag" style="min-height: 34px;width:100%;padding-bottom:2px;margin-bottom:12px;border-bottom:1px solid #dad5d5"/>
            <div class="tagsFromBtn">
              <filterTags 
              :showFilterContent="showFilterContent" 
              :oneClearTag="oneClearTag" 
              :icons="search.icons"
              :reAllTags="reAllTags"
              :categoryStr="'行为交互,环境,道路,车辆'"
              @setAllTags="setAllTags"
              @reFilter="reFilter"
              @setShowFilterContent="setShowFilterContent" />
              <el-button type="primary" @click="openAddtags" icon="el-icon-plus" style="margin-left:10px" size="mini" plain>新增标签</el-button>
            </div>
          </el-form-item>
          <!-- 新增trip相关标签的筛选 -->
          <el-form-item label="自定义标签" prop="tagsTrip">
            <tags :icons="searchTrip.icons" :hasClear="true" @clearTag="clearTagTrip" style="min-height: 34px;width:100%;padding-bottom:2px;margin-bottom:12px;border-bottom:1px solid #dad5d5"/>
            <div class="tagsFromBtn">
              <filterTags 
              :showFilterContent="showFilterContentTrip" 
              :oneClearTag="oneClearTagTrip" 
              :icons="searchTrip.icons"
              :reAllTags="reAllTagsTrip"
              :categoryStr="'trip,项目,批次'"
              @setAllTags="setAllTagsTrip"
              @reFilter="reFilterTrip"
              @setShowFilterContent="setShowFilterContentTrip" />
              <el-button type="primary" @click="openAddtagsTrip" icon="el-icon-plus" style="margin-left:10px" size="mini" plain>新增自定义标签</el-button>
            </div>
          </el-form-item>
        </el-form>
        <fileManager @setPath="getPath" :fileManagerProps="fileManagerProps" v-if="fileManagerProps.dialogVisible" />
        <addTagsVue @setAddTagsInnerVisible="setAddTagsInnerVisible" :innerVisible="addTagsInnerVisible" v-if="addTagsInnerVisible"/>
        <addTripTags @setAddTagsInnerVisible="setAddTagsInnerVisibleTrip" :innerVisible="addTagsInnerVisibleTrip" v-if="addTagsInnerVisibleTrip"/>
        <addConnector :connectorconfigs="connectorconfigs" @closeConnector="closeConnector" @setAddConnectorInnerVisible="setAddConnectorInnerVisible" :innerVisible="addConnectorInnerVisible" v-if="addConnectorInnerVisible"/>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addDataProps.dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addTagsVue from '../tags/addTags.vue';
import addTripTags from '../tags/addTripTags.vue';
import filterTags from '../tags/filterTags.vue';
import tags from '../tags/tags.vue';
import addConnector from './addConnector.vue';
import fileManager from '@/components/fileManager/fileManager.vue';
import { contactMessageBox } from "@/utils/messageBox"
 
export default {
  components:{
    filterTags , tags , addTagsVue , addConnector , fileManager, addTripTags
  },
  props:{
    addDataProps:Object
  },
  data() {
    var validatePrefix = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择数据地址'));
        }
        if (this.connectorObj.connecttype=='本地' && value === this.connectorObj.params.path) {
          callback(new Error('请选择基于连接器的数据地址'));
        } else {
          callback();
        }
      };
    return {
      imgCodeUrl:'http://ca.dms.10.86.46.254.nip.io/icon/default/连接器.svg',
      fileManagerProps:{
        dialogVisible:false,
        path:''
      },
      reAllTags:0,
      oneClearTag:{},
      search:{
        input:'',
        icons:[]
      },
      dataType:[{
        name: '点云',
        value: 'pointCloud'
      }, {
        name: '摄像头视频',
        value: 'cameraVideo'
      }, {
        name: '感知视频',
        value: 'perceptualVideo'
      }, {
        name: 'can',
        value: 'can'
      }, {
        name: '高精惯导',
        value: 'inertialNavigation'
      }, {
        name: '高精地图',
        value: 'map'
      }, {
        name: '自动化标注成果',
        value: 'autoLabeling'
      }, {
        name: '人工标注成果',
        value: 'manualLabeling'
      }],
      addTagsInnerVisible:false,
      addConnectorInnerVisible:false,
      iconsall:[],
      showFilterContent:false,
      // 新增trip相关标签的筛选
      reAllTagsTrip:0,
      oneClearTagTrip:{},
      searchTrip:{
        input:'',
        icons:[]
      },
      addTagsInnerVisibleTrip:false,
      addConnectorInnerVisibleTrip:false,
      iconsallTrip:[],
      showFilterContentTrip:false,

      loading: true,
      ruleForm: {
        name: '',
        project: this.$route.params.id,
        connector: '',
        tags: [],
        prefix: '',
        category: '',
        description:'',
      },
      rules: {
        name: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' }
        ],
        prefix: [
          { required: true,  trigger: 'blur', validator: validatePrefix },
        ],
        connector: [
          { required: true, message: '请选择连接器', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择连接器类型', trigger: 'change' }
        ],
        tags:[
          { type: 'array', required: true, message: '请至少选择一个标签' }
        ]
      },
      connectorconfigs:[],
      connectors:[],
      activeConnectorCategory:'',
      connectorObj:null,
      activeConnectorConnecttype:''
    };
  },
  watch:{
    'search.icons': {
      handler(newVal){
        if (newVal && newVal.length > 0) {
          this.$refs.ruleForm.clearValidate(['tags']);
        }
        this.ruleForm.tags = []
        for(let i=0;i<newVal.length;i++){
          this.ruleForm.tags.push(newVal[i].id)
        }
      },
      deep: true
    },
    'searchTrip.icons': {
      handler(newVal){
        if (newVal && newVal.length > 0) {
          this.$refs.ruleForm.clearValidate(['tagsTrip']);
        }
        this.ruleForm.tagsTrip = []
        for(let i=0;i<newVal.length;i++){
          this.ruleForm.tagsTrip.push(newVal[i].id)
        }
      },
      deep: true
    },
    'ruleForm.prefix': {
      handler(newVal){
        if (newVal && newVal !== "") {
          this.$refs.ruleForm.clearValidate(['prefix']);
        }
      },
      deep: true
    }
  },
  created(){
    this.getConnectorConfig()
  },
  methods:{
    getPath(path){
      this.ruleForm.prefix = path;
      this.$refs.input.blur();
    },
    getPrefix(){
      for(let i=0;i<this.connectorconfigs.length;i++){
        if(this.connectorconfigs[i].category == this.activeConnectorCategory){
          for(let j=0;j<this.connectorconfigs[i].connectors.length;j++){
            if(this.connectorconfigs[i].connectors[j].id == this.ruleForm.connector){
              this.fileManagerProps.dialogVisible = true;
              this.fileManagerProps.path = this.connectorconfigs[i].connectors[j].params.path;
              this.fileManagerProps.connector = this.ruleForm.connector;
            }
          }
        }
      }
    },
    setPrefix(){
      // console.log('监听到了2')
    },
    getConnectorConfig(){
      this.$api['findAll']('connectors', {project:this.$route.params.id}).then(res=>{
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
              if (this.connectorconfigs[0].connectors.length > 0){
                this.ruleForm.connector = this.connectorconfigs[0].connectors[0].id
                this.ruleForm.prefix = this.connectorconfigs[0].connectors[0].params.path
                this.connectorObj = this.connectorconfigs[0].connectors[0]
              }
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
    changeActiveConnectorCategory(){
      for(let i=0;i<this.connectorconfigs.length;i++){
        if(this.connectorconfigs[i].category == this.activeConnectorCategory){
          if(this.connectorconfigs[i].connectors.length == 0){
            this.ruleForm.connector = ''
            this.ruleForm.prefix = ''
          }else{
            this.ruleForm.connector = this.connectorconfigs[i].connectors[0].id
            this.ruleForm.prefix = this.connectorconfigs[i].connectors[0].params.path
            this.connectorObj = this.connectorconfigs[i].connectors[0]
          }
        }
      }
    },
    changeConnector(){
      for(let i=0;i<this.connectorconfigs.length;i++){
        if(this.connectorconfigs[i].category == this.activeConnectorCategory){
          for(let j=0;j<this.connectorconfigs[i].connectors.length;j++){
            if(this.connectorconfigs[i].connectors[j].id == this.ruleForm.connector){
              this.ruleForm.prefix = this.connectorconfigs[i].connectors[j].params.path
              this.connectorObj = this.connectorconfigs[i].connectors[j]
            }
          }
        }
      }
    },
    handleClose(){
      this.$confirm('确认关闭？')
        .then(_ => {
          this.addDataProps.dialogVisible = false
        })
        .catch(_ => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm,'this.ruleForm')
          if (this.connectorObj.connecttype=='本地') {
            this.ruleForm.prefix = this.ruleForm.prefix.replace(this.connectorObj.params.path, '')
          } else if(this.connectorObj.connecttype=='对象存储'){
            this.ruleForm.prefix = this.ruleForm.prefix.charAt(0) == "/" ? this.ruleForm.prefix.substring(1) : this.ruleForm.prefix;  // 兼容s3不需要/开头
          }
          this.ruleForm.tags = this.ruleForm.tags.concat(this.ruleForm.tagsTrip)  // 把trip相关标签与环境标签合并
          console.log(this.ruleForm,'this.ruleForm')
          this.$api['addItem']('datasets',this.ruleForm).then(res=>{
            this.$message({
              message: `名为 ${this.ruleForm.name} 的数据创建成功`,
              type: 'success'
            });

            this.$emit('closeAddDataDom');
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setAllTags(tags){
      this.iconsall = tags
    },
    setShowFilterContent(bool){
      this.showFilterContent = bool
      this.showFilterContentTrip = false
    },
    clearTag(item){
      this.oneClearTag = {}
      this.oneClearTag = item
    },
    reFilter(){
      this.search.icons = []
    },
    openAddtags(){
      const h = this.$createElement;
      contactMessageBox(h, (err) => console.log(err))
    },
    closeConnector(){
      this.addConnectorInnerVisible = false
    },
    openAddConnector(){
      const h = this.$createElement;
      contactMessageBox(h, (err) => console.log(err))
    },
    setAddConnectorInnerVisible(){
      this.addConnectorInnerVisible = false
      this.getConnectorConfig()
    },
    setAddTagsInnerVisible(){
      this.addTagsInnerVisible = false
      this.reAllTags++
    },
    // 新增trip相关标签的筛选
    clearTagTrip(item){
      this.oneClearTagTrip = {}
      this.oneClearTagTrip = item
    },
    reFilterTrip(){
      this.searchTrip.icons = []
    },
    openAddtagsTrip(){
      const h = this.$createElement;
      this.addTagsInnerVisibleTrip = true
    },
    setAllTagsTrip(tags){
      this.iconsallTrip = tags
    },
    setShowFilterContentTrip(bool){
      this.showFilterContentTrip = bool
      this.showFilterContent = false  // 两个filter框不同时显示
    },
    setAddTagsInnerVisibleTrip(){
      this.addTagsInnerVisibleTrip = false
      this.reAllTagsTrip++
    }
  }
}
</script>

<style lang="scss">
.el-message-box{
  width: 480px;
  // height: 192px;
  font-size: 14px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px!important;
  .el-message-box__title{
    font-family: 'Noto Sans SC';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    color: #313235;
  }
  .el-message-box__btns{
    padding-top: 16px;
    .el-button--primary{
      background-color: #FF7900!important;
      border-color: #FF7900!important;
      color: #ffffff!important;
    }
    .el-button{
      background: #F3F4F7;
      color: #2D2F39;
    }
    .el-button:hover{
      color: #2D2F39;
      border-color: #DCDFE6;
    }
    .el-button--primary:hover{
      color: #ffffff;
    }
  }
}

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