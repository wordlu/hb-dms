import request from '@/utils/request'

export function func_file_tree(data) {
  let url = '/api/func_file_tree'
  let matrix = Object.entries(data)
  matrix.forEach((item,index)=>{
    if(index == 0){
      url+=`?${item[0]}=${item[1]}`
    }else{
      url+=`&${item[0]}=${item[1]}`
    }
  })
  return request({
    url: url,
    method: 'get'
  })
}

// chart相关
export function func_charts_adapter(data){
  return request({
    url: `http://dms${window.server.domain}/api/func-charts-adapter/`,
    method: 'post',
    data
  })
}