<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/lists' }">{{ $t('algorithm["算法列表"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/detail/' + $route.params.algorithemId }">{{
        $route.query.name }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('algorithm["创建版本"]') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="form" status-icon>
      <el-form-item label="版本描述">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form> -->
    <Params 
      :algorithemversionId="$route.query.version0"
      :algorithemId="$route.params.algorithemId" ></Params>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import { ref, reactive } from "vue"
import { addItem } from '@/api/jsonApi'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import type { FormRules } from "element-plus"
import Params from './Params.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
interface Row {
  version: String,
  name: String,
  desc: String,
  file: File | undefined
}
const formRef = ref()
const form = reactive<Row>({
  version: '',
  name: '',
  desc: '',
  file: undefined
})
const algorithmVersion0Data = ref<any>({})

const rules = reactive<FormRules<Row>>({
  desc: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
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
        attributes: {
          "description": form.desc,
          "algorithm": route.params.algorithemId
        }
      }
        
    }
    addItem('algorithmversions', params).then(res=>{
      ElMessage({
        message:  t(`algorithm['发布版本成功']`),
        type: 'success',
      })
      window.history.pushState(null, '', `/algorithem/detail/${route.params.algorithemId}`)
    }).catch((err) => {
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