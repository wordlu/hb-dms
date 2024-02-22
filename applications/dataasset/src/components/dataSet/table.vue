<template>
  <div class="dataSet_table">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;height: calc(100% - 70px);overflow: auto;">
      <el-table-column
        prop="id"
        show-overflow-tooltip
        :render-header="renderHeader"
        :label="$t(`common['数据集名称']`)"
      >
      </el-table-column>
      <el-table-column
        :render-header="renderHeader"
        :label="$t(`search['采集城市']`)">
        <template slot-scope="scope">
          {{ scope.row.city?scope.row.city.toString():'' }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        :label="$t(`search['采集方式']`)">
        <template slot-scope="scope">
          {{ scope.row.roadclass?scope.row.roadclass.toString():'' }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        :label="$t(`search['采集项目']`)">
        <template slot-scope="scope">
          {{ scope.row.projectflag }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        :label="$t(`search['采集车']`)">
        <template slot-scope="scope">
          {{ scope.row.vehicle?scope.row.vehicle.toString():''}}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        :label="$t(`search['采集人员']`)">
        <template slot-scope="scope">
          {{ scope.row.drivers?scope.row.drivers.toString():'' }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        :label="$t(`search['采集时间']`)">
        <template slot-scope="scope">
          {{ formatter(scope.row.collecttime,"yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        show-overflow-tooltip
        :label="$t(`search['存放地址']`)">
        <template slot-scope="scope">
          {{ scope.row.prefix }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        :label="$t(`search['标签']`)">
        <template slot-scope="scope">
          <tags :icons="filterTags(scope.row.tags)" :hasClear="false" />
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        :label="$t(`search['原始数据大小']`)">
        <template slot-scope="scope">
          {{ byteToTB(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        show-overflow-tooltip
        :label="$t(`search['采集硬件']`)">
        <template slot-scope="scope">
          {{ scope.row.sensor?scope.row.sensor.toString():'' }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        label="集成方案">
        <template slot-scope="scope">
        </template>
      </el-table-column> -->
      <el-table-column
      :render-header="renderHeader"
        show-overflow-tooltip
        :label="$t(`search['质量分数']`)">
        <template slot-scope="scope">
          {{ scope.row.score }}
        </template>
      </el-table-column>
      <el-table-column
      :render-header="renderHeader"
        prop="category"
        align="center"
        :label="$t(`common['类型']`)">
        <template slot-scope="scope">
          {{ scope.row.datatype?scope.row.datatype.toString():'' }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="updated"
        label="时间">
        <template slot-scope="scope">
          {{ formatter(scope.row.updated,"yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column> -->
      <el-table-column
        prop="name"
        :render-header="renderHeader"
        :label="$t(`common['操作']`)"
        width="50">
        <template slot-scope="scope">
          <el-dropdown @command="(val) => handleCommand(val, scope.row)">
            <span class="el-dropdown-link">
              <el-button @click="handleClick(scope.row)" type="text" size="small" icon="el-icon-more"></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="数据详情" icon="el-icon-more">{{ $t(`common['数据详情']`) }}</el-dropdown-item>
              <!-- <el-dropdown-item command="编辑" icon="el-icon-more">{{ $t(`common['编辑']`) }}</el-dropdown-item> -->
              <el-dropdown-item command="删除" icon="el-icon-more">{{ $t(`common['删除']`) }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import tags from '@/components/tags/tags.vue'
export default {
  components:{
    tags
  },
  props:{
    search:Object,
    iconsall:Array,
    reList:Number
  },
  data(){
    return{
      tableData:[],
      currentPage:0,
      total:0,
      activeRow:{},
      dataType:[{
        name: '点云',
        value: 'pointCloud'
      }, {
        name: '摄像头视频',
        value: 'cameraVideo'
      }, {
        name: '感知视频',
        value: 'perceptualVideo'
      }, {
        name: 'can',
        value: 'can'
      }, {
        name: '高精惯导',
        value: 'inertialNavigation'
      }, {
        name: '高精地图',
        value: 'map'
      }, {
        name: '自动化标注成果',
        value: 'autoLabeling'
      }, {
        name: '人工标注成果',
        value: 'manualLabeling'
      }],
      params:{
        offset:0,
        limit:10,
        project:this.$route.params.id
      }
    }
  },
  watch:{
    reList(newVal){
      this.getList()
    },
    search:{
      handler(newVal){
        let tags = []
        newVal.icons.forEach(item => {
          tags.push(item.id)
        });
        if(newVal.input !== '' || newVal.input){
          this.params.fuzzyMatch = [
            'name',newVal.input
          ]
        }else{
          delete this.params.fuzzyMatch
        }
        this.params.tags = tags.toString()
        this.getList()
      },
      deep: true
    }
  },
  created(){
    this.getList()
  },
  methods: {
    renderHeader(h,data){
      return h("span", [
        h(
            "el-tooltip",
            {
              attrs: {
                class: "item",
                effect: "dark",
                content: data.column.label,
                placement: "top",
              },
            },
            [h("span", data.column.label)]
        ),
      ]);
    },
    filterTags(tags){
      let tagsArr = []
      let iconsall = this.iconsall;
      for(let i=0;i<tags.length;i++){
        for(let j=0;j<iconsall.length;j++){
          if(iconsall[j].id == tags[i]){
            tagsArr.push(iconsall[j])
          }
        }
      }
      return tagsArr;
    },  
    getList(){
      this.$dataassetApi['findAll']('datasets',this.params).then(res=>{
        this.total = res.count
        this.tableData = res.data
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.params.offset = this.params.limit * (val - 1)
      console.log(`当前页: ${val}`);
      this.getList()
    },
    handleCommand(command, row) {
      if(command == '数据详情'){
        // this.$emit('showDetailClick', row);
        this.$router.push({name:'visualization',params:{dataset:row.id,prefix:row.prefix,app_name:'dataset'}})
      }else if(command == '删除'){
        this.$confirm(this.$t(`common['确认删除']`)+'？',this.$t(`common['系统提示']`), {
            confirmButtonText: this.$t(`common['确认']`),
            cancelButtonText: this.$t(`common['取消']`),
            type: 'warning'
          })
        .then(_ => {
          // this.$api['removeitem']('datasets',this.activeRow.id).then(res=>{
          //   this.getList()
          //   this.$message({
          //     message: `名称为 ${this.activeRow.name} 的数据集已被删除`,
          //     type: 'success'
          //   });
          // })
        })
        .catch(_ => {});
      }else if(command == '编辑'){
        this.$emit('openEditDataDom',row)
      }
    },
    toDataInfo(row){
      console.log(row,'toDataInfo')
    },
    handleClick(e){
      this.activeRow = e
    },
    byteToTB(e){
        let byte = e
        if(byte > 0){
            let kb = byte / 1024
            if(kb >= 1024){
                let mb = kb / 1024
                if(mb >= 1024){
                    let gb = mb / 1024
                    if(gb >= 1024){
                      let tb = gb / 1024
                      return tb.toFixed(1) + 'TB'
                    }else{
                      return gb = gb.toFixed(1)+'GB'
                    }
                }else{
                    return mb = mb.toFixed(1)+'MB'
                }
            }else{
                return kb = kb.toFixed(1)+'KB'
            }
        }else{
            return '0KB'
        }
    },
    formatterType(type) {
      const item = this.dataType.filter(it => it.value === type)[0]
      return item ? item.name : type
    },
    formatter(thistime, fmt) {
      if (!thistime) return '--'
      const isUTC = thistime.indexOf('Z') > -1 ? 'UTC' : ''
      let $this = new Date(thistime)
      let o = {
        'M+': $this[`get${isUTC}Month`]() + 1,
        'd+': $this[`get${isUTC}Date`](),
        'h+': $this[`get${isUTC}Hours`](),
        'm+': $this[`get${isUTC}Minutes`](),
        's+': $this[`get${isUTC}Seconds`](),
        'q+': Math.floor(($this[`get${isUTC}Month`]() + 3) / 3),
        'S': $this[`get${isUTC}Milliseconds`]()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this[`get${isUTC}FullYear`]() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
  },
}
</script>

<style lang="scss">
.dataSet_table{
  height: 100%;
  padding-top: 15px;
  // .el-table__header-wrapper{
  //   display: none;
  // }

  .el-table__header th div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  .paging{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
  }
  .cell{
    font-family: 'Noto Sans SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    /* or 157% */

    /* 01 Netural/N700 */

    color: #2D2F39;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
  }
}

</style>