import request from '../utils/request'
import { setQuery } from "./lib/setQuery"

export function findAll(module,data) {
  let url = setQuery(module,data)
  return request({
    url: url,
    method: 'get',
    headers: {
      'Content-Type':'application/vnd.api+json'
    }
  })
}

export function findItem(module,id) {
  let url = `/${module}/${id}`
  return request({
    url: url,
    method: 'get',
    headers: {
      'Content-Type':'application/vnd.api+json'
    }
  })
}

export function addItem(module,params) {
  return request({
    url: module,
    method: 'post',
    headers: {
      'Content-Type':'application/vnd.api+json'
    },
    data:params
  })
}

export function updateItem(module,data){
  let url = `/${module}/${data.data.id}`
  return request({
    url: url,
    method: 'patch',
    data
  })
}

export function deleteItem(module,id){
  let url = `/${module}/${id}`
  return request({
    url: url,
    method: 'delete',
  })
}