import policy from "./policy"

export default class PhPieChartPolicy extends policy{
    constructor(id, datasource, option = {}) {
        super(id, datasource)
        this.width = 640            // the outer width of the chart, in pixels
        this.height = 400           // the outer height of the chart, in pixels

        this.colors = undefined
        this.format = ","           // a format specifier string for the y-axis
        this.innerRadius = 0,       // inner radius of pie, in pixels (non-zero for donut)
        this.outerRadius = Math.min(this.width, this.height) / 2, // outer radius of pie, in pixels
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
        return "pie"
    }

    resetPolicyConstraints(option) {
        this.title = option.title ? option.title : this.title
        this.width = option.width ? option.width : this.width
        this.height = option.height ? option.height : this.height

        this.colors = option.colors ? option.colors : this.colors
        this.format = option.format ? option.format : this.format

        this.innerRadius = option.innerRadius ? option.innerRadius : this.innerRadius
        this.outerRadius = Math.min(this.width, this.height) / 2
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
        const innerRadius = this.innerRadius
        const outerRadius = this.outerRadius
        const labelRadius = this.labelRadius
        const stroke = this.stroke
        const strokeWidth = this.strokeWidth
        const strokeLinejoin = this.strokeLinejoin
        const padAngle = this.padAngle

        const colorScale = d3.scaleOrdinal()
            .domain(d3.range(data.length))
            .range(d3.schemeSet3);

        const that = this
        const computeN = (x) => {
            return x[that.xProperty]
        }

        const computeV = (x) => {
            return x[that.yProperty]
        }

        const title = (x) => { return data[x][that.xProperty] }

        // Compute values.
        const N = d3.map(data, computeN)
        const V = d3.map(data, computeV)
        const I = d3.range(N.length).filter(i => !isNaN(V[i]))

        // Unique the names.
        // if (names === undefined) names = N;
        let names = N
        names = new d3.InternSet(names)

        // Chose a default color scheme based on cardinality.
        if (this.colors === undefined) this.colors = d3.schemeSpectral[names.size];
        if (this.colors === undefined) this.colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

        // Construct scales.
        const color = d3.scaleOrdinal(names, this.colors);

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
        const arc = d3.arc().innerRadius(outerRadius / 2).outerRadius(outerRadius);
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
            .attr("fill", d => colorScale(N[d.data]))
            .attr("d", arc)
            .append("title")
            .text(d => title(d.data));

        // svg.append("g")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", 10)
        //     .attr("text-anchor", "middle")
        //     .selectAll("text")
        //     .data(arcs)
        //     .join("text")
        //     .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        //     .selectAll("tspan")
        //     .data(d => {
        //         const lines = `${title(d.data)}`.split(/\n/);
        //         return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
        //     })
        //     .join("tspan")
        //     .attr("x", 0)
        //     .attr("y", (_, i) => `${i * 1.1}em`)
        //     .attr("font-weight", (_, i) => i ? null : "bold")
        //     .text(d => d);
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
