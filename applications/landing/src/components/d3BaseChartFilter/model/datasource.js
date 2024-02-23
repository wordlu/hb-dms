

export default class PhDataSource {
    constructor(id, data, adapter=null) {
        this.id = id
        this.sort = {}
        this.data = data
        this.defaultData = data
        this.xAxisData = []
        this.filter = {}
        this.batch_size = 100
        if (!adapter)
            this.adapter = this.defaultAdapter
    }

    defaultAdapter(row, cols) {
        let result = []
        for (let idx = 0; idx < cols.length; ++idx) {
            result.push(row[cols[idx]])
        }
        return result
    }

    refreshPolicyData(ele, x, y) {
      // const arr = [ { "scenes_name": "物体车切出", "count_num": 535 }, { "scenes_name": "主车减速", "count_num": 477 }, { "scenes_name": "主车加速", "count_num": 455 }, { "scenes_name": "物体车切入", "count_num": 366 }, { "scenes_name": "主车跟随前车", "count_num": 317 }, { "scenes_name": "周围物体密度11-15", "count_num": 143 }, { "scenes_name": "周围物体密度6-10", "count_num": 93 }, { "scenes_name": "周围物体密度16-20", "count_num": 87 }, { "scenes_name": "主车停车", "count_num": 86 }, { "scenes_name": "前方无车", "count_num": 85 }, { "scenes_name": "主车转弯", "count_num": 31 }, { "scenes_name": "周围物体密度-大于20", "count_num": 18 }, { "scenes_name": "主车匀速行驶", "count_num": 1 } ]
      if (this.defaultData && this.defaultData.length > 0) {
        if (this.xAxisData.length > 0) {
          ele.policy.datasource.data = this.defaultData.filter(it => this.xAxisData.includes(it[x]))
        } else {
          ele.policy.datasource.data = this.defaultData
        }
        
        ele.dataIsReady++ 
      }
    }
}
