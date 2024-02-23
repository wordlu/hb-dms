<template>
  <div class="infoContainer">
    <div class="header">
      <div class="projectSVG">
        <img v-if="projectInfo.avatar" :src="'/'+projectInfo.avatar" alt="" style="width:96px;height:96px">
        <img v-else src="/icon/default/场景挖掘项目.svg" alt="" style="width:96px;height:96px">
      </div>

      <div class="project-desc">
        <span class="project-name">
          {{ projectInfo.name }}
        </span>
        <span class="project-explain">
          {{ projectInfo.description }}
        </span>
      </div>

      <el-button type="primary" @click="toFlow">Flow<i class="el-icon-caret-right el-icon--right"></i></el-button>
    </div>
    <!-- <insightpage :allData="allData" /> -->
  
    <div class="statistics">
      <div class="statistics-item" v-for="(item, index) in statisticsList" @click="toPath(item)" :key="index">
        <div class="White-background"></div>
        <div class="statistics-item-up">
          <img class="projectInfoStatistics" :src="item.icon" alt="" style="width:60px;height:60px">
          <div class="statistics-project-info">
            <div class="statistics-item-label">
              {{ item.label }}
            </div>
            <div class="statistics-item-number">
              {{ item.Count }}
            </div>
          </div>
        </div>
        <svg-icon icon-class="projectInfoRight" class="projectInfoRight" style="width:40px;height:40px"/>
      </div>
    </div>

    <div v-if="projectInfo.name === 'KPI' || projectInfo.name === '测迅自动化真值处理'">
      <!-- <div class="md-content" v-html="descriptionMData"></div> -->
      <div class="md-content" v-html="descriptionMData"></div> 
    </div>
    <div class="charts" v-else>
      <div class="charts-title">
        <span>
          统计数据
        </span>
        <svg-icon icon-class="projectHomeSet" class="projectHomeSet" style="width:18px;height:18px" />
      </div>
      <div class="charts-item" id="d3Chart">
        <div class="chart-left">
          <span>按场景类型统计个数（个）</span>
          <div id="bar"></div>
        </div>

        <div class="chart-right">
          <span>按场景类型统计持续时间（s）</span>
          <div id="pie" style="display: flex; justify-content: center;">
            <div id="pieLegend" style="height: 260px;overflow-y:auto;overflow-x:hidden;margin-top: 20px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsCookie from 'js-cookie'
