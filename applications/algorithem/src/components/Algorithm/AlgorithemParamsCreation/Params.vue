<template>
  <div class="container">
    <!-- <div class="panel">
      <div class="mid-panel">
        <div class="mid-group">
          <div class="ver-mid">
            <el-button type="primary" class="info-btn save-btn" @click="submitForm(ruleFormRef)">编辑</el-button>
          </div>
        </div>
      </div>
    </div> -->
    <div class="list">
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
        <el-form-item>
          <br>
          <div class="script-input script-params">
            <div class="script-params-title">
              <span><span style="color: #F56C6C;">*</span>{{$t(`algorithm['输入参数']`)}}</span>
              <el-button type="primary" plain  :icon="Plus" @click="addScriptInput"></el-button>
            </div>
            <div class="script-params-body">
              <el-form-item v-for="(item, index) in ruleForm.inputs" :key="index"
                :label="`${$t(`algorithm['输入参数']`)} ${index+1}`">
                <div class="script-params-body-item">
                  <el-input v-model.trim="ruleForm.inputs[index]"></el-input>
                  <el-button type="danger" :icon="Delete"  @click="deleteScriptInput(index)"
                    style="margin-left: 8px;" plain></el-button>
                </div>
                <div class="scriptMessage" style="color: #F56C6C;font-size: 12px;" v-if="scriptRulesInput(item, index)">
                  {{ $t(`algorithm['名称仅支持大小写字母数字及下划线首位为字母']`) }}
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="script-output script-params">
            <div class="script-params-title">
              <span><span style="color: #F56C6C;">*</span>{{$t(`algorithm['输出参数']`)}}</span> 
              <el-button type="primary" plain  :icon="Plus" @click="addScriptOutput"></el-button>
            </div>
            <div class="script-params-body">
              <el-form-item v-for="(item,index) in ruleForm.outputs" :key="index" :label="`${$t(`algorithm['输出参数']`)} ${index+1}`">
                <div class="script-params-body-item">
                  <el-input v-model.trim="ruleForm.outputs[index]"></el-input>
                  <el-button type="danger" :icon="Delete"  @click="deleteScriptOutput(index)" style="margin-left: 8px;" plain></el-button>
                </div>
                <div class="scriptMessage" style="color: #F56C6C;font-size: 12px;" v-if="scriptRulesOutput(item,index)">
                  {{ $t(`algorithm['名称仅支持大小写字母数字及下划线首位为字母']`) }}
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="script-ego script-params">
            <div class="script-params-title">
              <span>{{ $t(`algorithm['算法自身参数']`) }} <i style="color: #F56C6C;">{{ $t(`algorithm['非必填']`) }}</i></span>
              <el-button type="primary" plain :icon="Plus"  @click="addScriptegoParam"></el-button>
            </div>
            <div class="script-params-body">
              <div v-for="(item,index) in ruleForm.parameter" :key="index" style="margin-bottom: 4px;">
                <div style="margin-bottom: 4px;display: flex;justify-content: space-between;">
                  {{ $t(`algorithm['参数']`) }} {{ index + 1 }} : <el-button type="danger" :icon="Delete"  @click="deleteScriptegoParam(index)" style="margin-left: 8px;" plain></el-button>
                </div>
                <div class="script-ego-params">
                  <el-input v-model.trim="item.title" :placeholder="`${$t(`algorithm['参数']`)} ${index+1} ${$t(`algorithm['中文名称']`)}`" style="margin-right: 4px;"></el-input>
                  <el-input v-model.trim="item.key" :placeholder="`${$t(`algorithm['参数']`)} ${index+1} ${$t(`algorithm['英文名称']`)}`" style="margin-right: 4px;"></el-input>
                  <el-input v-model.trim="item.value" :placeholder="`${$t(`algorithm['参数']`)} ${index+1} ${$t(`algorithm['值']`)}`"></el-input>
                </div>
                <el-input type="textarea" v-model="item.comment" :placeholder="`${$t(`algorithm['参数']`)} ${index+1} ${$t(`algorithm['描述']`)}`"></el-input>
                <div class="egoMessage" style="color: #F56C6C;font-size: 12px;" v-if="scriptRulesEgo(item,index)">
                  {{ $t(`algorithm['名称仅支持大小写字母数字及下划线首位为字母']`) }}
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t(`common['确认']`) }}</el-button>
          <el-button @click="cancel">{{ $t(`common['取消']`) }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { ElTable, ElMessage} from 'element-plus'
// @ts-ignore 
import { Plus, Delete } from "@element-plus/icons-vue" // eslint-disable-line
import { patchItem, findAll, findItem  } from '@/api/jsonApi'
import gostore from '@/services/algorithm-store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  algorithemversionId: String,
  algorithemId: String
})

