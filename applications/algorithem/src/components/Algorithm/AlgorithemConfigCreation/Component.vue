<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/lists' }">{{ $t('algorithm["算法列表"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/detail/' + $route.params.algorithemId }">{{
        $route.query.name }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('algorithm["编辑基本设置"]') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="formRef" :model="form" label-width="80px" :rules="rules" class="config-form">
      <el-form-item label="GPU" prop="gpu">
        <el-select v-model="form.gpu" clearable>
          <el-option v-for="(item, index) in gpuList" :key="item.id+index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CPU" prop="cpu">
        <el-input v-model="form.cpu" type="number" :min="1" :max="24">
          <template #suffix >
            <span style="font-style: normal; margin-right: 10px">核</span>
          </template> </el-input>
      </el-form-item>
      <el-form-item :label="$t(`algorithm['内存']`)" prop="memory">
        <el-input type="number" v-model="form.memory" :min="128" :max="10240">
          <template #suffix >
            <span style="font-style: normal; margin-right: 10px">MB</span>
          </template> 
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{ $t('common["确认"]') }}</el-button>
        <el-button @click="cancel">{{ $t(`common['取消']`) }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import { ref, reactive } from "vue"
import { patchItem, findAll } from '@/api/jsonApi'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import type { FormRules } from "element-plus"
import { useI18n } from 'vue-i18n'
import gostore from '@/services/algorithm-store'

const { t } = useI18n()
const route = useRoute()
interface Row {
  cpu?: Number,
  gpu: String,
  memory?: Number
}
const formRef = ref()
const form = reactive<Row>({
  gpu: ''
})
const algorithmVersion0Data = ref<any>({})
const gpuList = ref<any>([])

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
  form.cpu = data.config.resources.cpu ? Number(data.config.resources.cpu) : 0
  form.gpu = data.config.gpu
  form.memory = data.config.resources.memory ? Number(data.config.resources.memory) : 0
}

const getGpuList = async () => {
  const params = {
    'filter[cat]': 'gpu',
  }
  findAll('selectorlabels', params).then(res => {
    const lists = gostore.sync(res.data)
    gpuList.value = lists
  })
}

getVersion0Data()
getGpuList()

const rules = reactive<FormRules<Row>>({
  cpu: [
    { required: true, message: t(`algorithm['请输入cpu']`), trigger: 'blur' },
    {
      required: true,
      pattern: /^[0-9]{0,64}$/,
      message: t(`algorithm['名称只能包含数字']`),
      trigger: 'blur'
    }
  ],
  memory: [
  { required: true, message: t(`algorithm['请输入内存']`), trigger: 'blur' },
    {
      required: true,
      pattern: /^[0-9]{0,64}$/,
      message: t(`algorithm['名称只能包含数字']`),
      trigger: 'blur'
    }
  ],
})
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

const creation = () => {
  try {
    const params = {
      data: {
        type: 'algorithmversions',
        id: algorithmVersion0Data.value.id,
        attributes: {
          "config": {
            env: algorithmVersion0Data.value.config.env,
            gpu: form.gpu,
            resources: {
              cpu: Number(form.cpu),
              memory: Number(form.memory)
            }
          }
        }
      }
        
    }
    patchItem('algorithmversions', params).then(res=>{
      ElMessage({
        message:  t(`algorithm['"编辑基本设置成功']`),
        type: 'success',
      })
      window.history.pushState(null, '', `/algorithem/detail/${route.params.algorithemId}`)
    }).catch((err) => {
      const {response:{data:{errors}}} = err
      let msg = t(`algorithm['"编辑基本设置失败']`)
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
  window.history.pushState(null, '', `/algorithem/detail/${route.params.algorithemId}`)
}
</script>

<style lang="scss" scoped>
.ver-mid {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.el-button--primary {
  background: #FF7900;
  border: none;
}


.el-tabs__item.is-active {
  color: #FF7900;
}

.container {
  display: flex;
  flex-direction: column;
  margin: 0 30px;

  .config-form {
    margin-top: 40px;

    .el-select, .el-input {
      width: 500px;
    }
  }

  .bread-font {
    font-weight: 700;
  }

  .form {
    margin-top: 15px;
    flex-grow: 1;
    border: 1px solid transparent;
  }
}
</style>