import showdown from 'showdown'
import barChartVue from './charts/barChart.vue'
import * as d3 from "d3";
import { fetchProjectSceneStatistics, getMdData } from '@/api/flow';
import insightpage from '@/components/d3BaseChartFilter/insightpage.vue'
export default {
  components: {
    barChartVue,
    insightpage
  },
  data() {
    return {
      descriptionMData: '',
      projectInfo: {},
      allData: {
        data: [],
        activeContent: {
          policyName: 'bar',
          index: 1,
        },
        initHeight: 500,
        initWidth: 900,
      },
      statisticsList: [
        {
          label:"数据集",
          Count:0,
          icon:'/icon/default/数据集首页图标.svg'
        },{
          label:"算法",
          Count:0,
          icon:'/icon/default/算法首页小图标.svg'
        },{
          label:"连接器",
          Count:0,
          icon:'/icon/default/连接器.svg'
        }
      ],
      flowId: null
    }
  },
  async created() {
    await this.getprojectInfo()
    this.getDataSet()
    this.getScripts()
    this.getConnectors()
   
  },
  methods: {
    getPie(listData) {
      const res = listData.data.stat_data
      const list = res.filter(it => it.duration_s && it.duration_s > 0)
      const dataList = list.map(it => it.duration_s)
      const dataNameList = list.map(it => it.scenes_name)
      const legendHeight = list.length * 20
      // 将源数据转换为可以生成饼图的数据
      let piedata = d3.pie()(dataList);
      // 画布参数
      let mapWidth = 260;
      let mapHeight = 260;
      let mapPadding = 10
      // 定义画布
      let svgMap = d3.select("#pie")
        .append('svg')
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .style("margin", "10px")
      let svgLegend = d3.select("#pieLegend")
        .append('svg')
        .attr("width", 140)
        .attr("height", legendHeight)
        .style("margin", "10px")
        // .style("overflow", "unset")
      //定义弧形生成器
      let innerRadius = 0;
      let outerRadius = mapWidth / 2 - mapPadding;
      let arc_generator = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      
      let groups = svgMap.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")
        .attr("transform", "translate(" + (mapWidth / 2) + "," + (mapHeight / 2) + ")")
        // .attr('stroke', 'white')
        // .attr('stroke-width', 1) //分割线

      let colorScale = d3.scaleOrdinal()
            .domain(d3.range(piedata.length))
            .range(d3.schemeSet3);
      
      // 绘制饼图
      groups.append("path")
        .attr("fill", function (d, i) {
          return colorScale(i);
        })
        .attr("d", function (d) {
          return arc_generator(d);
        })
      
      // 添加文字
      // groups.append("text")
      //   .attr("transform", function (d) {
      //     //位置设在中心处
      //     return "translate(" + arc_generator.centroid(d) + ")";
      //   })
      //   .attr("text-anchor", "middle")
      //   .text(function (d, i) {
      //     return d.data
      //   })
      
      const tooltip = d3.select("#d3Chart")
				.append("div")
				.attr("class","tooltip")
				.style("opacity",0.0);
      
      groups.on("mouseover",function(event, d){
        d3.select(this)
            .transition()
            .duration(10)
            .style("opacity",0.8);
        tooltip.html(`${dataNameList[d.index]} - ${d.data}s`)
          .style("left",(event.pageX)+"px")
          .style("top",(event.pageY+20)+"px")
          .style("opacity",1.0);
        })
        .on("mousemove",function(event, d){
          tooltip.style("left",(event.pageX)+"px")
                 .style("top",(event.pageY+20)+"px");
        })
        .on("mouseout",function(d){
          d3.select(this)
            .transition()
            .duration(10)
            .style("opacity",1);
          //鼠标移除 透明度设为0
          tooltip.style("opacity",0.0);
        })

      const legend = svgLegend.append('g').attr('transform', 'translate(10, 0)')

      legend.selectAll('rect').data(dataNameList).enter()
          .append('circle')
          .attr('r', 7)
          .attr('cy', (v, i) => { return i*20+5 })
          .attr("fill", function (d, i) {
            return colorScale(i);
          })

      legend.selectAll('text').data(dataNameList).enter()
          .append('text')
          .text((v, i) => { return v })
          .attr('x', 15)
          .attr('y', (v, i) => { return i*20+10 })
          .attr('font-size', '0.8em')
    },
    getlist(listData) {
      const res = listData.data.stat_data
      /* 制作画布 */
      let width = 800;
      let height = 280;
      let svg = d3.select("#bar")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      
      let padding = { left: 30, right: 30, top: 20, bottom: 60 };
      const list = res.filter(it => it.count_num && it.count_num > 0)
      const datas = list.map(it => it.count_num)
      const category = list.map(it => it.scenes_name)

            
      const key=function(d){
          return d.scenes_name;
      };

      /* 定义坐标轴比例尺 */
      const ranges = d3.range(datas.length)
      const max = d3.max(datas);
      let xScale = d3.scaleBand()
        .domain(ranges)
        .range([0, width - padding.left - padding.right])
      let yScale = d3.scaleLinear()
        .domain([0, max])//值域范围
        .range([height - padding.top - padding.bottom, 0]);

      /* 定义坐标轴 */
      let xAxis = d3.axisBottom(xScale);
      let yAxis = d3.axisLeft(yScale);

      /* rect */
      //矩形之间的空白
      let rectPadding = 16;
      const barWidth = 30;
      //添加矩形元素
      svg.selectAll(".Rect")
        .data(list, key)
        .enter()
        .append("rect")
        .attr("class", "Rect")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("x", function (d, i) {
          return xScale(i) + rectPadding / 2 + (xScale.bandwidth() - rectPadding - barWidth) / 2;
        })
        .attr("y", function (d, i) {
          return yScale(d.count_num);
        })        
        .attr("width", barWidth)
        .attr("height", function (d) {
          return height - padding.top - padding.bottom - yScale(d.count_num);
        })
        .attr("fill", "#4a92ff");
      //添加文字元素
      let texts = svg.selectAll(".MyText")
        .data(datas)
        .enter()
        .append("text")
        .attr("class", "MyText")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("x", function (d, i) {
          return xScale(i) + rectPadding / 2;
        })
        .attr("y", function (d) {
          return yScale(d);
        })
        .attr("dx", function () {
          return (xScale.bandwidth() - rectPadding * 2) / 2;
        })
        .attr("dy", function (d) {
          return -2;
        })
        .text(function (d) {
          return d;
        })

      /* 添加坐标轴元素 */
      //添加X轴
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis)
        .selectAll('text')
        .text((d, i) => category[i])
        .style('font-size', '11px')
        .style('transform', 'rotate(24deg)')
        .style('text-align', 'right')
        .style("text-anchor", "start")
      //添加Y轴
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis)

      const tooltip=d3.select("#d3Chart")
				.append("div")
				.attr("class","tooltip")
				.style("opacity",0.0);
      
      svg.selectAll(".Rect")
        .on("mouseover",function(event, d){
          d3.select(this)
            .transition()
            .duration(10)
            .style("opacity",0.8);
          tooltip.html(`${d.scenes_name} - ${d.count_num}个`)
            .style("left",(event.pageX)+"px")
            .style("top",(event.pageY+20)+"px")
            .style("opacity",1.0);
        })
        .on("mousemove",function(event, d){
          tooltip.style("left",(event.pageX)+"px")
                 .style("top",(event.pageY+20)+"px");
        })
        .on("mouseout",function(d){
          d3.select(this)
            .transition()
            .duration(10)
            .style("opacity",1);
          tooltip.style("opacity",0.0);
        })
    },
    clearChart() {
      d3.select("#pie").selectAll('svg').remove()
      d3.select("#bar").selectAll('svg').remove()
    },
    toFlow() {
      this.$router.push({
        name: 'projectFlow', params: {
          id: this.$route.params.id
        }
      })
    },
    toPath(item) {
      if (item.label == "数据集") {
        this.$router.push(`/project/dataSetList/${this.$route.params.id}`)
      } else if (item.label == "算法") {
        this.$router.push(`/project/scriptList/${this.$route.params.id}`)
      } else if (item.label == "连接器") {
        this.$router.push(`/project/connectorList/${this.$route.params.id}`)
      // } else if (item.label == "算法感知评测") {
      //   this.$router.push(`/project/scriptPEList/${this.$route.params.id}`)
      }
    },
    async getAllChart() {
      const pieData = await fetchProjectSceneStatistics({ project: this.$route.params.id, statistics_name: 'scene_durations' })
      const barData = await fetchProjectSceneStatistics({ project: this.$route.params.id, statistics_name: 'scene_count' })
      this.allData.data = barData.data.stat_data
      this.allData.activeContent.x = 'scenes_name'
      this.allData.activeContent.y = 'count_num'
      this.clearChart()
      this.getlist(barData)
      this.getPie(pieData)
    },
    mdToHtml(text) {
      const converter = new showdown.Converter()
      return converter.makeHtml(text);
    },
    getprojectInfo(){
      this.$api['findItem']('projects',this.$route.params.id).then(res=>{
        this.projectInfo = res.attributes
        this.flowId = res.relationships.flow.data ? res.relationships.flow.data.id : ''
        jsCookie.set('flowId', this.flowId)
        if (this.projectInfo.name === 'KPI') {
          getMdData({ path: 'icon/default/kpi.md'}).then(data => {
            this.descriptionMData = this.mdToHtml(data)
          })
        } else if (this.projectInfo.name === '测迅自动化真值处理') {
          getMdData({ path: 'icon/default/alt.md'}).then(data => {
            this.descriptionMData = this.mdToHtml(data)
          })
        } else {
          this.getAllChart()
        }
      })
    },
    getDataSet() {
      this.$api['findAll']('datasets', { project: this.$route.params.id, "filter[created][min]":'2000-01-01 00:00:00' }).then(res => {
        this.statisticsList[0].Count = res.count
      })
    },
    getScripts() {
      this.$api['findAll']('scripts', { project: this.$route.params.id }).then(res => {
        this.statisticsList[1].Count = res.count
      })
    },
    getConnectors() {
      this.$api['findAll']('connectors', { project: this.$route.params.id }).then(res => {
        this.statisticsList[2].Count = res.count
      })
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1800px) {
  .chart-left, .chart-right {
    overflow: auto;
  }
}
.tooltip{
	position: absolute;
	width: 120px;
	height: auto;
  padding: 10px;
	font-family: simsun;
	font-size: 14px;
	text-align: center;
	color: #fff;
  // border: 2px solid #FF7900;
	// background-color: #fff;
	border-radius: 5px;

  box-shadow: 0px 8px 16px 0px #00000014;
  background: #0B0C0EBF;
}

