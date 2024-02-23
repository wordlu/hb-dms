<template>
    <div class="viewport" ref="viewport" :style="viewportStyle()">
        <div v-if="showChart" ref="chart" class="chart" @dblclick.stop="$emit('selected')" />
        <div v-else class="placeholder" @dblclick.stop="$emit('selected')">{{ policy }}</div>
    </div>
</template>
<script>
import * as d3_base from "d3";

export default {
    props: {
        d3: {
            type: Object,
            default: function () {
                return Object.assign({}, d3_base)
            }
        },
        initWidth: {
            type: Number,
            default: 800
        },
        initHeight: {
            type: Number,
            default: 200
        },
        policy: {
            type: Object,
            default: function () {
                return null
            }
        }
    },
    data: () => {
        return {
            name: "histogram",
            schemaIsReady: 0,
            dataIsReady: 0,
            needRefresh: 0,
            // policy: null,
            width: 800,
            height: 200,
            showChart: false
        }
    },
    components: {

    },
    computed: {
        showChart: function() {
            return this.policy && this.policy.xProperty.length > 0 && this.policy.yProperty.length > 0
        }
    },
    mounted () {
        this.width = this.initWidth
        this.height = this.initHeight
        if (this.policy) {
            this.resizeHandler(this.width, this.height)
            if (!this.policy.isReady()) {
                this.schemaIsReady++
            }
        }
        
    },
    methods: {
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        // 监听屏幕大小改变
        bindChangeWindow () {
            window.onresize = () => {
                if (this.timer) return

                this.timer = setTimeout(() => {
                    this.resizeHandler()
                    this.timer = null
                }, 100)
            }
        },

        viewportStyle() {
            return "width: " + (this.initWidth || this.width) + "px; height: " + (this.initHeight || this.height) + "px;"
        },

        resizeHandler(w, h) {
            if (w) this.width = w
            // else this.width = this.$refs.viewport.offsetWidth
            if (h) this.height = h
            // else this.height = this.$refs.viewport.offsetHeight
            if (this.policy) {
                this.policy.resetPolicyConstraints({ width: this.width, height: this.height })
            }
            this.needRefresh++
        },

        render() {
            this.d3.select(this.$refs.chart).selectAll("svg").remove()
            this.policy.render(this.d3, this.policy.datasource.data, this.$refs.chart)
        }
    },
    watch: {
        schemaIsReady(n, o) {
            // 图表数据
            this.policy.refreshData(this)
        },
        dataIsReady(n, o) {
            this.render()
        },
        needRefresh(n, o) {
            // 渲染图表
            if (this.policy && this.policy.isReady()) {
                this.render()
            }
        },
        policy(n, o) {
            if (n) {
                this.resizeHandler(this.width, this.height)
                this.schemaIsReady++
                // this.showChart = n && n.xProperty.length > 0 && n.yProperty.length > 0
            }
        },
        initWidth(n, o) {
            if (n !== o) {
                this.width = n
                this.resizeHandler(this.width, this.height)
                this.needRefresh++
            }
        },
        initHeight(n, o) {
            if (n !== o) {
                this.height = n
                this.resizeHandler(this.width, this.height)
                this.needRefresh++
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .viewport {
        overflow-x: auto;
        overflow-y: hidden;
    }
    .placeholder {
        background: url(https://components.pharbers.com/dev/deploy/public/images/dashboard-preview.png) border-box center no-repeat;
    	background-size: contain;
        width: 100%;
        height: 100%;
    }
</style>
