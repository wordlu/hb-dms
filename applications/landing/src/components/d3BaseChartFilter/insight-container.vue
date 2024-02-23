<template>
    <div class="page">
        <div v-if="needTitle" class="title-panel">
            <!-- <img :src="img1" /> -->
            <h2>{{dashboardTitle}}</h2>
        </div>
        <div class="container" >
            <div class="right">
                <div class="axis-container">
                    <div class="axis">
                      <el-form
                        ref="form"
                        :inline="true"
                        :size="small"
                        label-position="left"
                      >
                        <el-form-item label="图表类型" >
                          <el-select v-model="tmpPolicyName" class="m-1" placeholder="Select" :size="small">
                            <el-option
                              v-for="(item,index) in policyCandidate"
                              :key="index+'type'"
                              :label="item.name"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="X轴" >
                          <el-select 
                            v-model="XAxisArray" 
                            class="m-1 tags-select-input"
                            placeholder="请选择" clearable
                            collapse-tags collapse-tags-tooltip 
                            :size="small" multiple>
                            <el-option
                              v-for="(item,index) in getXData(allData)"
                              :key="index+'type'"
                              :label="item"
                              :value="item"
                            />
                          </el-select>
                        </el-form-item>
                      </el-form>
                    </div>
                </div>
                <div class="content" ref="content">
                    <histogram ref="histogram" :policy="policy" :initHeight="initHeight" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import histogram from "@/components/d3BaseChartFilter/insight.vue"
export default {
    name: "insight-container",
    props: {
        dashboardTitle: {
            type: String,
            default: "wodelu test"
        },
        initHeight: {
            type: Number,
            default: 200
        },
        needTitle: {
            type: Boolean,
            default: true
        },
        policy: {
            type: Object,
            default: function() {
                return null
            }
        },
        allData: Object,
        xProperty: String,
        yProperty: String,
        policyName: String
    },
    data: () => {
        return {
            policyCandidate: [
                {
                    "name": "统计图",
                    "value": "statisticPolicy"
                },
                {
                    "name": "分布图",
                    "value": "distributeTable"
                },
                {
                    "name": "分段统计图",
                    "value": "gantt"
                },
                {
                    "name": "柱状图",
                    "value": "bar"
                },
                {
                    "name": "多列柱状图",
                    "value": "multiBar"
                },
                {
                    "name": "饼图",
                    "value": "pie"
                },
                {
                    "name": "环形饼图",
                    "value": "arcPie"
                },
                {
                    "name": "堆叠图",
                    "value": "stack"
                },
                {
                    "name": "折线图",
                    "value": "lines"
                },
                // {
                //     "name": "遮罩折线图",
                //     "value": "shadeLines"
                // },
                {
                    "name": "散点图",
                    "value": "scatterplot"
                }
            ],
            YAxisArray: [],
            XAxisArray: [],
            draggingItem: null,
            needRefresh: 0,
            needRefreshData: 0,
            lst: [],
            activeName: "first",
            activeCandis: [],
            filterString: "",
            tmpPolicyName: "bar",
        }
    },
    components: {
        histogram
    },
    mounted() {
        const w = this.$refs.content.offsetWidth
        const h = this.$refs.content.offsetHeight
        this.$refs.histogram.resizeHandler(w, h)

        this.needRefresh++ //渲染图表
        this.$refs.histogram.schemaIsReady++ //渲染图表数据
    },
    updated() {
        this.tmpPolicyName = this.policyName
    },
    methods: {
        getXData(data) {
          if (data.data && data.data.length > 0) {
            const arr =  data.data.map(it => it[this.xProperty])
            this.XAxisArray = arr
            
            return arr;
          }
          return []
        },
        refresh() {
            if (this.policy) {
                this.$refs.histogram.needRefresh++
            }
        },
        dragStart(event, index, item) {
            this.draggingItem = item
        },
        dragEnd() {
            this.clearDraggingStatus()
        },
        dropContentX(data) {
            // this.xProperty = this.draggingItem
            const event = new Event("x-property")
            event.args = {
                "xProperty": data
            }
            this.$emit("x-property", event)
            this.clearDraggingStatus()
        },
        dropContentY(_) {
            // this.yProperty = this.draggingItem
            const event = new Event("y-property")
            event.args = {
                "yProperty": this.draggingItem
            }
            this.$emit("y-property", event)
            this.clearDraggingStatus()
        },
        clearDraggingStatus() {
            if (this.draggingItem) {
                this.draggingItem = null
            }
        },
        isNum(index) {
            return this.policy.schema.dtype[index] !== "String"
        }
    },
    watch: {
        XAxisArray: {
          handler(newValue) {
            this.dropContentX(newValue)
          },
          deep: true
        },
        tmpPolicyName(n, o) {
            if (n !== o) {
                const event = new Event("event")
                event.args = {
                    name: n
                }
                this.$emit("changePolicy", event)
            }
        },
        needRefresh(n, o) {
            this.refresh()
        },
        needRefreshData(n, o) {
            this.$refs.histogram.schemaIsReady++
        },
        policy(n, o) {
            this.needRefresh++
        },
    }
}
</script>

