<template>
  <div class="asset-overview">
    <div class="header">
      <div class="title">
        <div class="Grey-Background-box">
          <img src="/icon/default/数据集首页图标.svg" style="width: 40px;height: 40px;" alt="">
        </div>
        <span>{{ $t('overview["数据资产"]') }}</span>
      </div>
      <div class="btn-add">
        <!-- <el-button type="primary" @click="openAddDataDom" icon="el-icon-plus">新增数据集</el-button> -->
      </div>
    </div>
    <div class="data-show">
      <div class="data-show-item">
        <div class="content">
          <div class="num">{{ projectSize }}</div>
          <div class="title">{{ $t('overview["项目个数"]') }}</div>
        </div>
        <div class="date">{{ $t('overview["数据截止至"]') }}: {{ formatter(projectDate, "yyyy-MM-dd hh:mm:ss") }}</div>
      </div>
      <div class="data-show-item">
        <div class="content">
          <div class="num">{{ sceneSize }}</div>
          <div class="title">{{ $t('overview["总场景数"]') }}</div>
        </div>
        <div class="date">{{ $t('overview["数据截止至"]') }}: {{ formatter(sceneDate, "yyyy-MM-dd hh:mm:ss") }}</div>
      </div>
      <div class="data-show-item">
        <div class="content">
          <div class="num">{{ byteToTB(storeSize) }}</div>
          <div class="title">{{ $t('overview["总存储量"]') }}</div>
        </div>
        <div class="date">{{ $t('overview["数据截止至"]') }}: {{ formatter(storeDate, "yyyy-MM-dd hh:mm:ss") }}</div>
      </div>
    </div>
    <div class="chart-show" ref="chartShow">
      <div class="chart-show-title">
        <div class="title">{{ $t('overview["数据分布图"]') }}</div>
        <div class="options">
          <el-select v-model="value1" class="m-2" :placeholder="$t(`common['请选择']`)" size="small" @change="selectValue1">
            <el-option :label="$t(`overview['存储量']`)" value="size" />
            <el-option :label="$t(`overview['项目个数']`)" value="count" />
          </el-select>
          <el-select v-model="value2" class="m-2" :placeholder="$t(`common['请选择']`)" size="small" @change="selectValue2">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <insightpage :allData="allData" />
    </div>
  </div>
</template>