interface Row {
  alias: string
  version: number
  name: string
  date: string
}
const ruleForm = reactive({
  inputs:[''],
  outputs:[''],
  parameter:[
    {
      key: "",
      title: "",
      value: "",
      comment: ""
    }
  ]
})
const ruleFormRef = ref()
const algorithmVersion0Data = ref<any>({})
const rules = reactive<FormRules<Row>>({})

const addScriptInput = () =>{
  ruleForm.inputs.push('')
}

const getVersion0Data = async () => {
  findItem('algorithmversions', props.algorithemversionId, {}).then(res => {
    const layerversion = gostore.sync(res.data)
    algorithmVersion0Data.value = layerversion
    setArguments(algorithmVersion0Data.value.arguments)
  })
}

const setArguments = (data) => {
  ruleForm.inputs = data.inputs
  ruleForm.outputs = data.outputs
  ruleForm.parameter = data.self
}



const deleteScriptInput = (index) =>{
  if(ruleForm.inputs.length == 1){
    ElMessage({
      message: t(`algorithm['最少填写一个输入参数']`),
      type: 'warning',
    })
  }else{
    ruleForm.inputs.splice(index, 1);
  }
}

const scriptRulesInput = (item,index) => {
  if(ruleForm.inputs[index]){
    let specialKey = ruleForm.inputs[index].replace(/^[a-z]([_a-z0-9]{0,30})$/g,'');
    return specialKey;
  }else{
    return false
  }
}

const addScriptOutput = () => {
  ruleForm.outputs.push('')
}

const deleteScriptOutput = (index) => {
  if(ruleForm.outputs.length == 1){
    ElMessage({
      message: t(`algorithm['最少填写一个输出参数']`),
      type: 'warning',
    })
  }else{
    ruleForm.outputs.splice(index, 1);
  }
}

const scriptRulesOutput = (item,index) => {
  if(ruleForm.outputs[index]){
    let specialKey = ruleForm.outputs[index].replace(/^[a-z]([_a-z0-9]{0,30})$/g,'');
    return specialKey;
  }else{
    return false
  }
}

const addScriptegoParam = () => {
  ruleForm.parameter.push({
    key: "",
    title: "",
    value: "",
    comment: ""
  })
}

const deleteScriptegoParam = (index) => {
  ruleForm.parameter.splice(index, 1);
}

const scriptRulesEgo = (item,index) => {
  if(ruleForm.parameter[index]){
    let specialKey = ruleForm.parameter[index].key.replace(/^[a-z]([_a-z0-9]{0,30})$/g,'');
    return specialKey;
  }else{
    return false
  }
}

const submitForm = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      creation()

    } else {
      console.log('error submit!', fields)
    }
  })
}

