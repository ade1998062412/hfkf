import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/customer/phoneNumber/list',
    method: 'post',
    data,
  })
}
