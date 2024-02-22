/* 多列柱状图 */
import policy from "./policy"

export default class PhBarChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.title = undefined
        this.marginTop = 20         // the top margin, in pixels
        this.marginRight = 20        // the right margin, in pixels
        this.marginBottom = 30      // the bottom margin, in pixels
        this.marginLeft = 40        // the left margin, in pixels
        this.width = 640            // the outer width of the chart, in pixels
        this.height = 400           // the outer height of the chart, in pixels
        this.xPadding = 0.3        // amount of x-range to reserve to separate bars
        this.yFormat = ",f"           // a format specifier string for the y-axis

        this.xDomain = []           // an array of (ordinal) x-values
        this.yDomain = []           // an array of (ordinal) y-values

        // this.dataset = this.datasource.name
        this.xProperty = "xProperty"
        this.yProperty = "yProperty"
        this.yPropertyFunc = "max"     // avg, max, min

        this.xLabel = ""
        this.yLabel = ""
        this.color = "currentColor"

        // this.data = null
        this.resetPolicyConstraints(option)
    }

    policyName() {
        return "multiBar"
    }

    resetPolicyConstraints(option) {
        this.title = option.title ? option.title : this.title
        this.marginTop = option.marginTop ? option.marginTop : this.marginTop
        this.marginRight = option.marginRight ? option.marginRight : this.marginRight
        this.marginBottom = option.marginBottom ? option.marginBottom : this.marginBottom
        this.marginLeft = option.marginLeft ? option.marginLeft : this.marginLeft
        this.width = option.width ? option.width : this.width
        this.height = option.height ? option.height : this.height
        this.xPadding = option.xPadding ? option.xPadding : this.xPadding
        this.yFormat = option.yFormat ? option.yFormat : this.yFormat

        this.xDomain = option.xDomain ? option.xDomain : this.xDomain
        this.yDomain = option.yDomain ? option.yDomain : this.yDomain

        this.xProperty= option.xProperty ? option.xProperty : this.xProperty
        this.yProperty= option.yProperty ? option.yProperty : this.yProperty
        this.yPropertyFunc = option.yPropertyFunc ? option.yPropertyFunc : this.yPropertyFunc

        this.xLabel = option.xLabel ? option.xLabel : this.xLabel
        this.yLabel = option.yLabel ? option.yLabel : this.yLabel
        this.color = option.color ? option.color : this.color

        this.datasource = option.datasource ? option.datasource : this.datasource
        this.schema = option.schema ? option.schema : this.schema
        // this.dataset = this.datasource.name
    }

    render (d3, data, ele) {
        ele.style = `width:auto`
        if (!data || data.length === 0) {
          data = [{}]
        }
      //   this.xProperty = 'frame_id'
      //   this.yProperty = '多识别'
      //   data = [
      //     {
      //         "多识别": -1,
      //         "frame_id": 0
      //     },
      //     {
      //         "多识别": 2,
      //         "frame_id": 1
      //     },
      //     {
      //         "多识别": 0,
      //         "frame_id": 2
      //     },
      //     {
      //         "多识别": 0,
      //         "frame_id": 3
      //     },
      //     {
      //         "多识别": 1,
      //         "frame_id": 4
      //     },
      //     {
      //         "多识别": 0,
      //         "frame_id": 5
      //     },
      //     {
      //         "多识别": 0,
      //         "frame_id": 6
      //     }
      // ]
        
        // const bColor = ['#4385F4', '#34A853', '#FBBC05', '#E94335', '#01ACC2', '#AAACC2']
        const bColor = ['#FC9F3A', '#FFC999', '#FC870A', '#F70', '#CC5F00']
        let title = this.title
        const marginTop = this.marginTop
        const marginRight = this.marginRight
        const marginBottom = this.marginBottom
        const marginLeft = this.marginLeft
        const width = this.width
        const height = this.height
        const xPadding = this.xPadding
        const yFormat = this.yFormat
        const color = this.color
        const yType = d3.scaleLinear
        const xLabel = this.xLabel
        const yLabel = this.yLabel
        const legendArray = []

        const that = this
        const computeX = (item) => {
            return item[that.xProperty]
        }
        const computeY = (item) => {
          // 获取当前item的最大值
          const maxY = Object.keys(item).map(it => {
            if (it === that.xProperty) return 0
            if (!isNaN(item[it])) {
              return parseFloat(item[it])
            }
            return 0
          })
          return d3.max(maxY)
        }
        const computeXDomain = (d3, xdata) => {
            return new d3.InternSet(xdata)
        }

        const computeYDomain = (d3, ydata) => {
            return [0, d3.max(ydata)]
        }

        const computeSizeXRange = () => {
            return [marginLeft, width - marginRight]
        }

        const computeSizeYRange = () => {
            return [height - marginBottom, marginTop]
        }

        const X = d3.map(data, computeX);
        const Y = d3.map(data, computeY);

        const xDomain = computeXDomain(d3, X)
        const yDomain = computeYDomain(d3, Y)
        const xRange = computeSizeXRange()
        const yRange = computeSizeYRange()

        const I = d3.range(X.length).filter(i => xDomain.has(X[i]));
         // 组装数据 便于绘制
        const items = data.map((row) => {
          let item = []
          let index = 0
          Object.keys(row).forEach((key) => {
            // 非数据 不绘制统计图
            if (key !== that.xProperty) {
              item.push([row[that.xProperty], row[key], key, index])
              index++
            }
          })
          return item
        })

        // Construct scales, axes, and formats.
        const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
        const yScale = yType(yDomain, yRange);
        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks((height-marginBottom) / 40, yFormat);

        // 绘图区域
        const svg = d3.select(ele)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height-marginBottom])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        // Y轴
        svg.append("g")
            .attr("transform", `translate(${marginLeft}, -${marginBottom})`)
            .call(yAxis)
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .style("color", "#8D91A5")
                .text(yLabel));
        // X轴       
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom*2})`)
            .call(xAxis)
        
        // 数据
        const groups =  svg.append("g").selectAll("rect").data(items)
        const bars = groups
          .enter()
          .append('g')
          .selectAll()
          .data((d) => d)
    
        bars
          .enter()
          .append('rect')
          .attr('class', 'rectTool')
          .style('fill', (d, i) => {
            if (legendArray.filter(it => it.key === d[2]).length < 1) {
              legendArray.push({key: d[2], value: bColor[i]}) 
            }
            return bColor[i]
          })
          .attr("x", (g, i) => {
            const val =  xScale(g[0]) + xScale.bandwidth() / 2 - (xScale.bandwidth() / items[0].length / 2) + (xScale.bandwidth() / items[0].length + 3) * g[3]
            return val
          })
          .attr('y', (g) => {
            if (g[1] === 0) {
              return yScale(0.05) - marginBottom
            } else {
              return yScale(g[1]) - marginBottom
            }
          })
          .attr('width', xScale.bandwidth() / items[0].length)
          .attr('height', (g) => {
            if (g[1] < 0) {
              return 0
            } else if (g[1] === 0) {
              return yScale(0) - yScale(0.05)
            } else {
              return  yScale(0) - yScale(g[1])
            }
            // return  yScale(0) - yScale(g[1])
          })
          .append("title")
          .text((a, b, c) => {
            return a[0] + '-' + a[2] + '-' + a[1]
          })

        // 图例
        // svg.append("foreignObject")//先往svg中塞个foreignObject
        //     .attr('y', height-marginBottom)
        //     // .attr('x', -width/2)
        //     .attr('width', width)
        //     .attr('height', marginBottom)
        //     .append("xhtml:div")//塞上支持flex布局的div container
        //     .style("display", "flex")
        //     .style("flex-wrap", "wrap")
        //     .style("justify-content", "center")
        //     .style("width", () => width+'px')
        //     .selectAll(".legend")
        //     .data(legendArray)
        //     .enter()
        //     .append("xhtml:div")//塞上flex布局的div，放置正方形和文字
        //     .attr("class","legend")
        //     .style("display", "flex")
        //     .style("height", () => marginBottom+'px')
        //     .each(function(){
        //         let _svg = d3.select(this)
        //           .append("svg")

        //         let g = _svg.append("g")

        //         g.append("rect")
        //           .style("fill", (d, i) => {
        //             return d.value
        //           })
        //           .attr("width", 8)
        //           .attr("height", 8)
        //         g.append("text")
        //           .text((d, i) => {
        //             return d.key
        //           })
        //           .style("fill", "#5A5E72")
        //           .style("text-anchor", "end")
        //           .style("font-size", "12px")
        //           .attr("transform", function(d, i, a) {
        //             const length = d.key ? d.key.length * 6 + 8 : 10
                    
        //             return "translate("+ length +"," + 8 + ")"; 
        //           })

        //         _svg.attr("width", g.node().getBBox().width + 10);
        //     });
    }

    refreshSchema(ele) {
        return this.schema.requestSchema(ele)
    }

    refreshData(ele) {
        if (this.xProperty && this.yProperty) {
            return this.datasource.refreshPolicyData(ele, this.xProperty, this.yProperty)
        }
    }

    isReady() {
        return this.xProperty && this.yProperty && this.datasource.data
    }
}
