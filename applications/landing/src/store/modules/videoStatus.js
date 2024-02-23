const state = {
  frame_idx:1,
  countFrame:0,
  csvRows:[],
  imgUrl:null,
  frameList:[]
}

const mutations = {
  VIDEO_STATUS: (state, status) => {
    state.videoStatus = status
  },
  SET_FRAME_IDX: (state, status) => {
    state.frame_idx = status
  },
  SET_COUNT_FRAME: (state, status) => {
    state.countFrame = status
  },
  SET_CSV_ROWS: (state, status) => {
    state.csvRows = status
  },
  SET_IMG_URL: (state, status) => {
    state.imgUrl = status
  },
  SET_FRAME_LIST: (state, status) => {
    state.frameList = status
  },
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
