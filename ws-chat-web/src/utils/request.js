import Vue from 'vue'
import axios from 'axios'
import {
  baseURL,
  contentType,
  debounce,
  invalidCode,
  noPermissionCode,
  requestTimeout,
  successCode,
  tokenName,
  loginInterception,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { isArray } from '@/utils/validate'

let loadingInstance

/**
 * @author https://vue-admin-beautiful.com （不想保留author可删除）
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case invalidCode:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      store.dispatch('user/resetAccessToken').catch(() => {})
      if (loginInterception) {
        location.reload()
      }
      break
    case noPermissionCode:
      router.push({ path: '/401' }).catch(() => {})
      break
    default:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      break
  }
}

const instance = axios.create({
  baseURL: 'https://wschat.micome.vip',
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})

instance.interceptors.request.use(
  (config) => {
    // let token = localStorage.getItem('mobileToken')
    //这里会过滤所有为空、0、false的key，如果不需要请自行注释
    if (config.data)
      config.data = Vue.prototype.$baseLodash.pickBy(
        config.data,
        Vue.prototype.$baseLodash.identity
      )
    if (config.data && config.headers['Content-Type'] === 'application/json')
      config.data = qs.stringify(config.data)
    if (debounce.some((item) => config.url.includes(item)))
      loadingInstance = Vue.prototype.$baseLoading()

    if (
      config.url !== '/api/customer/auth/login' &&
      config.url.indexOf('/api/customer/promoter/index') == -1
    ) {
      // console.log('校验')
      config.headers['Authorization'] =
        'Bearer ' + localStorage.getItem('mobileToken')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close()
    const { data, config } = response
    // console.log(response)
    const { errno, errmsg } = data
    if (errno == 401) {
      localStorage.removeItem('mobileToken')
    }
    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]]
    // 是否操作正常

    return data
  },
  (error) => {
    if (loadingInstance) loadingInstance.close()
    const { response, message } = error

    if (error.response && error.response.data) {
      const { status, data } = response
      handleCode(status, data.msg || message)
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        message = '后端接口' + code + '异常'
      }
      Vue.prototype.$baseMessage(message || `后端接口未知异常`, 'error')
      return Promise.reject(error)
    }
  }
)

export default instance