<style scoped lang="scss">

    .tags-select-input {
      height: 32px;
    }
    .tags-select-input ::v-deep .el-select__tags {
      height: 32px;
      word-break:keep-all;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .tags-select-input ::v-deep .el-select-tags-wrapper.has-prefix {
      display: flex;
    }
    .page {
        display: flex;
        flex-direction: column;
        // min-height: 100vh;
        .title-panel {
            display: flex;
            flex-direction: row;
            background-color: grey;
            height: 45px;

            img {
                width: 40px;
                height: 40px;
                margin: auto 0;
                border: 2px solid gray;
                padding: 1px;
            }

            h2 {
                margin: auto 0;
            }
        }

        .container {
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            flex-direction: row;

            .left {
                display: flex;
                flex-direction: column;
                width: 300px;
                border: 2px solid grey;
                margin-right: 5px;
                padding-top: 20px;
                .draggable-item {
                    margin: 5px 10px;
                    padding: 5px 10px;
                    border-radius: 4px;
                    border: 1px solid rgba(0, 0, 0, .12);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                    font-size: 14px;

                    .num {
                        b {
                            color: darksalmon;
                        }
                    }

                    .text {
                        b {
                            color: darkgoldenrod;
                        }
                    }
                }
            }

            .filter-panel {
                width: 300px;
                padding-top: 30px;

                .bottom-filter {
                    margin: 50px 5px 5px 5px;
                    padding: 5px 0;
                }
            }

            .right {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                padding: 20px;
                .chart-type {
                    flex-grow: 1;
                    margin-right: 200px;
                    height: 40px;
                    margin-bottom: 4px;
                }
                .axis-container {
                    .axis {
                        display: flex;
                        flex-direction: row;

                        .axis-title {
                            margin: auto 0;
                            width: 100px;
                            min-width: 100px;
                            text-align: right;
                            margin-right: 20px;
                        }

                        span {
                            margin: auto 0;
                            width: 50px;
                        }

                        .drop {
                            display: flex;
                            flex-direction: row;
                            flex-grow: 1;
                            margin-right: 200px;
                            margin-top: 5px;
                            margin-bottom: 5px;
                            padding-left: 20px;
                            border: 1px solid rgba(0, 0, 0, .12);
                            // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                            height: 40px;
                            border-radius: 4px;
                            align-items: center;
                            span {
                                margin: auto 0;
                            }

                            p {
                                flex-grow: 1;
                                text-align: left;
                            }
                        }
                    }
                }

                .content {
                    flex-grow: 1;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    display: flex;
                    /*background-color: red;*/
                }
            }
        }
    }
</style>
