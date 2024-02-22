<template>
  <div>
    <el-dialog
      id="addConnector"
      width="30%"
      title="新增连接器"
      v-dialogDrag
      :visible.sync="innerVisible"
      :before-close="handleClose"
      append-to-body>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="100px" class="demo-ruleForm">
          <el-form-item label="连接器名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="标签分类" prop="category">
            <el-radio-group v-model="ruleForm.category" @change="getCurrentFrom">
              <el-radio v-for="(item,index) in connectorconfigs" :key="index" :label="item.category"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="连接参数:">
            
          </el-form-item>

          <el-form-item label="类型" prop="connecttype">
            <el-select v-model="ruleForm.connecttype" placeholder="请选择类型" @change="changeConnecttype">
              <el-option v-for="(item,index) in currentFroms" :key="index" :label="item.connecttype" :value="item.connecttype"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-for="(item,index) in activeFrom" :key="index" :label="item.name" :prop="item.key">
            <el-input v-model="ruleForm[item.key]"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button size="mini" @click="closeConnector">取消创建</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    innerVisible:Boolean,
    connectorconfigs:Array
  },
  data() {
    return {
      activeConnectorconfigCategory:'',
      ruleForm: {
        name: '',
        category:'',
        connecttype:'',
        project:this.$route.params.id
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        env: [
          { required: true, message: '请选择标签分类', trigger: 'change' }
        ],
        pattern: [
          { required: true, message: '请选择标签样式', trigger: 'change' }
        ],
        notes: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      },
      currentFroms:[],
      activeFrom:[]
    };
  },
  created(){
    this.ruleForm.category = this.connectorconfigs[0].category
    this.currentFroms = this.connectorconfigs[0].params
    this.ruleForm.connecttype = JSON.parse(JSON.stringify(this.connectorconfigs[0].params))[0].connecttype
    this.activeFrom = JSON.parse(JSON.stringify(this.connectorconfigs[0].params))[0].fields

    for(let i=0;i<this.activeFrom.length;i++){
      this.$set(this.ruleForm,this.activeFrom[i].key,'')
    }
    console.log(this.ruleForm,'this.ruleForm')
  },
  methods: {
    getCurrentFrom(){
      for(let i=0;i<this.connectorconfigs.length;i++){
        if(this.ruleForm.category == this.connectorconfigs[i].category){
          for(let j=0;j<this.activeFrom.length;j++){
            delete this.ruleForm[this.activeFrom[j].key]
          }
          this.currentFroms = this.connectorconfigs[i].params
          this.ruleForm.connecttype = this.connectorconfigs[i].params[0].connecttype
          this.activeFrom = this.connectorconfigs[i].params[0].fields
          for(let j=0;j<this.activeFrom.length;j++){
            this.$set(this.ruleForm,this.activeFrom[j].key,'')
          }
        }
      }
      console.log(this.ruleForm,'this.ruleForm')
    },
    closeConnector(){
      this.$emit('closeConnector')
    },
    changeConnecttype(){
      for(let i=0;i<this.currentFroms.length;i++){
        if(this.currentFroms[i].connecttype == this.ruleForm.connecttype){
          for(let j=0;j<this.activeFrom.length;j++){
            delete this.ruleForm[this.activeFrom[j].key]
          }
          this.activeFrom = this.currentFroms[i].fields
          for(let j=0;j<this.activeFrom.length;j++){
            this.$set(this.ruleForm,this.activeFrom[j].key,'')
          }
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api['addItem']('connectors',this.ruleForm).then(res=>{
            this.$emit('setAddConnectorInnerVisible')
            this.$message({
              message: `连接器 ${this.ruleForm.name} 创建成功`,
              type: 'success'
            });
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('setAddConnectorInnerVisible')
        })
        .catch(_ => {});
    }
  }
}
</script>

<style lang="scss">
#addConnector{
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
  .el-radio__input.is-checked .el-radio__inner{
    border-color: #884DFF;
    background: #884DFF;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color:#2D2F39
  }
  .el-dialog{
    border-radius: 12px;
  }
}

</style>