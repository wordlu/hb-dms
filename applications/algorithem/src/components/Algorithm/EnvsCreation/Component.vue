<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/envs' }">{{ $t('algorithm["环境"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('algorithm["创建环境"]') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="form" status-icon>
      <el-form-item :label="$t(`algorithm['环境名称']`)" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="$t(`algorithm['环境描述']`)">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item :label="$t(`common['类型']`)" prop="cat">
        <el-select v-model="form.cat" :placeholder="$t(`algorithm['请选择类型']`)" style="width: 100%">
          <el-option v-for="item in catArray" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t(`algorithm['镜像仓库']`)">
        <el-input v-model="form.repo" disabled/>
      </el-form-item>
      <el-form-item :label="$t(`algorithm['镜像位置']`)" prop="repocat">
        <el-select v-model="form.repocat" :placeholder="$t(`algorithm['请选择镜像位置']`)" style="width: 100%" disabled>
          <el-option v-for="item in repocatArray" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">{{$t(`common['确认']`)}}</el-button>
        <el-button @click="cancel">{{$t(`common['取消']`)}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios"
import { ArrowRight } from "@element-plus/icons-vue"
import { ref, reactive } from "vue"
import { addItem } from '@/api/jsonApi'
import { ElMessage } from 'element-plus'
import type { FormRules } from "element-plus"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
interface Row {
  name: string,
  runtime: string,
  description: string,
  cat: string,
  repo: string,
  repocat: string
}

const formRef = ref()
// const formSize = ref('default')
const form = reactive<Row>({
  name: '',
  runtime: 'python',
  description: '',
  cat: '',
  repo: '295313735635.dkr.ecr.cn-north-1.amazonaws.com.cn',
  repocat: 'AWS-ECR'
})

const rules = reactive<FormRules<Row>>({
  name: [
    { required: true, message: t(`algorithm['请输入名称']`), trigger: 'blur' },
    {
      required: true,
      pattern: /^[a-zA-z0-9][a-zA-Z0-9_\-]+[a-zA-z]{0,64}$/,
      message: t(`algorithm['名称只能包含字母数字连字符和下划线']`),
      trigger: 'blur'
    }
  ],
  cat: [
    { required: true, message: t(`algorithm['请选择类型']`), trigger: 'blur' },
  ],
})

const catArray = ref<any>(['感知', '场景库', '评测', '其它'])
const repocatArray = ['AWS-ECR']

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
        type: 'environments',
        attributes: {
          "name": form.name,
          "description": form.description,
          "cat": form.cat,
          "repo": form.repo,
          "repocat": form.repocat
        }
      }
        
    }
    addItem('environments', params).then(res=>{
      ElMessage({
        message:  t(`algorithm['创建成功']`),
        type: 'success',
      })
      window.history.pushState(null, '', "/algorithem/envs")
    }).catch(err => {
      let msg = t(`algorithm['创建失败']`)
      const {response:{data:{errors}}} = err
      if(errors && errors[0]) {
        msg = errors[0]['detail']
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
  window.history.pushState(null, '', `/algorithem/envs`)
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

  .btns {
    padding-top: 40px;
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