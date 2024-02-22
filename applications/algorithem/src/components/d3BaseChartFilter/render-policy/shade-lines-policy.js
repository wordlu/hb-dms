import policy from "./policy"

export default class PhBarChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.title = undefined
        this.marginTop = 20             // the top margin, in pixels
        this.marginRight = 30           // the right margin, in pixels
        this.marginBottom = 30          // the bottom margin, in pixels
        this.marginLeft = 40            // the left margin, in pixels
        this.width = 640                // the outer width of the chart, in pixels
        this.height = 400               // the outer height of the chart, in pixels
        this.xPadding = 0.1             // amount of x-range to reserve to separate bars
        this.yFormat = ",f"             // a format specifier string for the y-axis

        this.strokeLinecap = "round"    // stroke line cap of line
        this.strokeLinejoin = "miter"   // stroke line join of line
        this.strokeWidth = 1.5          // stroke width of line
        this.strokeOpacity = 1          // stroke opacity of line

        this.xDomain = []           // an array of (ordinal) x-values
        this.yDomain = []           // an array of (ordinal) y-values
        this.zDomain = []           // an array of (ordinal) z-values

        this.dataset = this.datasource.name
        this.xProperty = ""
        // this.xProperty = "doi"
        this.yProperty = ""
        this.yPropertyFunc = "max"     // avg, max, min
        this.zProperty = "version"

        this.xLabel = ""
        this.yLabel = ""
        this.color = "currentColor"

        // xType = d3.scaleUtc, // type of x-scale
        // this.data = null
        this.resetPolicyConstraints(option)
    }

    policyName() {
        return "lines"
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
        this.zDomain = option.zDomain ? option.zDomain : this.zDomain

        this.xProperty= option.xProperty ? option.xProperty : this.xProperty
        this.yProperty= option.yProperty ? option.yProperty : this.yProperty
        this.yPropertyFunc = option.yPropertyFunc ? option.yPropertyFunc : this.yPropertyFunc
        this.zProperty= option.zProperty ? option.zProperty : this.zProperty

        this.xLabel = option.xLabel ? option.xLabel : this.xLabel
        this.yLabel = option.yLabel ? option.yLabel : this.yLabel
        this.color = option.color ? option.color : this.color

        this.strokeLinecap = option.strokeLinecap ? option.strokeLinecap : this.strokeLinecap
        this.strokeLinejoin = option.strokeLinejoin ? option.strokeLinejoin : this.strokeLinejoin
        this.strokeWidth = option.strokeWidth ? option.strokeWidth : this.strokeWidth
        this.strokeOpacity = option.strokeOpacity ? option.strokeOpacity : this.strokeOpacity

        this.datasource = option.datasource ? option.datasource : this.datasource
        this.schema = option.schema ? option.schema : this.schema
        this.dataset = this.datasource.name
    }

    render (d3, data, ele) {
      ele.style = `width:auto`
      data = [
        {
          "count_num": 10,
          "scenes_name": 100
        },
        {
          "count_num": 20,
          "scenes_name": 150
        },
        {
          "count_num": 5,
          "scenes_name": 200
        },
        {
          "count_num": 50,
          "scenes_name": 300
        },
        {
          "count_num": 30,
          "scenes_name": 400
        },
        {
          "count_num": 60,
          "scenes_name": 500
        },
      ]
      const bColor = ['#4385F4', '#34A853', '#FBBC05', '#E94335', '#01ACC2', '#AAACC2']

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
        // const xType = d3.scaleUtc
        const xType = d3.scaleLinear
        const yType = d3.scaleLinear        // y-scale type TODO: ...
        const xLabel = this.xLabel
        const yLabel = this.yLabel
        const mixBlendMode = "multiply"
        const curve = d3.curveLinear

        const that = this
        const computeX = (item) => {
            return parseFloat(item[that.xProperty])
        }
        const computeY = (item) => {
            return parseFloat(item[that.yProperty])
        }
        const computeZ = (item) => {
            return item[that.zProperty]
        }
        const computeXDomain = (d3, xdata) => {
            return d3.extent(xdata)
        }

        const computeYDomain = (d3, ydata) => {
            return [0, d3.max(ydata)]
        }

        const computeZDomain = (d3, zdata) => {
            return new d3.InternSet(zdata)
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
        const Z = d3.map(data, computeZ);
        const O = d3.map(data, d => d);

        // Compute default domains, and unique the x-domain.
        const xDomain = computeXDomain(d3, X)
        const yDomain = computeYDomain(d3, Y)
        const zDomain = computeZDomain(d3, Z)
        const xRange = computeSizeXRange()
        const yRange = computeSizeYRange()

        const defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
        const D = d3.map(data, defined)

        // Omit any data not present in the z-domain.
        const I = d3.range(X.length).filter(i => zDomain.has(Z[i]))

        // Construct scales, axes, and formats.
        // const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
        const xScale = xType(xDomain, xRange)
        const yScale = yType(yDomain, yRange)
        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
        const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat)

        // Compute titles.
        const T = title === undefined ? Z : title === null ? null : d3.map(data, title);

        const svg = d3.select(ele)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .style("-webkit-tap-highlight-color", "transparent")
            // .on("pointerenter", pointerentered)
            // .on("pointermove", pointermoved)
            // .on("pointerleave", pointerleft)
            // .on("touchstart", event => event.preventDefault());

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            // .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
            //     .attr("x2", width - marginLeft - marginRight)
            //     .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis)

        let items = []
        // 组装数据 便于绘制
        data.forEach((row) => {
          let index = 0
          Object.keys(row).forEach((key) => {
            // 非数据 不绘制统计图
            if (key !== that.xProperty) {
              if (items[index]) {
                items[index].push([row[that.xProperty], row[key], key, index])
              } else {
                items[index] = [[row[that.xProperty], row[key], key, index]]
              }
              index++
            }
          })
        })
        
        // Construct a line generator.
        // const line = d3.line()
        //     .defined(i => D[i])
        //     .curve(curve)
        //     .x(i => xScale(X[i]))
        //     .y(i => yScale(Y[i]))

        // 计算点位置
        let line = d3
        .line()
        .x(function (d) {
          // return xScale(d.label)
          return d[0]
        })
        .y(function (d) {
          // return yScale(d.value)
          return d[1]
        })

        const path = svg.append("g")
          .selectAll()
          .data(items)
          .enter()
          .append('path')
          .attr('class', 'lines')
          .attr('d', function (d) {
            const row = d.map((item) => {
              const itemS = []
              itemS.push(xScale(item[0]))
              itemS.push(yScale(item[1]))
              return [...itemS]
            })
            return line(row)
          })
          .attr('stroke',  (d, i) => bColor[i])
          .attr('fill', 'none')
          // .attr('transform', `translate(${xScale.bandwidth() / 2}, 0)`)
  
        // const path = svg.append("g")
        //     .attr("fill", "none")
        //     .attr("stroke", typeof color === "string" ? color : null)
        //     .attr("stroke-linecap", this.strokeLinecap)
        //     .attr("stroke-linejoin", this.strokeLinejoin)
        //     .attr("stroke-width", this.strokeWidth)
        //     .attr("stroke-opacity", this.strokeOpacity)
        //     .selectAll("path")
        //     .data(d3.group(I, i => Z[i]))
        //     .join("path")
        //     .style("mix-blend-mode", mixBlendMode)
        //     .attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
        //     .attr("d", ([, idx]) => line(idx))

        const dot = svg.append("g")
            .attr("display", "none");

        dot.append("circle")
            .attr("r", 2.5);

        dot.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .attr("y", -8);

        function pointermoved(event) {
            const [xm, ym] = d3.pointer(event);
            const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
            path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
            dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
            if (T) dot.select("text").text(T[i]);
            svg.property("value", O[i]).dispatch("input", {bubbles: true});
        }

        function pointerentered() {
            path.style("mix-blend-mode", null).style("stroke", "#ddd");
            dot.attr("display", null);
        }

        function pointerleft() {
            path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
            dot.attr("display", "none");
            svg.node().value = null;
            svg.dispatch("input", {bubbles: true});
        }
    }

    refreshSchema(ele) {
        return this.schema.requestSchema(ele)
    }

    buildLinesChartQueryString() {
        // return "select " + this.yPropertyFunc + "(`" + this.yProperty + "`) as `" + this.yProperty + "`,`" + this.xProperty + "` from `" + this.datasource.projectId + "_" + this.dataset + "` group by `" + this.xProperty + "`"
        return "select " + this.yPropertyFunc + "(`" + this.yProperty + "`) as `" + this.yProperty + "`,`" + this.xProperty + "`,`" + this.zProperty + "` from `" + this.datasource.projectId + "_" + this.dataset + "` group by `" + this.xProperty + "`" + ", `" + this.zProperty + "`"
    }

    buildPolicySchema() {
        return [this.yProperty, this.xProperty, this.zProperty]
    }

    refreshData(ele) {
        if (this.xProperty && this.yProperty) {
            return this.datasource.refreshPolicyData(ele, this.buildLinesChartQueryString(), this.buildPolicySchema())
        }
    }

    isReady() {
        return this.xProperty && this.yProperty && this.datasource.data
    }
}
