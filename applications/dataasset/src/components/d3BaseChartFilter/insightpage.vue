
<template>
  <div class="insight-page" ref="insightPage" :style="getinsightPageStyle()">
      <div class="project_info_left">
          <insightComponent v-if="isMounted"
            class="insight-content"
            :policy="currentPolicy"
            :initHeight="allData.initHeight"
            :initWidth="allData.initWidth"
            :allData="allData"
            :policy-name="activeContent.policyName"
            :x-property="activeContent.x"
            :y-property="activeContent.y"
            v-on:x-property="changeXProperty"
            v-on:y-property="changeYProperty"
            v-on:changePolicy="changePolicy"
            :needTitle="allData.needTitle" 
            :dashboardTitle="allData.initTitle"
            ref="histogram"/>
      </div>
  </div>
</template>
<script>
import insightComponent from "./insight-container"
// import PhSlideModel from "./slide-model/slide-model"
import PhHistogramDatasource from "@/components/d3BaseChartFilter/model/datasource"

// 图标类型
import StackPolicy from "@/components/d3BaseChartFilter/render-policy/stack-policy"
import ScatterplotPolicy from "@/components/d3BaseChartFilter/render-policy/scatterplot-policy"
import LinesPolicy from "@/components/d3BaseChartFilter/render-policy/lines-policy"
import BarPolicy from "@/components/d3BaseChartFilter/render-policy/bar-policy"
import PiePolicy from "@/components/d3BaseChartFilter/render-policy/pie-policy"
import multiBarPolicy from "@/components/d3BaseChartFilter/render-policy/multi-column-bar-policy"
import ganttPolicy from "@/components/d3BaseChartFilter/render-policy/gantt-policy"
import distributeTablePolicy from "@/components/d3BaseChartFilter/render-policy/distribute-table-policy"
import statisticPolicy from "@/components/d3BaseChartFilter/render-policy/statistic-policy"
import arcPiePolicy from "@/components/d3BaseChartFilter/render-policy/arc-pie-policy"
import shadeLinesPolicy from "@/components/d3BaseChartFilter/render-policy/shade-lines-policy"

export default {
  props: {
      allData: {
          type: Object,
          default:() => ({})
      }
  },
  components: {
      insightComponent
  },
  data: () => {
      return {
          isMounted: 0,
          currentPolicy: null,
          activeContent: {}
      }
  },
  mounted () {
      this.isMounted++
  },
  methods: {
      getinsightPageStyle() {
        const width = this.allData.initWidth || 100
        const height = this.allData.initHeight || 100
        return "width: " + width + "px; height: " + height + "px;"
      },
      createPolicyWithinContent() {
          const content = this.activeContent
          // TODO: 这个是一个工厂类，在写的时候，可以运用外部单例，因为这个函数会被多次用到
          // 不会写就多写cv次这个函数吧
          if (content.policyName === "bar") {
              const policy =  new BarPolicy(
                  //id
                  content.index, 
                  // 数据
                  new PhHistogramDatasource(content.index, this.allData.data),
                  // 配置
                  { xProperty: content.x, yProperty: content.y }
              )
              return policy
          }
          else if (content.policyName === "arcPie") {
              return new arcPiePolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  { xProperty: content.x, yProperty: content.y })
          }
          else if (content.policyName === "pie") {
              return new PiePolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  { xProperty: content.x, yProperty: content.y })
          }
          else if (content.policyName === "stack") {
              return new StackPolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  { xProperty: content.x, yProperty: content.y, zProperty: content.z })
          }
          else if (content.policyName === "scatterplot") {
              return new ScatterplotPolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  { xProperty: content.x, yProperty: content.y })
          }
          else if (content.policyName === "lines") {
              return new LinesPolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  {xProperty: content.x, yProperty: content.y})

          }
          else if (content.policyName === "shadeLines") {
              return new shadeLinesPolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  {xProperty: content.x, yProperty: content.y})

          }
          else if (content.policyName === "multiBar") {
              return new multiBarPolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  {xProperty: content.x, yProperty: content.y})

          }
          else if (content.policyName === "gantt") {
              return new ganttPolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  {xProperty: content.x, yProperty: content.y, zProperty: content.z})

          }
          else if (content.policyName === "distributeTable") {
              return new distributeTablePolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  {xProperty: content.x, yProperty: content.y, zProperty: content.z})
          }
          else if (content.policyName === "statisticPolicy") {
              return new statisticPolicy(content.index,
                  new PhHistogramDatasource(content.index, this.allData.data),
                  {xProperty: content.x, yProperty: content.y, zProperty: content.z})
          }
          else {

          }
      },
      changePolicy(param) {
          const content = this.activeContent
          content.policyName = param.args.name
          this.currentPolicy = this.createPolicyWithinContent()
          this.currentPolicy.datasource.defaultData = this.allData.data
          this.$refs.histogram.needRefreshData++
      },
      changeXProperty(param) {
          // const content = this.activeContent
          // content.x = param.args.xProperty
          // this.currentPolicy.xProperty = content.x
          this.currentPolicy.datasource.xAxisData = param.args.xProperty
          this.$refs.histogram.needRefreshData++
      },
      changeYProperty(param) {
          const content = this.activeContent
          content.y = param.args.yProperty
          this.currentPolicy.yProperty = content.y
          this.$refs.histogram.needRefreshData++
      },
  },
  watch: {
      allData: {
          handler(newValue) {
            this.activeContent = newValue.activeContent
            this.currentPolicy = this.createPolicyWithinContent()
            this.currentPolicy.datasource.defaultData = newValue.data
          },
          deep: true,
          immediate: true,
      }
  }
}
</script>

