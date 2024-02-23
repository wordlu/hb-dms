/* 热力图 */
import policy from "./policy"

export default class PhStackChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.title = undefined
        this.marginTop = 20         // the top margin, in pixels
        this.marginRight = 0        // the right margin, in pixels
        this.marginBottom = 30      // the bottom margin, in pixels
        this.marginLeft = 40        // the left margin, in pixels
        this.width = 640            // the outer width of the chart, in pixels
        this.height = 400           // the outer height of the chart, in pixels
        this.xPadding = 0.1         // amount of x-range to reserve to separate bars
        this.yFormat = ",f"           // a format specifier string for the y-axis

        this.xDomain = []           // an array of (ordinal) x-values
        this.yDomain = []           // an array of (ordinal) y-values
        this.zDomain = []           // an array of (ordinal) z-values

        this.dataset = this.datasource.name
        this.xProperty = "xProperty"
        // this.xProperty = "doi"
        this.yProperty = "yProperty"
        this.zProperty = "zProperty"
        this.yPropertyFunc = "max"     // avg, max, min

        this.xLabel = ""
        this.yLabel = ""
        this.color = "currentColor"

        // this.data = null
        this.resetPolicyConstraints(option)
    }

    policyName() {
        return "stack"
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
          "scenes_name": "物体车切出",
          "count_num": 10,
          "zProperty": 100
        },
        {
          "scenes_name": "物体车切出",
          "count_num": 34,
          "zProperty": 200
        },
        {
          "scenes_name": "物体车切出",
          "count_num": 60,
          "zProperty": 300
        },
        {
          "scenes_name": "物体车切出",
          "count_num": 20,
          "zProperty": 800
        },
        {
          "scenes_name": "主车减速",
          "count_num": 60,
          "zProperty": 300
        },
        {
          "scenes_name": "主车减速",
          "count_num": 90,
          "zProperty": 100
        },
        {
          "scenes_name": "主车减速",
          "count_num": 70,
          "zProperty": 100
        },
        {
          "scenes_name": "主车减速",
          "count_num": 60,
          "zProperty": 154
        },
        {
          "scenes_name": "物体车切入",
          "count_num": 32,
          "zProperty": 200
        },
        {
          "scenes_name": "物体车切入",
          "count_num": 55,
          "zProperty": 146
        },
        {
          "scenes_name": "物体车切入",
          "count_num": 78,
          "zProperty": 298
        },
        {
          "scenes_name": "物体车切入",
          "count_num": 239,
          "zProperty": 124
        },
        {
          "scenes_name": "主车跟随前车",
          "count_num": 45,
          "zProperty": 187
        },
        {
          "scenes_name": "主车跟随前车",
          "count_num": 25,
          "zProperty": 225
        },
        {
          "scenes_name": "主车跟随前车",
          "count_num": 230,
          "zProperty": 100
        },
        {
          "scenes_name": "主车跟随前车",
          "count_num": 120,
          "zProperty": 100
        },
      // {
      //   "xProperty": "主车减速",
      //   "yProperty": 40,
      //   "zProperty": 800
      // },
        // {
        //     "xProperty": "主车加速",
        //     "yProperty": 30,
        //     "zProperty": 70
        // },
        // {
        //     "xProperty": "主车跟随前车",
        //     "yProperty": 40,
        //     "zProperty": 53
        // },
        // {
        //     "xProperty": "物体车切入",
        //     "yProperty": 50,
        //     "zProperty": 50
        // },
        // {
        //     "xProperty": "前方无车",
        //     "yProperty": 60,
        //     "zProperty": 67
        // },
        // {
        //     "xProperty": "周围物体密度11-15",
        //     "yProperty": 63,
        //     "zProperty": 90
        // },
        // {
        //     "xProperty": "主车停车",
        //     "yProperty": 70,
        //     "zProperty": 89
        // },
        // {
        //     "xProperty": "周围物体密度6-10",
        //     "yProperty": 42,
        //     "zProperty": 80
        // },
        // {
        //     "xProperty": "周围物体密度16-20",
        //     "yProperty": 42,
        //     "zProperty": 60
        // },
        // {
        //     "xProperty": "主车转弯",
        //     "yProperty": 21,
        //     "zProperty": 30
        // }
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
            return new d3.InternSet(xdata)
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
        const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));

        // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
        // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
        // each tuple has an i (index) property so that we can refer back to the
        // original data point (data[i]). This code assumes that there is only one
        // data point for a given unique x- and z-value.
        const series = d3.stack()
            .keys(zDomain)
            .value(([x, I], z) => Y[I.get(z)])
            .order(order)
            .offset(offset)
            (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
            .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

        // Compute the default y-domain. Note: diverging stacks can be negative.
        const yDomain = d3.extent(series.flat(2));

        // Construct scales, axes, and formats.
        const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
        const yScale = yType(yDomain, yRange);
        // const color = d3.scaleOrdinal(zDomain, d3.schemeSpectral[zDomain.size]);
        const color = d3.scaleOrdinal()
            .domain(d3.range(zDomain.size))
            .range(d3.schemeSet3);
        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
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
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(yLabel));

        const bar = svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", ([{i}]) => color(Z[i]))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", ({i}) => xScale(X[i]))
            .attr("y", ([y1, y2]) => {
                if (isNaN(y1)) {
                    return yScale(y2)
                } else if (isNaN(y2)) {
                    return yScale(y1)
                } else {
                    return Math.min(yScale(y1), yScale(y2))
                }
            })
            .attr("height", ([y1, y2]) => {
                if (isNaN(y1) ||  isNaN(y2)) {
                    return 0
                }
                else {
                    return Math.abs(yScale(y1) - yScale(y2))
                }
            })
            .attr("width", xScale.bandwidth());

        if (title) bar.append("title")
            .text(({i}) => title(i));

        svg.append("g")
            .attr("transform", `translate(0,${yScale(0)})`)
            .call(xAxis);
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