// 创建参数
const creation = () => {
  try {
    let ruleFormData = JSON.parse(JSON.stringify(ruleForm))
    // 检查输入参数是否填写
    if(ruleFormData.inputs.length == 1 && ruleFormData.inputs[0] == ''){
      ElMessage({
        message: t(`algorithm['最少填写一个输入参数']`),
        type: 'warning',
      })
      return;
    }
    for(let i=0;i<ruleFormData.inputs.length;i++){
      if(ruleFormData.inputs[i] == ''){
        ElMessage({
          message: t(`algorithm['请完善输入参数']`),
          type: 'warning',
        })
        return;
      }
      let rule = scriptRulesInput('',i)

      if(rule){
        ElMessage({
          message:  `${t(`algorithm['输入参数']`)} ${i+1} ${t(`algorithm['命名规范有误']`)}`,
          type: 'warning',
        })
        return;
      }
    }

    // 检查输出参数是否填写
    if(ruleFormData.outputs.length == 1 && ruleFormData.outputs[0] == ''){
      ElMessage({
        message: t(`algorithm['最少填写一个输出参数']`),
        type: 'warning',
      })
      return;
    }
    for(let i=0;i<ruleFormData.outputs.length;i++){
      if(ruleFormData.outputs[i] == ''){
        ElMessage({
          message: t(`algorithm['请完善输出参数']`),
          type: 'warning',
        })
        return;
      }

      let rule = scriptRulesOutput('',i)

      if(rule){
        ElMessage({
          message:  `${t(`algorithm['输出参数']`)} ${i+1} ${t(`algorithm['命名规范有误']`)}`,
          type: 'warning',
        })
        return;
      }
    }

    // 检查算法自身参数
    for(let i=0;i<ruleFormData.parameter.length;i++){
      if(ruleFormData.parameter[i].key == '' && 
        ruleFormData.parameter[i].title == '' && 
        ruleFormData.parameter[i].value == '' && 
        ruleFormData.parameter[i].value == ''){
        ruleFormData.parameter.splice(i,1)
      }else if(ruleFormData.parameter[i].key !== '' && 
        ruleFormData.parameter[i].title !== '' && 
        ruleFormData.parameter[i].value !== '' && 
        ruleFormData.parameter[i].value !== ''){
          let rule = scriptRulesEgo('',i)
          if(rule){
            ElMessage({
              message: `${t(`algorithm['自身参数']`)} ${i+1} ${t(`algorithm['英文命名规范有误']`)}`,
              type: 'warning',
            })
            return;
          }
      }else{
        ElMessage({
          message: t(`algorithm['请完善自身参数']`) + (i+1),
          type: 'warning',
        })
        return;
      }
    }

    // 请求接口
    const argumentsParams:any = {
      inputs: ruleForm.inputs,
      outputs: ruleForm.outputs,
      self: ruleForm.parameter
    }
    const params = {
      data: {
        type: 'algorithmversions',
        id: props.algorithemversionId,
        attributes: {
          arguments: argumentsParams
        }
      }
    }
    patchItem('algorithmversions', params).then(res => {
      ElMessage({
        message: t(`algorithm['创建成功']`),
        type: 'success',
      })
      window.history.pushState(null, '', `/algorithem/detail/${props.algorithemId}`)
    }).catch(err => {
      const {response:{data:{errors}}} = err
      let msg = t(`algorithm['发布版本失败']`)
      if(errors && errors[0]) {
        const errmsg = errors[0]['detail']
        msg =  t(`algorithm['${errmsg}']`)
      }
      ElMessage({
        message: msg,
        type: 'error',
      })
    })
  } catch (error) {
    console.log(error)
  }
}

const cancel = () => {
  window.history.pushState(null, '', `/algorithem/detail/${props.algorithemId}`)
}

getVersion0Data()
</script>

<style lang="scss" scoped>
.user-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-button--primary.is-plain {
  color: #ff7900;
  border: 1px solid #ff7900;
  background: #fff;
}

.el-button--primary {
  background: #FF7900;
  border: none;
  color: #fff;
}

.el-button--text {
  color: #FF7900;
}

.ver-mid {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.container {
  display: flex;
  flex-direction: column;
  margin: 0 30px;

  .bread-font {
    font-weight: 700;
  }

  .list {
    border-top: 1px solid transparent;
    margin-top: 10px;

    .el-button--primary:hover{
      background-color: rgba($color: #FF7900, $alpha: .1);
    }

    .script-params{
      color: #8D91A5;
      font-family: 'Noto Sans SC';
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      width: 100%;
      margin-bottom: 40px;

      &-title{
        border-bottom: 1px solid #dad5d5;
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
      }

      &-body{
        padding: 8px 0;
      }
      .script-ego-params{
        display: flex;
        margin-bottom: 6px;
      }

      .el-form-item {
          margin-bottom: 18px;
      }
    }

    .script-params-body-item{
      display: flex;
      width: 100%;
    }
  }
}</style>