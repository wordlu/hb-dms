<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/algorithem/algorithempanel' }">{{ $t('algorithm["算法库"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/lists' }">{{ $t('algorithm["算法列表"]') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/algorithem/detail/' + $route.params.algorithemId }">{{
        $route.query.name }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('algorithm["编辑环境变量"]') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <Params 
      :algorithemversionId="$route.query.version0"
      :algorithemId="$route.params.algorithemId" ></Params>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import Params from './Params.vue'
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