<script>
import { func_charts_adapter } from '@/api/dataset'
import insightpage from '@/components/d3BaseChartFilter/insightpage.vue'
export default {
  components: {
    insightpage
  },
  data() {
    return {
      projectSize: 0,
      sceneSize: 0,
      storeSize: 0,
      projectDate: null,
      sceneDate: null,
      storeDate: null,
      value1: 'size',
      value2: '项目',
      allData: {
        data: [],
        activeContent: {
          policyName: 'arcPie',
          index: 1,
          x: '',
          y: ''
        },
        initHeight: 300,
        initWidth: 600,
        initTitle: '数据分布图',
        needTitle: false,
      },
    }
  },
  mounted() {
    this.getData()
    this.getChart()
    this.allData.initWidth = this.$refs.chartShow.offsetWidth - 24 * 4
  },
  computed: {
    options() {
      return [{
        value: '项目',
        label: this.$t(`overview['项目分布']`),
      }, {
        value: '天气',
        label: this.$t(`overview['天气分布']`),
      }, {
        value: '道路',
        label: this.$t(`overview['道路分布']`),
      }, {
        value: '场景',
        label: this.$t(`overview['场景分布']`),
      }, {
        value: '城市',
        label: this.$t(`overview['城市分布']`),
      }]
    }
  },
  methods: {
    selectValue1() {
      this.getChart()
    },
    selectValue2() {
      this.getChart()
    },
    getData() {
      const paramObject = {
        "dataSource": { "db_type": "mongo", "table_name": "Dataset", "dbname": "shell" },
        "chartsType": "query_chart",
        "xAxisLabels": [],
        "yAxisLabels": [],
        "customParams": {},
        "customQuery": [
          {
            "$group": {
              "_id": { "_": null },
              "project": { "$addToSet": "$projectflag" }
            }
          },
          {
            "$project": {
              "project": { "$size": "$project" }
            }
          }
        ]
      }
      func_charts_adapter(paramObject).then(res => {
        this.projectSize = res.data[0] ? res.data[0].project : 0
        this.projectDate = res.meta.last_updated * 1000
      })

      const paramObject2 = {
        "dataSource": { "db_type": "mongo", "table_name": "Meta", "dbname": "shell" },
        "chartsType": "query_chart",
        "xAxisLabels": [],
        "yAxisLabels": [],
        "customParams": {},
        "customQuery": [
          {
            "$match": {
              "tag_category": { "$in": ["自定义场景", "行为交互"] }
            }
          },
          {
            "$group": {
              "_id": { "_": null },
              "count": { "$sum": 1 }
            }
          }
        ]
      }
      func_charts_adapter(paramObject2).then(res => {
        this.sceneSize = res.data[0] ? res.data[0].count : 0
        this.sceneDate = res.meta.last_updated * 1000
      })

      const paramObject3 = {
        "dataSource": { "db_type": "mongo", "table_name": "Dataset", "dbname": "shell" },
        "chartsType": "query_chart",
        "xAxisLabels": [],
        "yAxisLabels": [],
        "customParams": {},
        "customQuery": [
          {
            "$group": {
              "_id": { "_": null },
              "size": { "$sum": "$size" }
            }
          }
        ]
      }
      func_charts_adapter(paramObject3).then(res => {
        this.storeSize = res.data[0] ? res.data[0].size : 0
        this.storeDate = res.meta.last_updated * 1000
      })
    },
    getChart() {
      this.allData.activeContent.y = this.value1
      let paramObject = null
      if (this.value2 === '项目') {
        paramObject = {
          "dataSource": { "db_type": "mongo", "table_name": "DatasetOverview", "dbname": "shell" },
          "chartsType": "pie_chart",
          "xAxisLabels": ["projectflag"],
          "yAxisLabels": [
            { "column": "count", "agg": "count" },
            { "column": "size", "agg": "sum", "key": "size" }
          ],
          "zAxisLabel": {},
          "customParams": {
            "match": [],
            "distinct": ["datasetid"]
          },
          "customQuery": []
        }
        this.allData.activeContent.x = "projectflag"
      } else if (this.value2 === '天气') {
        paramObject = {
          "dataSource": { "db_type": "mongo", "table_name": "DatasetOverview", "dbname": "shell" },
          "chartsType": "pie_chart",
          "xAxisLabels": ["tagname"],
          "yAxisLabels": [
            { "column": "count", "agg": "count" },
            { "column": "size", "agg": "sum", "key": "size" }
          ],
          "zAxisLabel": {},
          "customParams": {
            "match": [{ "tagcategory": "环境" }],
            "distinct": ["datasetid"]
          },
          "customQuery": []
        }
        this.allData.activeContent.x = "tagname"
      } else if (this.value2 === '道路') {
        paramObject = {
          "dataSource": { "db_type": "mongo", "table_name": "DatasetOverview", "dbname": "shell" },
          "chartsType": "pie_chart",
          "xAxisLabels": ["tagname"],
          "yAxisLabels": [
            { "column": "count", "agg": "count" },
            { "column": "size", "agg": "sum", "key": "size" }
          ],
          "zAxisLabel": {},
          "customParams": {
            "match": [{ "tagcategory": "道路" }],
            "distinct": ["datasetid"]
          },
          "customQuery": []
        }
        this.allData.activeContent.x = "tagname"
      } else if (this.value2 === '场景') {
        paramObject = {
          "dataSource": { "db_type": "mongo", "table_name": "DatasetOverview", "dbname": "shell" },
          "chartsType": "pie_chart",
          "xAxisLabels": ["tagname"],
          "yAxisLabels": [
            { "column": "count", "agg": "count" },
            { "column": "size", "agg": "sum", "key": "size" }
          ],
          "zAxisLabel": {},
          "customParams": {
            "match": [
              { "tagcategory": { "$in": ["自定义场景", "行为交互"] } }
            ],
            "distinct": ["datasetid"]
          },
          "customQuery": []
        }
        this.allData.activeContent.x = "tagname"
      } else if (this.value2 === '城市') {
        paramObject = {
          "dataSource": { "db_type": "mongo", "table_name": "DatasetOverview", "dbname": "shell" },
          "chartsType": "pie_chart",
          "xAxisLabels": ["city"],
          "yAxisLabels": [
            { "column": "count", "agg": "count" },
            { "column": "size", "agg": "sum", "key": "size" }
          ],
          "zAxisLabel": {},
          "customParams": {
            "match": [],
            "distinct": ["datasetid"]
          },
          "customQuery": []
        }
        this.allData.activeContent.x = "city"
      }


      func_charts_adapter(paramObject).then(res => {
        this.allData.data = res.data
      })
    },
    formatter(thistime, fmt) {
      if (!thistime) return '--';
      const isUTC = String(thistime).indexOf('Z') > -1 ? 'UTC' : '';
      let $this = new Date(thistime);
      let o = {
        'M+': $this[`get${isUTC}Month`]() + 1,
        'd+': $this[`get${isUTC}Date`](),
        'h+': $this[`get${isUTC}Hours`](),
        'm+': $this[`get${isUTC}Minutes`](),
        's+': $this[`get${isUTC}Seconds`](),
        'q+': Math.floor(($this[`get${isUTC}Month`]() + 3) / 3),
        'S': $this[`get${isUTC}Milliseconds`]()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this[`get${isUTC}FullYear`]() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt;
    },
    byteToTB(e) {
      let byte = e
      if (byte > 0) {
        let kb = byte / 1024
        if (kb >= 1024) {
          let mb = kb / 1024
          if (mb >= 1024) {
            let gb = mb / 1024
            if (gb >= 1024) {
              let tb = gb / 1024
              return tb.toFixed(1) + 'TB'
            } else {
              return gb = gb.toFixed(1) + 'GB'
            }
          } else {
            return mb = mb.toFixed(1) + 'MB'
          }
        } else {
          return kb = kb.toFixed(1) + 'KB'
        }
      } else {
        return '0KB'
      }
    },
  }
}
</script>

<style lang="scss">
.asset-overview {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 20px;

    .btn-add {
      .el-button--primary {
        background: #FF7900;
        border-color: #FF7900;
        border-radius: 8px;
      }
    }

    .title {
      display: flex;
      align-items: center;

      .Grey-Background-box {
        width: 40px;
        height: 40px;
        background: #F3F4F7;
        border-radius: 8px;
      }

      span {
        /* Header/text-3xl/I-EL-Medium */
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 28px;
        line-height: 40px;
        /* identical to box height, or 143% */
        /* 01 Netural/N700 */
        color: #2D2F39;
        margin-left: 12px;
      }
    }
  }

  .data-show {
    flex: 1;
    display: flex;
    padding: 10px;

    .data-show-item {
      background: #f9f9fb;
      flex: 1;
      margin: 0 10px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      position: relative;
      min-height: 120px;

      .date {
        position: absolute;
        bottom: 10px;
        font-size: 14px;
        color: #5a5e72;
      }

      .content {
        text-align: center;

        .num {
          color: #2D2F39;
          font-size: 24px;
          font-style: normal;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .title {
          font-weight: 600;
          font-size: 18px;
          color: #5a5e72;
        }
      }
    }
  }

  .chart-show {
    height: 400px;
    padding: 0 20px;

    .chart-show-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;

      .title {
        color: #2D2F39;
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
      }

      .el-select {
        width: 300px;
        margin-left: 20px;
      }
    }
  }
}
</style>