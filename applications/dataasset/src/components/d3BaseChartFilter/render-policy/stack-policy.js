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
    //   data = [
    //     {
    //       "scenes_name": "物体车切出",
    //       "count_num": 10,
    //       "zProperty": '测试1'
    //     },
    //     {
    //       "scenes_name": "物体车切出",
    //       "count_num": 34,
    //       "zProperty": '测试2'
    //     },
    //     {
    //       "scenes_name": "物体车切出",
    //       "count_num": 60,
    //       "zProperty": '测试3'
    //     },
    //     {
    //       "scenes_name": "物体车切出",
    //       "count_num": 20,
    //       "zProperty": '测试4'
    //     },
    //     {
    //       "scenes_name": "物体车切出",
    //       "count_num": 20,
    //       "zProperty": '测试5'
    //     },
    //     {
    //       "scenes_name": "物体车切出",
    //       "count_num": 20,
    //       "zProperty": '测试6'
    //     },
    //     {
    //       "scenes_name": "主车减速",
    //       "count_num": 60,
    //       "zProperty": '测试1'
    //     },
    //     {
    //       "scenes_name": "主车减速",
    //       "count_num": 90,
    //       "zProperty": '测试2'
    //     },
    //     {
    //       "scenes_name": "主车减速",
    //       "count_num": 70,
    //       "zProperty": '测试3'
    //     },
    //     {
    //       "scenes_name": "主车减速",
    //       "count_num": 60,
    //       "zProperty": '测试4'
    //     },
    //     {
    //       "scenes_name": "物体车切入",
    //       "count_num": 32,
    //       "zProperty": '测试1'
    //     },
    //     {
    //       "scenes_name": "物体车切入",
    //       "count_num": 55,
    //       "zProperty": '测试2'
    //     },
    //     {
    //       "scenes_name": "物体车切入",
    //       "count_num": 78,
    //       "zProperty": '测试3'
    //     },
    //     {
    //       "scenes_name": "物体车切入",
    //       "count_num": 67,
    //       "zProperty": '测试4'
    //     },
    //     // {
    //     //   "scenes_name": "主车跟随前车",
    //     //   "count_num": 45,
    //     //   "zProperty": '测试1'
    //     // },
    //     // {
    //     //   "scenes_name": "主车跟随前车",
    //     //   "count_num": 25,
    //     //   "zProperty": '测试2'
    //     // },
    //     // {
    //     //   "scenes_name": "主车跟随前车",
    //     //   "count_num": 23,
    //     //   "zProperty": '测试3'
    //     // },
    //     {
    //       "scenes_name": "主车跟随前车",
    //       "count_num": 300,
    //       "zProperty": '测试5'
    //     },
    //     {
    //       "scenes_name": "前方无车",
    //       "count_num": 45,
    //       "zProperty": '测试1'
    //     },
    //     {
    //       "scenes_name": "前方无车",
    //       "count_num": 25,
    //       "zProperty": '测试2'
    //     },
    //     {
    //       "scenes_name": "前方无车",
    //       "count_num": 230,
    //       "zProperty": '测试3'
    //     },
    //     {
    //       "scenes_name": "前方无车",
    //       "count_num": 120,
    //       "zProperty": '测试4'
    //     },
    //     {
    //       "scenes_name": "物体横穿",
    //       "count_num": 45,
    //       "zProperty": '测试1'
    //     },
    //     {
    //       "scenes_name": "物体横穿",
    //       "count_num": 24,
    //       "zProperty": '测试2'
    //     },
    //     {
    //       "scenes_name": "物体横穿",
    //       "count_num": 34,
    //       "zProperty": '测试3'
    //     },
    //     {
    //       "scenes_name": "物体横穿",
    //       "count_num": 54,
    //       "zProperty": '测试4'
    //     },
    //     {
    //       "scenes_name": "主车转弯",
    //       "count_num": 56,
    //       "zProperty": '测试1'
    //     },
    //     {
    //       "scenes_name": "主车转弯",
    //       "count_num": 234,
    //       "zProperty": '测试2'
    //     },
    //     {
    //       "scenes_name": "主车转弯",
    //       "count_num": 45,
    //       "zProperty": '测试3'
    //     },
    //     {
    //       "scenes_name": "主车转弯",
    //       "count_num": 24,
    //       "zProperty": '测试4'
    //     },
    //     {
    //       "scenes_name": "主车转弯1",
    //       "count_num": 45,
    //       "zProperty": '测试1'
    //     },
    //     {
    //       "scenes_name": "主车转弯1",
    //       "count_num": 34,
    //       "zProperty": '测试2'
    //     },
    //     {
    //       "scenes_name": "主车转弯1",
    //       "count_num": 34,
    //       "zProperty": '测试3'
    //     },
    //     {
    //       "scenes_name": "主车转弯1",
    //       "count_num": 12,
    //       "zProperty": '测试4'
    //     },
    //     {
    //       "scenes_name": "主车转弯1",
    //       "count_num": 12,
    //       "zProperty": '测试5'
    //     },
    // ]
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
        const legendArray = []

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
        const series = d3.stack()
            .keys(zDomain)
            .value(([x,a], z) => {
              return Y[a.get(z)]
            })
            .order(order)
            .offset(offset)
            (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
            .map(s => s.map(d => {
              return Object.assign(d, { i: d.data[1].get(s.key) }) 
            }));
        // Compute the default y-domain. Note: diverging stacks can be negative.
        const yDomain = d3.extent(series.flat(2));

        // Construct scales, axes, and formats.
        const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
        const yScale = yType(yDomain, yRange);
        // const color = d3.scaleOrdinal(zDomain, d3.schemeSpectral[zDomain.size]);
        const colorArray = ['#FFA581', '#FEC929', '#44CB4A', '#619CDF', '#6C54FF', '#BD4DB9']
        const color = d3.scaleOrdinal()
            .domain(d3.range(zDomain.size))
            .range(colorArray);
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
        //添加Y轴
        svg.append("g")
            .attr("transform", `translate(${marginLeft}, -${marginBottom})`)
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

        // 添加X轴
        svg.append("g")
            .attr("transform", function(d, i) {
              return "translate(0," + (yScale(0)-marginBottom) + ")"; 
            })
            .call(xAxis);
        
        const bar = svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", ([{i}]) => {
              if (legendArray.filter(it => it.key === Z[i]).length < 1) {
                legendArray.push({key:Z[i], value:color(Z[i])}) 
              }
              return color(Z[i])
            })
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", ({i}) => {
              return xScale(X[i]) + xScale.bandwidth() / 4
            })
            .attr("y", ([y1, y2]) => {
                if (isNaN(y1)) {
                    return yScale(y2) - marginBottom
                } else if (isNaN(y2)) {
                    return yScale(y1) - marginBottom
                } else {
                    return Math.min(yScale(y1), yScale(y2)) - marginBottom
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
            .attr("width", xScale.bandwidth() / 2)

        if (title) bar.append("title")
            .text(({i}) => {
              return title(i)
            });

        
        
        // 图例
        svg.append("foreignObject")//先往svg中塞个foreignObject
            .attr('y', height - marginBottom)
            .attr('width', width)
            .attr('height', marginBottom)
            .append("xhtml:div")//塞上支持flex布局的div container
            .style("display", "flex")
            .style("flex-wrap", "wrap")
            .style("justify-content", "center")
            .style("width", () => width+'px')
            .selectAll(".legend")
            .data(legendArray)
            .enter()
            .append("xhtml:div")//塞上flex布局的div，放置正方形和文字
            .attr("class","legend")
            .style("display", "flex")
            .style("height", () => marginBottom+'px')
            .each(function(){
                let _svg = d3.select(this)
                  .append("svg")

                let g = _svg.append("g")

                g.append("rect")
                  .style("fill", (d, i) => {
                    return d.value
                  })
                  .attr("width", 8)
                  .attr("height", 8)
                g.append("text")
                  .text((d, i) => {
                    return d.key
                  })
                  .style("fill", "#5A5E72")
                  .style("text-anchor", "end")
                  .style("font-size", "12px")
                  .attr("transform", function(d, i, a) {
                    const length = d.key ? d.key.length * 6 + 8 : 10
                    
                    return "translate("+ length +"," + 8 + ")"; 
                  })

                _svg.attr("width", g.node().getBBox().width + 10);
            });
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
        return this.xProperty && this.yProperty && this.zProperty && this.datasource.data
    }
}
