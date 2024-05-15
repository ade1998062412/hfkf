import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  return request({
    url: '/api/customer/auth/login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  let mobileToken = localStorage.getItem('mobileToken')
  return request({
    url: '/api/customer/auth/info',
    method: 'post',
    data: {
      token: mobileToken,
    },
  })
}

export function logout() {
  return request({
    url: '/api/customer/auth/logout',
    method: 'post',
  })
}
