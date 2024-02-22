<template>
  <div class="container">
    <div class="list">
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
        <el-form-item>
          <br>
          <div class="script-ego script-params">
            <div class="script-params-title">
              <span>{{ $t(`algorithm['环境变量']`) }}</span>
              <el-button type="primary" plain :icon="Plus"  @click="addScriptegoParam"></el-button>
            </div>
            <div class="script-params-body">
              <div v-for="(item,index) in ruleForm.parameter" :key="index" style="margin-bottom: 4px;">
                <div style="margin-bottom: 4px;display: flex;justify-content: space-between;">
                  {{ $t(`algorithm['环境变量']`) }} {{ index + 1 }} : <el-button type="danger" :icon="Delete"  @click="deleteScriptegoParam(index)" style="margin-left: 8px;" plain></el-button>
                </div>
                <div class="script-ego-params">
                  <el-input v-model.trim="item.key" :placeholder="`${$t(`algorithm['键']`)}`" style="margin-right: 4px;"></el-input>
                  <el-input v-model.trim="item.value" :placeholder="`${$t(`algorithm['值']`)}`"></el-input>
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
import { useRoute } from 'vue-router'

const route = useRoute()
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
  parameter:[
    {
      key: "",
      value: ""
    }
  ]
})
const ruleFormRef = ref()
const algorithmVersion0Data = ref<any>({})
const rules = reactive<FormRules<Row>>({})

  const getVersion0Data = async () => {
  const params = {
    'filter[version]': 0,
    algorithm: route.params.algorithemId,
  }
  findAll('algorithmversions', params).then(res => {
    const layerversion = gostore.sync(res.data)
    algorithmVersion0Data.value = layerversion[0]
    resetData(algorithmVersion0Data.value)
  })
}

const resetData = (data) => {
  ruleForm.parameter = Object.keys(data.config.env).map(it => {
    return {
      key: it,
      value: data.config.env[it]
    }
  })
}

const setArguments = (data) => {
  // ruleForm.parameter = data.self
}

const addScriptegoParam = () => {
  ruleForm.parameter.push({
    key: "",
    value: "",
  })
}

const deleteScriptegoParam = (index) => {
  ruleForm.parameter.splice(index, 1);
}

const scriptRulesEgo = (item,index) => {
  if(ruleForm.parameter[index]){
    let specialKey = ruleForm.parameter[index].key.replace(/^[a-zA-z0-9][a-zA-Z0-9_]+[a-zA-z]{0,64}$/g,'');
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

    // 检查算法自身参数
    for(let i=0;i<ruleFormData.parameter.length;i++){
      if(ruleFormData.parameter[i].key == '' && 
        ruleFormData.parameter[i].value == ''){
        ruleFormData.parameter.splice(i,1)
      }else if(ruleFormData.parameter[i].key !== '' &&
        ruleFormData.parameter[i].value !== '' && 
        ruleFormData.parameter[i].value !== ''){
          let rule = scriptRulesEgo('',i)
          if(rule){
            ElMessage({
              message: `${t(`algorithm['环境变量']`)} ${i+1} ${t(`algorithm['英文命名规范有误']`)}`,
              type: 'warning',
            })
            return;
          }
      }else{
        ElMessage({
          message: t(`algorithm['请完善环境变量']`) + (i+1),
          type: 'warning',
        })
        return;
      }
    }
    // 请求接口
    const env:any = {}
    ruleFormData.parameter.forEach(it => {
      env[it.key] = it.value
    })
    const params = {
      data: {
        type: 'algorithmversions',
        id: props.algorithemversionId,
        attributes: {
          config: {
            env: env,
            gpu: algorithmVersion0Data.value.config.gpu,
            resources: algorithmVersion0Data.value.config.resources
          }
        }
      }
    }
    patchItem('algorithmversions', params).then(res => {
      ElMessage({
        message: t(`algorithm['编辑环境变量']`),
        type: 'success',
      })
      window.history.pushState(null, '', `/algorithem/detail/${props.algorithemId}`)
    }).catch(err => {
      const {response:{data:{errors}}} = err
      let msg = t(`algorithm['编辑环境变量失败']`)
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