.infoContainer {
  width: 77%;
  padding-right: 24px;

  .md-content {
    color: #5A5E72;
    overflow: auto;
    line-height: 22px;
    padding: 12px 24px;
    margin-top: 20px;
    h1, h2, h3, h4 {
      color: #2D2F39;
      line-height: 28px;
    }
    * {
      white-space: pre-wrap;
    }
  }

  .header {
    width: 100%;
    display: flex;
    position: relative;
    margin-left: 20px;

    .projectSVG {
      width: 96px;
      height: 96px;
      background: #F3F4F7;
      border-radius: 8px;
    }

    .project-desc {
      margin-left: 16px;
      display: flex;
      flex-direction: column;

      .project-name {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 28px;
        line-height: 40px;
        color: #2D2F39;
      }

      .project-explain {
        width: 480px;
        margin-top: 12px;
        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        /* or 157% */


        /* 01 Netural/N500 */

        color: #5A5E72;

      }
    }

    .el-button--primary {
      width: 120px !important;
      height: 40px !important;
      background: #FF7900;
      border-color: #FF7900;
      position: absolute;
      right: 24px;
      top: 10px;
    }
  }

  .statistics {
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
  }

  .charts {
    margin-top: 40px;

    .charts-title {
      margin-bottom: 24px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        /* identical to box height, or 140% */


        /* 01 Netural/N700 */

        color: #2D2F39;
      }
    }

    .charts-item {
      width: 100%;
      display: flex;
      margin-bottom: 10px;

      .chart-left {
        width: 60%;
        height: 330px;
        padding-top: 10px;
        text-align: center;
        font-weight: 400;
        font-size: 16px;
        color: #2D2F39;
        // background: rgba($color: #000000, $alpha: .1);
        /* 01 Netural/N040 */

        border: 1px solid #F3F4F7;
        /* Light/Depth-Z100 */

        box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.04);
        border-radius: 12px;
        margin-left: 24px;

      }

      .chart-right {
        width: calc(40% - 24px);
        min-width: 430px;
        padding-top: 10px;
        height: 330px;
        font-weight: 400;
        font-size: 16px;
        color: #2D2F39;
        text-align: center;
        // background: rgba($color: #000000, $alpha: .3);
        /* 01 Netural/N040 */

        border: 1px solid #F3F4F7;
        /* Light/Depth-Z100 */

        box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.04);
        border-radius: 12px;
        margin-left: 24px;
      }
    }
  }
}

