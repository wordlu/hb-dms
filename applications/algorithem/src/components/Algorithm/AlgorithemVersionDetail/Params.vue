<template>
  <div class="container">
    <div class="panel">
      <div class="mid-panel">
        <div class="mid-group">
          <div class="ver-mid">
            <!-- <el-button type="primary" class="info-btn save-btn" @click="submitForm(ruleFormRef)">编辑</el-button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <el-form ref="ruleFormRef">
        <el-form-item>
          <br>
          <div class="params">
            <div class="input-output">
              <div class="script-input script-params">
                <div class="script-params-title">
                  <span>{{ $t(`algorithm['输入参数']`) }}</span>
                  <!-- <el-button type="primary" size="mini" :icon="Plus" @click="addScriptInput"></el-button> -->
                </div>
                <div class="script-params-body">
                  <el-form-item v-for="(item, index) in ruleForm.inputs" :key="index"
                    :label="`${$t(`algorithm['输入参数']`)} ${index + 1}:`">
                    <div class="script-params-body-item">
                      <span>{{ ruleForm.inputs[index] }}</span>
                      <!-- <el-input v-model.trim="ruleForm.inputs[index]"></el-input> -->
                      <!-- <el-button type="danger" :icon="Delete" size="mini" @click="deleteScriptInput(index)"
                        style="margin-left: 8px;" plain></el-button> -->
                    </div>
                    <div class="scriptMessage" style="color: #F56C6C;font-size: 12px;" v-if="scriptRulesInput(item, index)">
                      {{ $t(`algorithm['名称仅支持大小写字母数字及下划线首位为字母']`) }}
                    </div>
                  </el-form-item>
                </div>
              </div>
              <div class="script-output script-params">
                <div class="script-params-title">
                  <span>{{ $t(`algorithm['输出参数']`) }}</span> 
                  <!-- <el-button type="primary" size="mini" :icon="Plus" @click="addScriptOutput"></el-button> -->
                </div>
                <div class="script-params-body">
                  <el-form-item v-for="(item,index) in ruleForm.outputs" :key="index" :label="`${$t(`algorithm['输出参数']`)} ${index+1}:`">
                    <div class="script-params-body-item">
                      <!-- <el-input v-model.trim="ruleForm.outputs[index]"></el-input> -->
                      <span>{{ ruleForm.outputs[index] }}</span>
                      <!-- <el-button type="danger" :icon="Delete" size="mini" @click="deleteScriptOutput(index)" style="margin-left: 8px;" plain></el-button> -->
                    </div>
                    <div class="scriptMessage" style="color: #F56C6C;font-size: 12px;" v-if="scriptRulesOutput(item,index)">
                      {{ $t(`algorithm['名称仅支持大小写字母数字及下划线首位为字母']`) }}
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="script-ego script-params">
              <div class="script-params-title">
                <span>{{ $t(`algorithm['算法自身参数']`) }}</span>
                <!-- <el-button type="primary" :icon="Plus" size="mini" @click="addScriptegoParam"></el-button> -->
              </div>
              <div class="script-params-body">
                <div v-for="(item,index) in ruleForm.parameter" :key="index" style="margin-bottom: 4px;">
                  <div style="margin-bottom: 4px;display: flex;justify-content: space-between;">
                    {{ $t(`algorithm['参数']`) }} {{ index + 1 }} : 
                  </div>

                  <el-descriptions>
                    <el-descriptions-item :label="$t(`algorithm['中文名称']`)">{{item.title}}</el-descriptions-item>
                    <el-descriptions-item :label="$t(`algorithm['英文名称']`)">{{ item.key }}</el-descriptions-item>
                    <el-descriptions-item :label="$t(`algorithm['值']`)">{{ item.value }}</el-descriptions-item>
                    <el-descriptions-item :label="$t(`algorithm['描述']`)">{{ item.comment }}</el-descriptions-item>
                  </el-descriptions>

                  <!-- <div class="script-ego-params">
                    <el-input v-model.trim="item.title" :placeholder="`参数 ${index+1} 中文名称`" style="margin-right: 4px;"></el-input>
                    <el-input v-model.trim="item.key" :placeholder="`参数 ${index+1} $中文名称`" style="margin-right: 4px;"></el-input>
                    <el-input v-model.trim="item.value" :placeholder="`参数 ${index+1} 值`"></el-input>
                  </div>
                  <el-input type="textarea" v-model="item.comment" :placeholder="`参数 ${index+1}描述`"></el-input>

                  <div class="egoMessage" style="color: #F56C6C;font-size: 12px;" v-if="scriptRulesEgo(item,index)">
                    英文名称仅支持大小写字母、数组及下划线(首位为字母)
                  </div> -->

                </div>
              </div>
            </div>
          </div>
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
import { patchItem } from '@/api/jsonApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  algorithemversionId: String,
  algorithemId: String,
  arguments: Object
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


const addScriptInput = () =>{
  ruleForm.inputs.push('')
}

const setArguments = (data) => {
  ruleForm.inputs = data.inputs
  ruleForm.outputs = data.outputs
  ruleForm.parameter = data.self
}


const deleteScriptInput = (index) =>{
  if(ruleForm.inputs.length == 1){
    ElMessage({
      message: t(`algorithm["最少填写一个输入参数"]`),
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
      message: t(`algorithm["最少填写一个输出参数"]`),
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
  // if (!formEl) return
  // await formEl.validate((valid: any, fields: any) => {
  //   if (valid) {
  //     creation()

  //   } else {
  //     console.log('error submit!', fields)
  //   }
  // })
  window.history.pushState(null, '', `/algorithem/detail/${props.algorithemId}/params/creation?version0=${props.algorithemversionId}`)
}

// 创建参数
const creation = () => {
  try {
    const argumentsParams:any = {}
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
        message:  t(`algorithm['创建成功']`),
        type: 'success',
      })
      window.history.pushState(null, '', "/algorithem/details")
    }).catch(err => {
      ElMessage({
        message: t(`algorithm['创建失败']`),
        type: 'success',
      })
    })
  } catch (error) {
    console.log(error)
  }
}

watch(
  () => props.arguments,
  (newVal, oldVal) => {
    setArguments(newVal)
  }
)
</script>

<style lang="scss" scoped>
.user-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-button--primary {
  color: #ff7900;
  border-color: #ff7900;
  background: #fff;
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

  .panel {
    margin-top: 15px;
    flex-grow: 1;
    // border: 1px solid transparent;
  }

  .mid-panel {
    display: flex;
    flex-direction: row;

    .search-bar {
      max-width: 300px;
      padding: 10px
    }

    .mid-group {
      flex-grow: 1;
      width: 100px;
      display: flex;
      flex-direction: row-reverse;
      margin: 0 15px;

      .save-btn {
        background: #FF7900;
        color: #fff;
      }

      button {
        margin: 0 15px
      }
    }
  }

  .list {
    border-top: 1px solid transparent;
    margin-top: 10px;

    .el-button--primary:hover{
      background-color: rgba($color: #FF7900, $alpha: .1);
    }

    .params {
      width: 100%;
      .input-output {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .script-params {
        color: #8D91A5;
        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        width: 50%;
        // margin-bottom: 20px;
        padding: 4px;

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

        &-body-item{
          display: flex;
          width: 50%;
        }
      }

      .script-ego {
        width: 100%;
      }
    }
  }
}</style>