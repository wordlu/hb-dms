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
        data = [
          {
            "scenes_name": "物体车切出",
            "count_num": 300,
            "zProperty": 100,
            "aaa": 101,
            "bbb": 101,
            "ccc": 101,
          },
          {
            "scenes_name": "物体车切出1",
            "count_num": 400,
            "zProperty": 200,
            "bbb": 101,
            "ccc": 101,
            "aaa": 120
          },
          {
            "scenes_name": "物体车切出2",
            "count_num": 600,
            "zProperty": 300,
            "bbb": 101,
            "ccc": 101,
            "aaa": 80
          },
          {
            "scenes_name": "物体车切出3",
            "count_num": 500,
            "zProperty": 80,
            "bbb": 101,
            "ccc": 101,
            "aaa": 90
          },
          {
            "scenes_name": "主车减速4",
            "count_num": 400,
            "zProperty": 300,
            "bbb": 101,
            "ccc": 101,
            "aaa": 50
          },
        ]
        // const bColor = ['#4385F4', '#34A853', '#FBBC05', '#E94335', '#01ACC2', '#AAACC2']
        const bColor = ['#FFC999', '#FC9F3A', '#FC870A', '#F70', '#CC5F00']
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

        const that = this
        const computeX = (item) => {
            return item[that.xProperty]
        }
        const computeY = (item) => {
            return parseFloat(item[that.yProperty])
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

        // Compute values.
        const X = d3.map(data, computeX);
        const Y = d3.map(data, computeY);

        // Compute default domains, and unique the x-domain.
        const xDomain = computeXDomain(d3, X)
        const yDomain = computeYDomain(d3, Y)
        const xRange = computeSizeXRange()
        const yRange = computeSizeYRange()

        // Omit any data not present in the x-domain.
        const I = d3.range(X.length).filter(i => xDomain.has(X[i]));
        console.log(I)
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
        console.log(items)
        // Construct scales, axes, and formats.
        const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
        const yScale = yType(yDomain, yRange);
        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
        // const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
        const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

        // Compute titles.
        if (title === undefined) {
            const formatValue = yScale.tickFormat(100, yFormat);
            title = i => `${X[i]}\n${formatValue(Y[i])}`;
        } else {
            const O = d3.map(data, d => d);
            const T = title;
            title = i => T(O[i], i, data);
        }

        // 绘图区域
        const svg = d3.select(ele)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        // Y轴
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
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
            .attr("transform", `translate(0,${height - marginBottom})`)
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
          .style('fill', (d, i) => bColor[i])
          .attr("x", (g, i) => {
            const val =  xScale(g[0]) + xScale.bandwidth() / 2 - (xScale.bandwidth() / items[0].length / 2) + (xScale.bandwidth() / items[0].length + 3) * g[3] - marginLeft - marginRight
            return val
          })
          .attr('y', (g) => {
            return yScale(g[1])
          })
          .attr('width', xScale.bandwidth() / items[0].length)
          .attr('height', (g) => yScale(0) - yScale(g[1]))
        
        // const bar = svg.append("g")
        //     .attr("fill", (d, i) => bColor[i])
        //     .selectAll("rect")
        //     .data(I)
        //     .join("rect")
        //     .attr("x", i => xScale(X[i]))
        //     .attr("y", i => yScale(Y[i]))
        //     .attr("height", i => yScale(0) - yScale(Y[i]))
        //     .attr("width", xScale.bandwidth())

        // 标题
        if (title) bars.append("title")
            .text(title);

        
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
