<template>
  <div >
    <el-dialog
      id="addTags"
      width="30%"
      title="新增标签"
      v-dialogDrag
      :visible.sync="innerVisible"
      :before-close="handleClose"
      append-to-body>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="100px" class="demo-ruleForm">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="标签分类" prop="env">
            <el-select v-model="ruleForm.env" placeholder="请选择标签分类">
              <el-option label="环境类" value="环境类"></el-option>
              <el-option label="路况类" value="路况类"></el-option>
              <el-option label="交互类" value="交互类"></el-option>
              <el-option label="自车类" value="自车类"></el-option>
              <el-option label="trip" value="trip"></el-option>
              <el-option label="算法" value="算法"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签颜色">
            <el-color-picker
              v-model="ruleForm.color"
              show-alpha
              :predefine="predefineColors">
            </el-color-picker>
          </el-form-item>
          <el-form-item label="标签样式" prop="pattern">
            <el-select v-model="ruleForm.pattern" placeholder="请选择标签分类">
              <el-option label="样式1" value="样式1"></el-option>
              <el-option label="样式2" value="样式2"></el-option>
              <el-option label="样式3" value="样式3"></el-option>
              <el-option label="样式4" value="样式4"></el-option>
              <el-option label="样式5" value="样式5"></el-option>
              <el-option label="样式6" value="样式6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="notes">
            <el-input type="textarea" v-model="ruleForm.notes"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    innerVisible:Boolean
  },
  data() {
    return {
      ruleForm: {
        name: '',
        env: '',
        notes: '',
        color:'rgba(255, 69, 0, 0.68)',
        pattern:'',
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
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
           this.$api['addItem']('tags',this.ruleForm).then(res=>{
            this.$emit('setAddTagsInnerVisible')
            this.$message({
              message: `标签 ${this.ruleForm.name} 创建成功`,
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
          this.$emit('setAddTagsInnerVisible')
        })
        .catch(_ => {});
    }
  }
}
</script>

<style lang="scss">
#addTags{
  .el-form-item__content{
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