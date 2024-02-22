
// import { staticFilePath, hostName } from '../../config/envConfig'

export default class PhSlideModel {
    constructor(id, data) {
        this.id = id

        if (data) {
            this.queryContent = JSON.parse(data.content)
            this.content = [...this.queryContent]
            // this.content = Object.assign({}, this.queryContent)
            this.slideId = data.slideId
            this.pdId = data.pdId
            this.title = data.title
            this.idx = data.idx
            this.datasetName = data.datasetName || ""
            this.datasetId = data.datasetId || ""
            this.isSave = true
        }
    }
}
