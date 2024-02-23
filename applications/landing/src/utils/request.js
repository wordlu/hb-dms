  import axios from 'axios'
  import {
    ElMessage
  } from 'element-plus'
  import store from '@/store'
  import Cookies from 'js-cookie'
  let resetTokenExpire = 0
 
  const service = axios.create({
    baseURL: `http://dms${window.server.domain}/api/shell/models`,
    withCredentials: true, // 跨域请求时携带cookie
    timeout: 6000000,
    headers: {
      'Content-Type': 'application/vnd.api+json'
    },
  })
  service.interceptors.request.use(config => {
      let token = Cookies.get('Token');
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    error => {
      console.log(error) // for debug
      return Promise.reject(error)
    })
  // response interceptor
  service.interceptors.response.use(
    response => {
      const res = response.data
      if (res.hasOwnProperty('status_code') == true) {
        if (res.status_code !== 200 && res.status_code !== 201) {
          if (res.code === 'Ok' || res.status == 1) {
            return res
          }
          if (res.status_code === 401) {
            if (res.error_message == 'Token expired') {
              Cookies.set('Token', Cookies.get('refresh_token'))
            } else if (res.error_message == '未检索到数据') {

            }
          }
          return Promise.reject(new Error(res.error_message || 'Error'))
        } else {
          return res
        }
      } else {
        return res
      }
      // if the custom code is not 1000, it is judged as an error.
    },
    error => {
      const res = (error.response || {}).data || {};
      const message = res.code ? res.message : error.message;
      // const {response:{status}} = error
     
      if (error == `Error: Request failed with status code 401`) {
        if (Cookies.get('refresh_token')) {
          store.dispatch('user/resetToken', Cookies.get('refresh_token')).then(() => {
            location.reload()
          })
        } else {
          ElMessage.alert('登录过期请重新登录', '登录过期', {
            confirmButtonText: '确定',
            callback: action => {
              store.dispatch('user/logout').then(() => {
                location.reload()
                resetTokenExpire = 0
              })
            }
          });
        }
      } if (typeof(res) === 'string') {
        ElMessage({
          message: res,
          type: 'error',
        })
      } else {
        ElMessage({
          message: message,
          type: 'error',
        })
      }
      return Promise.reject(res, message)
    }
  )

  const handleResponseError = ((res, message) => {
    console.log(message)

    // return Promise.reject(res);

  });

  export default service