
export default class policy {
    constructor(id, datasource) {
        this.id = id
        this.datasource = datasource
    }

    policyName() {
        throw new Error("not implement")
    }

    resetPolicyConstraints(option) {
        throw new Error("not implement")
    }

    render (d3, data, ele) {
        throw new Error("not implement")
    }

    refreshSchema() {
        throw new Error("not implement")
    }

    refreshData() {
        throw new Error("not implement")
    }

    isReady() {
        throw new Error("not implement")
    }
}