<style scoped lang="scss">
  .insight-page {
      display: flex;
      width: 100%;
      height: calc(100vh - 60px);

      .project_info_left {
          flex: 1;
          // border-right: 1px solid #dddddd;
          .page_header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 40px;
              border-bottom: 1px solid #ccc;
              .left {
                  display: flex;
                  align-items: center;
                  img {
                      height: 40px;
                  }
                  .name {
                      padding-left: 5px;
                      font-weight: bold;
                  }
              }
              .right {
                  display: flex;
                  align-items: center;
                      padding-right: 20px;
                  .text {
                      margin-right: 10px;
                      font-weight: bold;
                      height: 40px;
                      display: flex;
                      align-items: center;
                      cursor: pointer;
                  }
                  .panl {
                      height: 32px;
                      display: flex;
                      align-items: center;
                      background: #5342B3;
                      color: #fff;
                  }
                  .borderBold {
                      border-bottom: 1px solid #666;
                  }
              }
          }
          // .insight-content {
          //     height: calc(100vh - 88px);
          // }
          .page_footer {
              display: flex;
              padding: 0 20px;
              height: 40px;
              border-top: 1px solid #ccc;
              .slide_item {
                  display: flex;
                  align-items: center;
                  margin-right: 20px;
                  .slide_name {
                      cursor: pointer;
                      padding-right: 5px;
                  }
                  .del_icon {
                      width: 20px;
                      cursor: pointer;
                  }
              }
              .add_icon {
                  width: 20px;
                  cursor: pointer;
              }
          }
      }
      .project_info_right {
          width: 500px;
          .view_content {
              width: 100%;
              height: 260px;
              border-bottom: 1px solid #dddddd;

              .view_func {
                  margin-top: 100px;
                  display: flex;
                  justify-content: space-between;
                  padding: 0 30px;
                  .view_list {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      width: 75px;
                  }
                  .tags_imgs_tag {
                      width: 20px;
                  }
              }

              .tags_func {
                  cursor: pointer;
              }

              .project_name_view {
                  display: flex;
                  width: 100%;
                  height: 60px;
                  border-bottom: 1px solid #979797;
                  height: 44px;
                  .space {
                      display: flex;
                      width: 60px;
                      height: 60px;
                      background: #dfe7ff;
                      border-bottom: 2px solid #979797;
                      border-right: 2px solid #979797;
                      height: 44px;
                      width: 44px;
                      min-width: 44px;
                      justify-content: center;
                      align-items: center;
                      img {
                          width: 44px;
                          height: 44px;
                      }
                  }
                  .show-name {
                      line-height: 44px;
                      .project_name_info {
                          margin-left: 20px;
                          font-family: PingFangSC-Medium;
                          font-size: 14px;
                          color: #000000;
                          font-weight: 600;
                          height: 44px;
                          white-space: nowrap;
                          overflow: hidden;
                          width: 350px;
                          text-overflow: ellipsis;
                          cursor: pointer;
                      }
                  }
              }
          }
      }
  }
</style>
