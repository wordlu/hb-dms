import policy from "./policy"

export default class PhScatterplotChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.title = undefined

        this.marginTop = 25         // the top margin, in pixels
        this.marginRight = 20       // the right margin, in pixels
        this.marginBottom = 35      // the bottom margin, in pixels
        this.marginLeft = 40        // the left margin, in pixels
        this.width = 640            // the outer width of the chart, in pixels
        this.height = 400           // the outer height of the chart, in pixels
        // this.xPadding = 0.1         // amount of x-range to reserve to separate bars
        // this.yFormat = ",f"         // a format specifier string for the y-axis

        this.xDomain = []           // an array of (ordinal) x-values
        this.yDomain = []           // an array of (ordinal) y-values
        this.zDomain = []           // an array of (ordinal) z-values

        this.dataset = this.datasource.name
        this.xProperty = ""
        this.yProperty = ""
        this.zProperty = "zProperty"
        this.yPropertyFunc = "max"     // avg, max, min

        this.xLabel = ""
        this.yLabel = ""
        this.color = "currentColor"

        // this.data = null
        this.resetPolicyConstraints(option)
    }

    policyName() {
        return "scatterplot"
    }

    resetPolicyConstraints(option) {
        this.title = option.title ? option.title : this.title
        this.marginTop = option.marginTop ? option.marginTop : this.marginTop
        this.marginRight = option.marginRight ? option.marginRight : this.marginRight
        this.marginBottom = option.marginBottom ? option.marginBottom : this.marginBottom
        this.marginLeft = option.marginLeft ? option.marginLeft : this.marginLeft
        this.width = option.width ? option.width : this.width
        this.height = option.height ? option.height : this.height
        // this.xPadding = option.xPadding ? option.xPadding : this.xPadding
        // this.yFormat = option.yFormat ? option.yFormat : this.yFormat

        this.xDomain = option.xDomain ? option.xDomain : this.xDomain
        this.yDomain = option.yDomain ? option.yDomain : this.yDomain
        this.zDomain = option.zDomain ? option.zDomain : this.zDomain

        this.xProperty= option.xProperty ? option.xProperty : this.xProperty
        this.yProperty= option.yProperty ? option.yProperty : this.yProperty
        this.zProperty= option.zProperty ? option.zProperty : this.zProperty
        this.yPropertyFunc = option.yPropertyFunc ? option.yPropertyFunc : this.yPropertyFunc

        this.xLabel = option.xLabel ? option.xLabel : this.xLabel
        this.yLabel = option.yLabel ? option.yLabel : this.yLabel
        this.color = option.color ? option.color : this.color

        this.datasource = option.datasource ? option.datasource : this.datasource
        this.schema = option.schema ? option.schema : this.schema
        this.dataset = this.datasource.name
    }

    render (d3, data, ele) {
      ele.style = `width:auto`
      data = [
        {
          "scenes_name": 111,
          "count_num": 100,
          "zProperty": 100
        },
        {
          "scenes_name": 222,
          "count_num": 34,
          "zProperty": 200
        },
        {
          "scenes_name": 333,
          "count_num": 60,
          "zProperty": 300
        },
        {
          "scenes_name": 444,
          "count_num": 20,
          "zProperty": 800
        },
        {
          "scenes_name": 555,
          "count_num": 60,
          "zProperty": 300
        },
      ]
        let title = this.title
        const marginTop = this.marginTop
        const marginRight = this.marginRight
        const marginBottom = this.marginBottom
        const marginLeft = this.marginLeft
        const width = this.width
        const height = this.height
        const xPadding = this.xPadding
        const yFormat = this.yFormat
        const colors = this.colors
        const yType = d3.scaleLinear        // y-scale type TODO: ...
        const xLabel = this.xLabel
        const yLabel = this.yLabel
        const offset = d3.stackOffsetDiverging // stack offset method
        const order = d3.stackOrderNone // stack order method

        const that = this
        const computeX = (item) => {
            return item[that.xProperty]
        }
        const computeY = (item) => {
            return parseFloat(item[that.yProperty])
        }
        const computeZ = (item) => {
            return item[that.zProperty]
        }
        const computeXDomain = (d3, xdata) => {
            // return new d3.InternSet(xdata)
            return d3.extent(xdata)
        }
        const computeZDomain = (d3, zdata) => {
            return new d3.InternSet(zdata)
        }
        const computeYDomain = (d3, ydata) => {
            return d3.extent(ydata)
        }

        const computeSizeXRange = () => {
            return [marginLeft, width - marginRight]
        }

        const computeSizeYRange = () => {
            return [height - marginBottom, marginTop]
        }

        // Compute values.
        const X = d3.map(data, computeX)
        const Y = d3.map(data, computeY)
        const Z = d3.map(data, computeZ)

        // Compute default x- and z-domains, and unique them.
        const xDomain = computeXDomain(d3, X)
        const zDomain = computeZDomain(d3, Z)
        // const yDomain = computeZDomain(d3, Z)
        const xRange = computeSizeXRange()
        const yRange = computeSizeYRange()

        // Omit any data not present in the x- and z-domains.
        // const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));
        const I = data

        // Compute the default y-domain. Note: diverging stacks can be negative.
        const yDomain = computeYDomain(d3, Y)

        // Construct scales, axes, and formats.
        // const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
        const xScale = yType(xDomain, xRange)
        const yScale = yType(yDomain, yRange)
        const color = "currentColor"
        const shape = d3.scaleOrdinal(data.map(d => d.category), d3.symbols.map(s => d3.symbol().type(s)()))
        const xAxis = d3.axisBottom(xScale).ticks(width / 80)
        const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

        // Compute titles.
        if (title === undefined) {
            const formatValue = yScale.tickFormat(100, yFormat);
            title = i => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`;
        } else {
            const O = d3.map(data, d => d);
            const T = title;
            title = i => T(O[i], i, data);
        }

        // const svg = d3.create("svg")
        const svg = d3.select(ele)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", width)
                .attr("y", marginBottom - 4)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text(xLabel))

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(yLabel))

        svg.append("g")
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1)
            .call(g => g.append("g")
                .selectAll("line")
                .data(xScale.ticks())
                .join("line")
                .attr("x1", d => 0.5 + xScale(d))
                .attr("x2", d => 0.5 + xScale(d))
                .attr("y1", marginTop)
                .attr("y2", height - marginBottom))
            .call(g => g.append("g")
                .selectAll("line")
                .data(yScale.ticks())
                .join("line")
                .attr("y1", d => 0.5 + yScale(d))
                .attr("y2", d => 0.5 + yScale(d))
                .attr("x1", marginLeft)
                .attr("x2", width - marginRight))

        svg.append("g")
            .attr("stroke-width", 1.5)
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("transform", d => {
                return `translate(${xScale(d[that.xProperty])},${yScale(d[that.yProperty])})`
            })
            .attr("fill", "currentColor")
            .attr("d", d => shape("setosa"))

    }

    refreshSchema(ele) {
        return this.schema.requestSchema(ele)
    }

    buildStackChartQueryString() {
        return "select " + this.yPropertyFunc + "(`" + this.yProperty + "`) as `" + this.yProperty + "`,`" + this.xProperty + "`,`" + this.zProperty + "` from `" + this.datasource.projectId + "_" + this.dataset + "` group by `" + this.xProperty + "`" + ", `" + this.zProperty + "`"
    }

    buildPolicySchema() {
        return [this.yProperty, this.xProperty, this.zProperty]
    }

    refreshData(ele) {
        if (this.xProperty && this.yProperty) {
            return this.datasource.refreshPolicyData(ele, this.buildStackChartQueryString(), this.buildPolicySchema())
        }
    }

    isReady() {
        return this.xProperty && this.yProperty && this.zProperty && this.datasource.data
    }
}
