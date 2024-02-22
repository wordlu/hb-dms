<template>
    <div class="container">
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item>{{ $t('algorithm["资源面板"]') }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="panel">
            <div class="summary" >
                <div class="title-pane">
                    <h2>{{ $t('algorithm["算法库统计"]') }}</h2>
                </div> 
                <div class="detail-pane">
                    <el-col :span="8">
                        <el-statistic class="pane-item" :title="$t(`algorithm['注册算法']`)" :value="algorithemNum" />
                    </el-col>
                    <el-col :span="8">
                        <el-statistic class="pane-item" :title="$t(`algorithm['依赖个数']`)" :value="layerNum" />
                    </el-col>
                    <el-col :span="8">
                        <el-statistic class="pane-item" :title="$t(`algorithm['环境个数']`)" :value="envNum" />
                    </el-col>
                </div>
            </div>
            <div class="chart" ref="chartRef">
                <insightpage :allData="allData" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import  { ArrowRight } from "@element-plus/icons-vue"
import gostore from '@/services/algorithm-store'
import  { ref, onMounted, reactive, watch } from "vue"
import { findAll } from '@/api/jsonApi'
import insightpage from '@/components/d3BaseChartFilter/insightpage.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
onMounted(() => {
  queryAlgorithemData()
  queryLayerData()
  queryEnvData()
  queryAlgorithemStatistic()
  allData.initWidth = chartRef.value.offsetWidth - 24 * 4
})
const chartRef = ref()
const algorithemNum = ref<number>(0)
const layerNum = ref<number>(0)
const envNum = ref<number>(0)
const allData = reactive({
  data: [],
  activeContent: {
    policyName: 'arcPie',
    index: 1,
    x: 'id',
    y: 'count'
  },
  initHeight: 300,
  initWidth: 600,
  initTitle: '',
  needTitle: true,
})

const queryAlgorithemData = () => {
  findAll('algorithms', {limit: 1}).then((res: any) => {
    algorithemNum.value = res.data.meta ? res.data.meta.count : 0
  }).catch((err: any) => {
    console.log(err, 'err')
  })
}

const queryLayerData = () => {
  findAll('layers', {limit: 1}).then((res: any) => {
    layerNum.value = res.data.meta ? res.data.meta.count : 0
  }).catch((err: any) => {
    console.log(err, 'err')
  })
}

const queryEnvData = () => {
  findAll('environments', {limit: 1}).then((res: any) => {
    envNum.value = res.data.meta ? res.data.meta.count : 0
  }).catch((err: any) => {
    console.log(err, 'err')
  })
}
const queryAlgorithemStatistic = () => {
  findAll('algorithmstatistics', {limit: 100}).then((res: any) => {
    gostore.reset()
    gostore.sync(res.data)
    allData.data = gostore.findAll('algorithmstatistics').map(it => {
      return {
        id: it.id,
        count: it.count
      }
    })
  }).catch((err: any) => {
    console.log(err, 'err')
  })
}

watch(
  () => t(`algorithm["算法类型分布图"]`),
  (newVal, oldVal) => {
    allData.initTitle = newVal
  }
)

</script>

<style lang="scss" scoped>
.ver-mid {
    display: flex;
    flex-direction: column;
    justify-content: space-around;    
}

.container {
    display:flex;
    flex-direction: column;
    margin: 0 30px;

    .bread-font {
        font-weight: 700;
    }

    .panel {
        margin-top: 15px;
        flex-grow: 1;
        border: 1px solid transparent;
    }

    .summary {
        margin-top: 15px;
        // padding: 15px;
        padding: 0 10px;
        border: 1px solid transparent;
        display: flex;
        flex-direction: column;

        .title-pane {
            display: flex;
            flex-direction: row;
            margin-bottom: 40px;
            // background-color: lightgrey;

            h2 {
                padding-left: 10px;
            }
        }

        .detail-pane {
            display: flex;
            flex-direction: row;
            .pane-item {
              height: 160px;
              margin: 10px;
              background: #f9f9fb;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;

              :deep(.el-statistic__head) {
                font-weight: 600;
                font-size: 18px;
                color: #5a5e72;
                
              }

              :deep(.el-statistic__content) {
                color: #2d2f39;
                font-size: 24px;
                font-style: normal;
                font-weight: 600;
              }
            }

            .row-pane {
                display: flex;
                flex-direction: row;
            }
        }
    }

    .chart {
        display: flex;
        flex-direction: colum;
        // margin-top: 40px;
        padding: 20px;

        .chart-row {
            // display: flex;
            // flex-direction: row;

            .gram {

            }
        }

    }

}

</style>