import request from '@/utils/request'

export function fetchComponentsAction(query) {
  return request({
    url: `http://${window.server.ssoPrefix}/api/access-policy/action`,
    method: 'get',
    headers: {
      'Ld-Project': query.LDProject
    }
  })
}

// 创建项目
export function autoDeployment(data){
  return request({
    url: `http://dms${window.server.domain}/api/auto-deployment`,
    method: 'post',
    data
  })
}

// 删除项目
export function autoDeploymentDelete(data){
  return request({
    url: `http://dms${window.server.domain}/api/auto-deployment`,
    method: 'delete',
    data
  })
}

// 绑定/解绑项目和工作空间
export function autoDeploymentPut(data){
  return request({
    url: `http://dms${window.server.domain}/api/auto-deployment`,
    method: 'put',
    data
  })
}

export function fetchProjectSceneStatistics(query) {
  return request({
    url: '/api/func_project_scene_statistics',
    method: 'get',
    params: query
  })
}

export function fetchFlowHistory(query) {
  return request({
    url: '/api/func_list_execution',
    method: 'get',
    params: query
  })
}

export function fetchFlowLog(query) {
  return request({
    url: '/api/func_dag_logs',
    method: 'get',
    params: query
  })
}

export function fetchFlowExecute(query) {
  return request({
    url: '/api/func_flow_execute',
    method: 'get',
    params: query
  })
}

export function updateFlowExecute(data) {
  return request({
    url: '/api/func_flow_execute',
    method: 'post',
    data
  })
}

export function stopFlowExecute(data) {
  return request({
    url: '/api/func_flow_execute',
    method: 'PATCH',
    data
  })
}

export function fetchFlowstatus(data) {
  return request({
    url: `/api/func_task_status?dagname=${data.dagname}&runid=${data.runid}&taskname=${data.taskname}`,
    method: 'get'
  })
}


export function func_flow_adapter(data) {
  let url = '/api/func_flow_adapter'
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


export function getMdData(query) {
  return request({
    url: `/${query.path}`,
    method: 'get',
    params: {}
  })
}