@media (min-width:1439px) {
  .statistics-item {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    width: 330px;
    height: 128px;
    padding: 32px 24px;
    margin-left: 24px;
    /* 01 Netural/N020 */

    background: #F9F9FB;
    /* 01 Netural/N040 */

    border: 1px solid #F3F4F7;
    /* Light/Depth-Z200 */

    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 16px;

    .White-background {
      position: absolute;
      left: 64px;
      top: 8px;
      width: 258px;
      height: 112px;
      /* 01 Netural/N000 */

      background: #FFFFFF;
      /* Light/Depth-Z100 */

      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.04);
      border-radius: 12px;
    }

    // 升级层级
    .statistics-item-up {
      position: absolute;
      left: 24px;
      top: 32px;
      display: flex;
      align-items: center;

      .statistics-project-info {
        height: 60px;
        margin-left: 24px;

        .statistics-item-label {
          text-align: center;
          font-family: 'Noto Sans SC';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          /* identical to box height, or 150% */


          /* 01 Netural/N700 */

          color: #2D2F39;
        }

        .statistics-item-number {
          /* Header/text-4xl/I-EL-Medium */

          font-family: 'Poppins';
          font-style: normal;
          font-weight: 600;
          font-size: 32px;
          line-height: 48px;
          /* identical to box height, or 150% */


          /* 01 Netural/N700 */

          color: #2D2F39;
        }
      }
    }

    .projectInfoRight {
      position: absolute;
      right: 24px;
      top: 44px;
    }
  }
}

@media (max-width:1439px) {
  .statistics{
    justify-content: space-between;
    margin-left: 24px;
  }
  .statistics-item {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    width: calc((100% - 48px) / 3);
    height: 128px;
    padding: 32px 24px;
    // margin-left: 24px;
    /* 01 Netural/N020 */

    background: #F9F9FB;
    /* 01 Netural/N040 */

    border: 1px solid #F3F4F7;
    /* Light/Depth-Z200 */

    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 16px;

    .White-background {
      position: absolute;
      left: 64px;
      top: 8px;
      width: calc(100% - 74px);
      height: 112px;
      /* 01 Netural/N000 */

      background: #FFFFFF;
      /* Light/Depth-Z100 */

      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 2px 4px rgba(0, 0, 0, 0.04);
      border-radius: 12px;
    }

    // 升级层级
    .statistics-item-up {
      position: absolute;
      left: 24px;
      top: 32px;
      display: flex;
      align-items: center;

      .statistics-project-info {
        height: 60px;
        margin-left: 24px;

        .statistics-item-label {
          text-align: center;
          font-family: 'Noto Sans SC';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          /* identical to box height, or 150% */


          /* 01 Netural/N700 */

          color: #2D2F39;
        }

        .statistics-item-number {
          /* Header/text-4xl/I-EL-Medium */

          font-family: 'Poppins';
          font-style: normal;
          font-weight: 600;
          font-size: 32px;
          line-height: 48px;
          /* identical to box height, or 150% */


          /* 01 Netural/N700 */

          color: #2D2F39;
        }
      }
    }

    .projectInfoRight {
      position: absolute;
      right: 24px;
      top: 44px;
    }
  }
}
</style>