import policy from "./policy"

export default class PhPieChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.width = 640            // the outer width of the chart, in pixels
        this.height = 400           // the outer height of the chart, in pixels
        this.marginBottom = 40      // the bottom margin, in pixels

        this.colors = undefined
        this.format = ","           // a format specifier string for the y-axis
        this.innerRadius = 0,       // inner radius of pie, in pixels (non-zero for donut)
        this.outerRadius = Math.min(this.width-this.marginBottom, this.height-this.marginBottom) / 2, // outer radius of pie, in pixels
        this.labelRadius = (this.innerRadius * 0.2 + this.outerRadius * 0.8), // center radius of labels
        this.stroke = this.innerRadius > 0 ? "none" : "white", // stroke separating widths
        this.strokeWidth = 1,       // width of stroke separating wedges
        this.strokeLinejoin = "round", // line join of stroke separating wedges
        this.padAngle = this.stroke === "none" ? 1 / this.outerRadius : 0, // angular separation between wedges

        this.dataset = this.datasource.name
        this.xProperty = "xProperty"
        this.yProperty = "yProperty"
        this.yPropertyFunc = "max"     // avg, max, min

        // this.data = null
        this.resetPolicyConstraints(option)
    }

    policyName() {
        return "archPie"
    }

    resetPolicyConstraints(option) {
        this.title = option.title ? option.title : this.title
        this.width = option.width ? option.width : this.width
        this.height = option.height ? option.height : this.height
        this.marginBottom = option.marginBottom ? option.marginBottom : this.marginBottom

        this.colors = option.colors ? option.colors : this.colors
        this.format = option.format ? option.format : this.format

        this.innerRadius = option.innerRadius ? option.innerRadius : this.innerRadius
        this.outerRadius = Math.min(this.width-this.marginBottom, this.height-this.marginBottom) / 2
        this.labelRadius = option.labelRadius ? option.labelRadius : this.labelRadius

        this.stroke = this.innerRadius > 0 ? "none" : "white"
        this.strokeWidth = 1
        this.strokeLinejoin = option.storkeLinejoin ? option.storkeLinejoin : this.strokeLinejoin
        this.padAngle = this.stroke === "none" ? 1 / this.outerRadius : 0

        this.datasource = option.datasource ? option.datasource : this.datasource
        this.schema = option.schema ? option.schema : this.schema
        this.dataset = this.datasource.name

        this.xProperty= option.xProperty ? option.xProperty : this.xProperty
        this.yProperty= option.yProperty ? option.yProperty : this.yProperty
        this.yPropertyFunc = option.yPropertyFunc ? option.yPropertyFunc : this.yPropertyFunc

        this.colors = option.colors ? option.colors : this.colors
    }

    render (d3, data, ele) {
        ele.style = `width:auto`
        const width = this.width
        const height = this.height
        const marginBottom = this.marginBottom
        const innerRadius = this.innerRadius
        const outerRadius = this.outerRadius
        const labelRadius = this.labelRadius
        const stroke = this.stroke
        const strokeWidth = this.strokeWidth
        const strokeLinejoin = this.strokeLinejoin
        const padAngle = this.padAngle
        const colorArray = ['#FFA581', '#FEC929', '#44CB4A', '#619CDF', '#6C54FF', '#BD4DB9', '#75b937', '#00a199', '#00953c', '#006bbc', '#5e2385', '#b5338c', '#fa7a45', '#e9b6d4', '#beb7d9', '#7facd6']
        const legendArray = []

        const colorScale = d3.scaleOrdinal()
            .domain(d3.range(data.length))
            .range(colorArray);

        const that = this
        const computeN = (x) => {
            return x[that.xProperty]
        }

        const computeV = (x) => {
            return x[that.yProperty]
        }

        const title = (x) => { 
          return data[x][that.xProperty] + "-" + data[x][that.yProperty]
        }

        // Compute values.
        const N = d3.map(data, computeN)
        const V = d3.map(data, computeV)
        const I = d3.range(N.length).filter(i => !isNaN(V[i]))

        let names = N
        names = new d3.InternSet(names)
        // Compute titles.
        if (this.title === undefined) {
            const formatValue = d3.format(this.format);
            this.title = i => `${N[i]}\n${formatValue(V[i])}`;
        } else {
            const O = d3.map(data, d => d);
            const T = this.title;
            this.title = i => T(O[i], i, data);
        }

        // Construct arcs.
        const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
        const arc = d3.arc().innerRadius(outerRadius/2).outerRadius(outerRadius);
        const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

        const svg = d3.select(ele).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        svg.append("g")
            .attr("stroke", stroke)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linejoin", strokeLinejoin)
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", (d) => {
              if (legendArray.filter(it => it.key === N[d.data]).length < 1) {
                legendArray.push({key: N[d.data], value: colorScale(N[d.data])}) 
              }
              return colorScale(N[d.data])
            })
            .attr("fill", d => colorScale(N[d.data]))
            .attr("d", arc)
            .append("title")
            .text(d => {
              return title(d.data)
            });


        // 图例
        svg.append("foreignObject")//先往svg中塞个foreignObject
            .attr('y', outerRadius+8)
            .attr('x', -width/2)
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
                    function getTextWidth(str) {
                        let width = 0;
                        const html = document.createElement('span');
                        html.innerText = str;
                        html.className = 'getTextWidth';
                        html.style.fontSize = '12px'
                        document.querySelector('body').appendChild(html);
                        width = document.querySelector('.getTextWidth').offsetWidth;
                        document.querySelector('.getTextWidth').remove();
                        return width;
                    }
                    const length = d.key ? getTextWidth(d.key)+ 10 : 10
                    // const length = d.key ? d.key.length * 6 + 8 : 10
                    
                    return "translate("+ length +"," + 9 + ")"; 
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
        return this.xProperty && this.yProperty && this.datasource.data
    }
}
