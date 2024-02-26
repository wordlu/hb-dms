import policy from "./policy"

export default class PhBarChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.title = undefined
        this.marginTop = 40         // the top margin, in pixels
        this.marginRight = 40        // the right margin, in pixels
        this.marginBottom = 60      // the bottom margin, in pixels
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
        this.zProperty = "zProperty" // avg, max, min

        this.xLabel = ""
        this.yLabel = ""
        this.color = "#FF7700"

        // this.data = null
        this.resetPolicyConstraints(option)
    }

    policyName() {
        return "distributeTable"
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
        this.zProperty= option.zProperty ? option.zProperty : this.zProperty

        this.xLabel = option.xLabel ? option.xLabel : this.xLabel
        this.yLabel = option.yLabel ? option.yLabel : this.yLabel
        this.color = option.color ? option.color : this.color

        this.datasource = option.datasource ? option.datasource : this.datasource
        this.schema = option.schema ? option.schema : this.schema
        // this.dataset = this.datasource.name
    }

    render (d3, data, ele) {
        ele.style = `width:auto`
        const that = this
        if (!data || data.length === 0) return;
        /** 表头数据 */ 
        const labelsArray = data.map(it => {
          return it.map(item => item[this.xProperty])
        })
        const labelsDataArray = Array.from(new Set(labelsArray.flat()))
        const maxLabel = Math.max(...labelsDataArray)
        const minLabel = Math.min(...labelsDataArray)
        const labelsLength = maxLabel - minLabel
        const labelsData = []
        for (let i=0; i <= labelsLength; i++) {
          labelsData.push(minLabel+i);
        }
        // const labelsData =['纵向米', '左2车道', '左1车道', '主车道', '右1车道', '右2车道'];

        /** 表格数据 */
        data = data.map(it => {
          return labelsData.map(item => {
            const xItemData = it.filter(val => val[that.xProperty] === item)[0]
            if (xItemData) return xItemData
            const obj = {}
            obj[that.xProperty] = item 
            obj[that.yProperty] = it[0][that.yProperty]
            obj[that.zProperty] = -1
            if (obj[that.xProperty] === 0 && obj[that.yProperty] === 0) {
              obj[that.zProperty] = 'Ego'
            }
            return obj
          }) 
        })
        data.sort(function(a, b){return b[0][that.yProperty] - a[0][that.yProperty]})
        const subtotal = ['小计']
        labelsData.unshift('纵向米')
        labelsData.forEach(item => {
          if (item !== '纵向米') {
            const value = data.map(it => {
              const dataItem = it.filter(dataItem => dataItem[that.xProperty] === item)[0] ? it.filter(dataItem => dataItem[that.xProperty] === item)[0][that.zProperty] : 0
              return dataItem
            })
            const sum = value.reduce((pre, cur) => {
              if (pre < 0) pre = 0
              if (cur === -1 || cur === 'Ego') {
                return pre
              }
              return pre+cur
            })
            subtotal.push(sum)
          }
        })
        const totalSum = subtotal.reduce((pre, cur) => {
          if (pre === '小计') {pre = 0}
          if (cur === '小计') {cur = 0}
          return Number(pre)+Number(cur)
        })
       
        const total = ['合计', totalSum]

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
        
        const background = svg.append("rect")
            .style("stroke-width", "1px")
	          .style("stroke", "#f9f9fb")
            .style("fill",'#fff')
            .attr("width", width)
            .attr("height", height);

        // 表格宽高
        const x = d3.scaleBand()
            .domain(d3.range(numcols))
            .rangeRound([0, width - marginLeft - marginRight]);
      
        const y = d3.scaleBand()
            .domain(d3.range(numrows))
            .rangeRound([0, height - marginTop - marginBottom * 2]);

        const row = svg.selectAll(".row")
            .data(data)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

        const cell = row.selectAll(".cell")
            .data(function(d) { return d; })
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

        cell.append('rect')    
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("stroke", "#fff")
            .style("stroke-width", '0.1px');
        
        cell.append("text")
            .attr("dy", ".32em")
            .attr("x", x.bandwidth() / 2)
            .attr("y", y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .style("fill", (d, i) => {
              if (d[that.zProperty] === 'Ego') return '#2D2F39'
              if (d[that.zProperty] === -1) {
                return '#bbb'
              } 
              if (d[that.zProperty] >= 100 && d[that.zProperty] < 500) return '#2D2F39'
              return '#fff'
            })
            .style("font-size",'14px')
            .text(function(d, i) { return d[that.zProperty]; });
        
        row.selectAll(".cell")
            .data(function(d, i) { return data[i]; })
            .style("fill", (d, x, y) => {
              if (d[that.zProperty] === -1) {
                return '#bbb'
              } 
              else if ( d[that.zProperty] === 'Ego' || (d[that.xProperty] === 0 && d[that.yProperty] === 0)) {
                return '#fff'
              }
              else if (!d[that.zProperty] || d[that.zProperty] < 100) {
                return '#EB4747'
              } 
              else if (d[that.zProperty] >= 100 && d[that.zProperty] < 500) {
                return '#FFBB80'
              } 
              else if (d[that.zProperty] >= 500 && d[that.zProperty] <= 1000) {
                return '#FF7900'
              }
              else {
                return '#50BBAE'
              }
            }) 
        
        const labels = svg.append('g')
            .attr('class', "labels");
        // X上轴
        const columnLabels = labels.selectAll(".column-label")
            .data(labelsData)
            .enter().append("g")
            .attr("class", "column-label")
            .style("font-size",'14px')
            .attr("transform", function(d, i) { 
                if (d === '纵向米') {
                  return "translate(" + -(marginLeft+marginRight) + "," + -marginTop + ")";
                }
                return "translate(" + x(i-1)  + "," + -marginTop + ")";
             });

        columnLabels.append('rect')
            .attr("width", x.bandwidth())
            .attr("height", marginTop)
            .style("stroke-width", '0.2px')
            .style("stroke", '#fff')
            .style("fill", '#E1E3EB')
      
        columnLabels.append("text")
            .attr("x", (d, i) => {
              if (d === '纵向米') return marginLeft/2
              return  x.bandwidth() / 3
            })
            .attr("y", marginTop / 2)
            // .attr("text-anchor", "middle")
            .attr("dy", ".32em")
            .text(function(d, i) { return d; })
            // .style('background-color', 'red')
        
        // 小计
        const columnLabelsSubtotal = labels.selectAll(".column-label-subtotal")
            .data(subtotal)
            .enter().append("g")
            .attr("class", "column-label-subtotal")
            .style("stroke-width", '0.2px')
            .style("stroke", 'rgba(11, 12, 14, 0.15)')
            // .attr("text-anchor", "middle")
            .style("font-size",'14px')
            .attr("transform", function(d, i) { 
                if (d === '小计') {
                  return "translate(" + -(marginLeft+marginRight) + "," + y.bandwidth() * data.length  + ")";
                }
                return "translate(" + x(i-1)  + "," + y.bandwidth() * data.length + ")";
             });

        columnLabelsSubtotal.append('rect')
            .attr("width", x.bandwidth())
            .attr("height", marginTop)
            .style("fill", '#F9F9FB')
      
        columnLabelsSubtotal.append("text")
            .attr("x", (d, i) => {
              if (d === '小计') return marginLeft/2
              return  x.bandwidth() / 3
            })
            .attr("y", marginTop / 2)
            // .attr("text-anchor", "middle")
            .attr("dy", ".32em")
            .text(function(d, i) { return d; })
            .style('background-color', 'red')


        // 合计
        const columnLabelsTotal = labels.selectAll(".column-label-total")
            .data(total)
            .enter().append("g")
            .attr("class", "column-label-total")
            .style("stroke-width", '0.2px')
            .style("stroke", 'rgba(11, 12, 14, 0.15)')
            .style("font-size",'14px')
            .attr("transform", function(d, i) { 
                if (d === '合计') {
                  return "translate(" + -(marginLeft+marginRight) + "," + (y.bandwidth() * (data.length) + marginTop)  + ")";
                }
                return "translate(" + x(i-1)  + "," + (y.bandwidth() * (data.length) + marginTop) + ")";
             });

        columnLabelsTotal.append('rect')
            .attr("width", (d, i) => {
              if (d === '合计') return x.bandwidth()
              return x.bandwidth() * (labelsData.length - 1)
            })
            .attr("height", marginTop)
            .style("fill", '#F9F9FB')
      
        columnLabelsTotal.append("text")
            .attr("x", (d, i) => {
              if (d === '合计') return marginLeft/2
              return (x.bandwidth() * (labelsData.length - 1)) / 2
            })
            .attr("y", marginTop / 2)
            .attr("dy", ".32em")
            .text(function(d, i) { return d; })
            .style('background-color', 'red')
      
        // Y轴
        const rowLabels = labels.selectAll(".row-label")
            .data(data.map(it => it[0][that.yProperty]))
            .enter().append("g")
            .attr("class", "row-label")
            .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

        rowLabels.append('rect')
            .attr("width", marginLeft+marginRight)
            .attr("height", y.bandwidth())
            // .style("stroke-width", '1px')
            // .style("stroke-left", '#E1E3EB')
            .style("fill", '#fff')
            .attr("transform", function(d, i) { return "translate(" + -(marginLeft+marginRight) + "," + 0 + ")"; });
      
        rowLabels.append("text")
            .attr("x", -(marginLeft+marginRight)/2)
            .attr("y", y.bandwidth() / 2)
            .style("font-size",'14px')
            .attr("dy", ".32em")
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