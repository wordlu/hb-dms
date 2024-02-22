import request from '../utils/request'
import { setQuery } from "./lib/setQuery"

declare global {
  interface Window { server: any; }
}

//发布算法
export function funcReleaseToSpace(data:any) {
  return request({
    url: `http://dms${window.server.domain}/api/func-release-to-space`,
    method: 'post',
    headers: {
      'Content-Type':'application/vnd.api+json'
    },
    data
  })
}

export function funcGovernanceTask(data:any) {
  return request({
    url: `http://dms${window.server.domain}/api/func-governance-task`,
    method: 'post',
    headers: {
      'Content-Type':'application/vnd.api+json'
    },
    data
  })
}

export function funcGovernanceLog(query:any) {
  return request({
    url: `http://dms${window.server.domain}/api/func-governance-log`,
    method: 'get',
    params: query
  })
}

export function getMdData(query) {
  return request({
    url: `http://dms${window.server.domain}/${query.path}`,
    method: 'get',
    params: {}
  })
}

// 上传zip
export function funcUploadCode(data:any, url) {
  return request({
    url: `http://dms${window.server.domain}/api/func-upload-code/${url}`,
    method: 'post',
    headers: {
      'Content-Type':'application/vnd.api+json'
    },
    data
  })
}

// 获取代码
export function funcPathContent(query) {
  return request({
    url: `http://dms${window.server.domain}/api/func-path-content/${query}`,
    method: 'get',
    params: {}
  })
}
