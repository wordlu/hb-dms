import policy from "./policy"

export default class PhBarChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.title = undefined
        this.marginTop = 40         // the top margin, in pixels
        this.marginRight = 40        // the right margin, in pixels
        this.marginBottom = 40      // the bottom margin, in pixels
        this.marginLeft = 40        // the left margin, in pixels
        this.width = 640            // the outer width of the chart, in pixels
        this.height = 400           // the outer height of the chart, in pixels
        this.xPadding = 0.1         // amount of x-range to reserve to separate bars
        this.yFormat = ",f"           // a format specifier string for the y-axis

        this.xDomain = []           // an array of (ordinal) x-values
        this.yDomain = []           // an array of (ordinal) y-values

        // this.dataset = this.datasource.name
        this.xProperty = "xProperty"
        this.yProperty = "yProperty"
        this.yPropertyFunc = "max"     // avg, max, min

        this.xLabel = ""
        this.yLabel = ""
        this.color = "#FF7700"

        // this.data = null
        this.resetPolicyConstraints(option)
    }

    policyName() {
        return "gantt"
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
          [
            {x: '货车', y:'货车', value: 234},
            {x: '货车', y:'轿车', value: 324},
            {x: '货车', y:'卡车', value: 34},
            {x: '货车', y:'行人', value: 65},
            {x: '货车', y:'摩托车', value: 6},
            {x: '货车', y:'挂车', value: 354},
          ],
          [
            {x: '轿车', y:'货车', value: 56},
            {x: '轿车', y:'轿车', value: 6},
            {x: '轿车', y:'卡车', value: 342},
            {x: '轿车', y:'行人', value: 46},
            {x: '轿车', y:'摩托车', value: 56},
            {x: '轿车', y:'挂车', value: 87},

          ],
          [
            {x: '卡车', y:'货车', value: 123},
            {x: '卡车', y:'轿车', value: 46},
            {x: '卡车', y:'卡车', value: 2},
            {x: '卡车', y:'行人', value: 456},
            {x: '卡车', y:'摩托车', value: 65},
            {x: '卡车', y:'挂车', value: 56},
          ],
          [
            {x: '行人', y:'货车', value: 7},
            {x: '行人', y:'轿车', value: 4},
            {x: '行人', y:'卡车', value: 54},
            {x: '行人', y:'行人', value: 78},
            {x: '行人', y:'摩托车', value: 78},
            {x: '行人', y:'挂车', value: 45},
          ],
          [
            {x: '摩托车', y:'货车', value: 7},
            {x: '摩托车', y:'轿车', value: 546},
            {x: '摩托车', y:'卡车', value: 56},
            {x: '摩托车', y:'行人', value: 78},
            {x: '摩托车', y:'摩托车', value: 12},
            {x: '摩托车', y:'挂车', value: 45},
          ],
          [
            {x: '挂车', y:'货车', value: 23},
            {x: '挂车', y:'轿车', value: 4},
            {x: '挂车', y:'卡车', value: 456},
            {x: '挂车', y:'行人', value: 5},
            {x: '挂车', y:'摩托车', value: 8},
            {x: '挂车', y:'挂车', value: 52},
          ],
        ]
        const labelsData = data[0].map(it => it.y)
        labelsData.unshift("")
        const legned = ["正确"]

        const numrows = data.length;
        const numcols = data[0].length;

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
        const yType = d3.scaleLinear        // y-scale type TODO: ...
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

        
        const svg = d3.select(ele)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .append("g")
	          .attr("transform", "translate(" + (marginLeft+marginRight)  + "," + marginTop + ")");
        
        var background = svg.append("rect")
            // .style("stroke-width", "2px")
            // .style("stroke", "#F3F4F7")
            .style("fill", "#fff")
            .attr("width", width)
            .attr("height", height);

        var x = d3.scaleBand()
            .domain(d3.range(numcols))
            .rangeRound([0, width - marginLeft - marginRight]);
      
        var y = d3.scaleBand()
            .domain(d3.range(numrows))
            .rangeRound([0, height - marginTop - marginBottom]);

        var row = svg.selectAll(".row")
            .data(data)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

        var cell = row.selectAll(".cell")
            .data(function(d) { return d; })
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

        cell.append('rect')    
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("stroke-width", 0);
        
        cell.append("text")
            .attr("dy", ".32em")
            .attr("x", x.bandwidth() / 2)
            .attr("y", y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .style("fill",(d, x, y) => {
              if (d.x === d.y) return '#ffffff'
              return '#000000'
            })
            .text(function(d, i) { return d.value; });
        
        row.selectAll(".cell")
            .data(function(d, i) { return data[i]; })
            .style("fill", (d, x, y) => {
              if (d.x === d.y) return '#50BBAE'
              return '#ffffff'
            })

            
        
        const labels = svg.append('g')
            .attr('class', "labels");

        //X轴
        const columnLabels = labels.selectAll(".column-label")
            .data(labelsData)
            .enter().append("g")
            .attr("class", "column-label")
            .attr("transform", function(d, i) { 
                if (d === '') {
                  return "translate(" + -(marginLeft+marginRight) + "," + -marginTop + ")";
                }
                return "translate(" + x(i-1)  + "," + -marginTop + ")";
             });

        columnLabels.append('rect')
            .attr("width", x.bandwidth())
            .attr("height", marginTop)
            .style("stroke-width", 0)
            .style("fill", '#f9f9fb')
      
        columnLabels.append("text")
            .attr("x", x.bandwidth() / 3)
            .attr("y", marginTop / 2)
            .attr("dy", ".32em")
            .text(function(d, i) { return d; })
            .style('background-color', 'red')
      
        //Y轴
        const rowLabels = labels.selectAll(".row-label")
            .data(labelsData.filter(it => it))
            .enter().append("g")
            .attr("class", "row-label")
            .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

        rowLabels.append('rect')
            .attr("width", marginLeft+marginRight)
            .attr("height", y.bandwidth())
            .style("stroke-width", 0)
            .style("fill", '#f9f9fb')
            .attr("transform", function(d, i) { return "translate(" + -(marginLeft+marginRight) + "," + 0 + ")"; });
      
        rowLabels.append("text")
            .attr("x", -(marginLeft+marginRight)/2)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "middle")
            .text(function(d, i) { return d; });


        const legneds = labels.selectAll(".legned")
            .data(legned)
            .enter().append("g")
            .attr("class", "legned")
            .attr("transform", function(d, i) { return "translate(" + 0  + "," + (y.bandwidth() * (data.length)) + ")"; });

        legneds.append('circle')
            .attr('r', 7)
            .attr('cy', (v, i) => { return i*20+5 })
            .attr("fill", "#50BBAE")
            .attr("transform", function(d, i) { return "translate(" + ((x.bandwidth() * (labelsData.length - 1) - marginLeft) / 2 - marginLeft - d.length * 9)  + "," + 14 + ")"; });
        
        legneds.append("text")
            .attr("x", (d, i) => {
              return (x.bandwidth() * (labelsData.length - 1) - marginLeft) / 2 - marginLeft
            })
            .attr("y", marginBottom / 2)
            .attr("dy", ".32em")
            .text(function(d, i) { return d; })
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
