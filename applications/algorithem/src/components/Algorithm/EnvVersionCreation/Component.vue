<template>
  <div class="container" 
    element-loading-background="rgba(255, 255, 255, 0.4)"
    v-loading="loading">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/envs' }">{{ $t('algorithm["依赖库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/env/' + $route.params.envId }">{{ $route.query.name
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('algorithm["发布版本"]') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="form" status-icon>
      <el-form-item :label="$t(`algorithm['版本描述']`)">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{ $t('common["确认"]') }}</el-button>
        <el-button @click="cancel">{{ $t('common["取消"]') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import { ref, reactive } from "vue"
import { addItem } from '@/api/jsonApi'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import type { FormRules } from "element-plus"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const loading = ref(false)
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
    loading.value = true
    const params = {
      data: {
        type: 'environmentversions',
        attributes: {
          "description": form.desc,
          "environment": route.params.envId
        }
      }
        
    }
    addItem('environmentversions', params).then(res=>{
      ElMessage({
        message: t(`algorithm['发布版本成功']`),
        type: 'success',
      })
      loading.value = false
      window.history.pushState(null, '', `/algorithem/env/${route.params.envId}`)
    }).catch((err) => {
      const {response:{data:{errors}}} = err
      let msg =  t(`algorithm["发布版本失败"]`)
      loading.value = false
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
  window.history.pushState(null, '', `/algorithem/env/${route.params.envId}`)
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
  height: 100%;

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