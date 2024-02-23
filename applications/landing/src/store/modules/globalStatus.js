const state = {
  obj_attr_active:{},
  allGroup:{
    list:[]
  }
}

const mutations = {
  SET_OBJ_ATTR_ACTIVE: (state, obj_attr_active) => {
    state.obj_attr_active = obj_attr_active
  },
  SET_ALL_GROUP: (state, groups) => {
    state.allGroup = groups
  },
}

const actions = {
  setObjAttrActive({ commit },arg) {
    commit('SET_OBJ_ATTR_ACTIVE',arg)
  },
  setallGroup({ commit },arg) {
    commit('SET_ALL_GROUP',arg)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
