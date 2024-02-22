import policy from "./policy"

export default class PhBarChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.title = undefined
        this.marginTop = 40         // the top margin, in pixels
        this.marginRight = 40        // the right margin, in pixels
        this.marginBottom = 30      // the bottom margin, in pixels
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
        data = [
          [
            {x: '1', y:'65', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '2', y:'65', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '3', y:'65', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'自行车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'卡车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '4', y:'65', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '5', y:'65', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '6', y:'65', list: [{key: '自行车', value: 268, coordinate: [0, 1, 0, 2]}, {key:'货车', value: '5', coordinate: [0, 1, 1, 2]}]},
            {x: '7', y:'65', list: [{key: '轿车', value: 268, coordinate: [0, 2, 0, 2]}, {key:'行人', value: '5', coordinate: [0, 2, 1, 2]}]},
            {x: '8', y:'65', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '9', y:'65', list: [{key: '自行车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'轿车', value:'5', coordinate: [0, 3, 3, 4]}]},
          ],
          [
            {x: '1', y:'60', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '2', y:'60', list: [{key: '行人', value: 268, coordinate: [0, 1, 0, 3]}, {key:'货车', value: '5', coordinate: [0, 1, 1, 3]}, {key: '轿车', value: 268, coordinate: [0, 1, 2, 3]}]},
            {x: '3', y:'60', list: [{key: '轿车', value: 268, coordinate: [0, 2, 0, 2]}, {key:'行人', value: '5', coordinate: [0, 2, 1, 2]}]},
            {x: '4', y:'60', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '5', y:'60', list: [{key: '自行车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'轿车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '6', y:'60', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '7', y:'60', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '8', y:'60', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'自行车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'卡车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '9', y:'60', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
          ],
          [
            {x: '1', y:'50', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'自行车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'卡车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '2', y:'50', list: [{key: '货车', value: 268, coordinate: [1, 1, 0, 2]}, {key:'自行车', value: 35, coordinate: [1, 1, 1, 2]}]},
            {x: '3', y:'50', list: [{key: '摩托车', value: 268, coordinate: [1, 2, 0, 3]}, {key:'行人', value: 45, coordinate: [1, 2, 1, 3]}, {key:'自行车', value: 268, coordinate: [1, 2, 2, 3]}]},
            {x: '4', y:'50', list: [{key: '轿车', value: 268, coordinate: [1, 3, 0, 2]}, {key:'卡车', value: 444, coordinate: [1, 3, 1, 2]}]},
            {x: '5', y:'50', list: [{key: '轿车', value: 268, coordinate: [1, 3, 0, 2]}, {key:'卡车', value: 444, coordinate: [1, 3, 1, 2]}]},
            {x: '6', y:'50', list: [{key: '轿车', value: 268, coordinate: [1, 3, 0, 2]}, {key:'卡车', value: 444, coordinate: [1, 3, 1, 2]}]},
            {x: '7', y:'50', list: [{key: '轿车', value: 268, coordinate: [1, 3, 0, 2]}, {key:'卡车', value: 444, coordinate: [1, 3, 1, 2]}]},
            {x: '8', y:'50', list: [{key: '轿车', value: 268, coordinate: [1, 3, 0, 2]}, {key:'卡车', value: 444, coordinate: [1, 3, 1, 2]}]},
            {x: '9', y:'50', list: [{key: '轿车', value: 268, coordinate: [1, 3, 0, 2]}, {key:'卡车', value: 444, coordinate: [1, 3, 1, 2]}]},
          ],
          [
            {x: '1', y:'30', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '2', y:'30', list: [{key: '货车', value: 268, coordinate: [0, 1, 0, 2]}, {key:'卡车', value: '5', coordinate: [0, 1, 1, 2]}]},
            {x: '3', y:'30', list: [{key: '摩托车', value: 268, coordinate: [0, 2, 0, 2]}, {key:'自行车', value: '5', coordinate: [0, 2, 1, 2]}]},
            {x: '4', y:'30', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '5', y:'30', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '6', y:'30', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '7', y:'30', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '8', y:'30', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
            {x: '9', y:'30', list: [{key: '轿车', value: 268, coordinate: [0, 3, 0, 4]}, {key:'卡车', value: '5', coordinate: [0, 3, 1, 4]},{key:'货车', value: 268, coordinate: [0, 3, 2, 4]}, {key:'自行车', value:'5', coordinate: [0, 3, 3, 4]}]},
          ],
          
        ]

        const colorArray = {
          "轿车": 'rgba(255, 165, 129, 0.8)',
          "货车": 'rgba(254, 201, 41, 0.8)',
          "卡车": 'rgba(68, 203, 74, 0.8)',
          "行人": 'rgba(97, 156, 223, 0.8)',
          "摩托车": 'rgba(108, 84, 255, 0.8)',
          "自行车": 'rgba(189, 77, 185, 0.8)',
        }

        const numrows = data.length;
        const numcols = data[0].length;

        let xItemWidth = 120

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

        var x = d3.scaleBand()
            .domain(d3.range(numcols))
            .rangeRound([0, width - marginLeft]);
      
        const y = d3.scaleBand()
            .domain(d3.range(numrows))
            .rangeRound([0, height - marginTop]);

        if (xItemWidth * numcols < width) {
          xItemWidth = x.bandwidth()
        }

        const allwidth = xItemWidth * numcols
        ele.style = `width: ${allwidth}px`
        
        const svg = d3.select(ele)
            .append("svg")
            // .attr("width", width)
            .attr("width", allwidth)
            .attr("height", height)
            // .attr("viewBox", [0, 0, width, height])
            // .attr("style", "max-width: 100%;")
            .append("g")
	          .attr("transform", "translate(" + marginLeft + "," + 10 + ")");
        
        var background = svg.append("rect")
            .style("stroke-width", "2px")
            .style("fill", "#fff")
            .attr("width", width)
            .attr("height", height);

        

        const row = svg.selectAll(".row")
            .data(data)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

        const cell = row.selectAll(".cell")
            .data(function(d) {
              const item = d.map((it, i) => {return {...it, index: i }})
              return item 
            })
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d, i) {
              // return "translate(" + x(i) + ", 0)"; 
              return "translate(" + (xItemWidth*i) + ", 0)"; 
            });

        cell.append('rect')    
            .attr("width", xItemWidth)
            .attr("height", y.bandwidth())
            .style("fill", '#fff')
            .style("stroke", "#E1E3EB")
            .style("stroke-width", '3px');

        const cellItem = cell.selectAll(".cell-item")
            .data((function(d, i, v) {
              const list = d.list.map(it => { return {...it, index: d.index, x: d.x, y: d.y}})
              return list
            }))
            .enter().append("g")
            .attr("class", "cell-item")
            .attr("transform", function(d, i) {
              const height = y.bandwidth() / d.coordinate[3]
              const yMove = height * d.coordinate[2]
              return "translate(" + 0 + "," + yMove + ")"; 
            });

        cellItem.append('rect')    
            .attr("width", xItemWidth)
            .attr("height", (d, i, v) => {
              const height = y.bandwidth() / d.coordinate[3]
              return height
            })
            .style("fill", (d, i) => {
              return colorArray[d.key]
            })
            // .attr("class", "cell-item")
            .style("stroke", "#E1E3EB")
            .style("stroke-width", '0.2px');

        cellItem.append("text")
            .attr("dy", ".32em")
            .attr("x", xItemWidth / 2)
            .attr("y", (d, i, v) => {
              const height = y.bandwidth() / d.coordinate[3]
              return height / 2
            })
            .attr("text-anchor", "middle")
            .style("fill",'#2D2F39')
            .text(function(d, i) { 
              return d.value
            });



        const labels = svg.append('g')
            .attr('class', "labels");
        // X轴
        const columnLabels = labels.selectAll(".column-label")
            .data(data[0].map(it => it['x']))
            .enter().append("g")
            .attr("class", "column-label")
            // .attr("transform",(d, i) =>  "translate(" + x(i)  + "," + (height-marginTop) + ")")
            .attr("transform",(d, i) =>  "translate(" + (xItemWidth*i)  + "," + (height-marginTop) + ")")

        columnLabels.append('rect')
            .attr("width", xItemWidth)
            .attr("height", 30)
            .style("stroke-width", 0)
            .style("fill", '#fff')
      
        columnLabels.append("text")
            .attr("x", xItemWidth / 3)
            .attr("y", 30  / 2)
            .style('fill', '#8D91A5')
            .attr("dy", ".32em")
            .text(function(d, i) { return d; })
            .style('background-color', 'red')
      
        // Y轴
        var rowLabels = labels.selectAll(".row-label")
            .data((d,i) => {
              const list = data.map(it => it[0]['y'])
              list.push(0)
              return list
            })
            .enter().append("g")
            .attr("class", "row-label")
            .attr("transform", function(d, i) { 
              if (d === 0) {
                return "translate(" + 0 + "," + (height-marginTop) + ")"
              }
              return "translate(" + 0 + "," + y(i) + ")"
            });

        // rowLabels.append('rect')
        //     .attr("width",30)
        //     .attr("height", y.bandwidth())
        //     .style("stroke-width", 0)
        //     .style("fill", '#fff')
        //     .attr("transform", function(d, i) { return "translate(" + -30 + "," + 0 + ")"; });
      
        rowLabels.append("text")
            .attr("x", - 30 / 2)
            .attr("y", 0)
            .attr("dy", ".32em")
            .style('fill', '#8D91A5')
            .attr("text-anchor", "middle")
            .text(function(d, i) { return d; });
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
