

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
