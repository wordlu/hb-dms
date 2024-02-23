const state = {
  view_setting:{
    /**
     * @show { Boolean } true(show) or false(hide)
     * @color { Hexadecimal 0x###### }
     */
    Point_cloud:{
      label:'Point cloud',
      attr:{
        show:{
          type:'Checkbox',
          value:true
        },
        color:{
          type:'ColorPicker',
          value:'0x00ffff'
        }
      }
    },
    Bounding_box:{
      label:'Bounding box',
      attr:{
        show:{
          type:'Checkbox',
          value:true
        },
        color:{
          type:'ColorPicker',
          value:'0x00ffff'
        },
        objs:{
          type:"Checkbox",
          value:[
            'car','truck','motorcycle','pedestrian'
          ],
          checks:[
            'car','truck','motorcycle','pedestrian'
          ]
        }
      },
      Object:{
        objs:[
          {

          }
        ]
      }
    },
    Video:{
      label:'Video',
      show:true
    }
  },
  arrt_setting:{
    data_type:{
      label:'Data type',
      attr:{
        'OD DUT':{
          type:"Checkbox",
          value:[
            'car','truck','motorcycle','pedestrian'
          ],
          checks:[
            'car','truck','motorcycle','pedestrian'
          ]
        },
        'OD GT':{
          type:"Checkbox",
          value:[
            'car','truck','motorcycle','pedestrian'
          ],
          checks:[
            'car','truck','motorcycle','pedestrian'
          ]
        }
      },
      Object:{
        objs:[
          {

          }
        ]
      }
    },
    ROI:{
      label:'ROI',
      attr:{
        'Check':{
          type:"Checkbox",
          value:[
            '0~30','0~50','0~100','0~150','0~200'
          ],
          checks:[
            '0~30','0~50','0~100','0~150','0~200'
          ]
        }
      },
      Object:{
        objs:[
          {

          }
        ]
      }
    },
    indicatorClassification:{
      label:'Indicator classification',
      attr:{
        'Check':{
          type:"Checkbox",
          value:[
            'FP','FN','TP'
          ],
          checks:[
            'FP','FN','TP'
          ]
        }
      },
      Object:{
        objs:[
          {

          }
        ]
      }
    },
    diffIndicator:{
      label:'Diff indicator',
      attr:{
        'Check':{
          type:"Checkbox",
          value:[
            '轮廓误差','坐标误差','速度误差','方向误差'
          ],
          checks:[
            '轮廓误差','坐标误差','速度误差','方向误差'
          ]
        }
      },
      Object:{
        objs:[
          {

          }
        ]
      }
    }
  }
}

const mutations = {
  SET_VIEW_SETTING: (state, setting) => {
    state.view_setting = setting
  },
  SET_DATA_SETTING: (state, setting) => {
    state.arrt_setting = setting
  }
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
