import request from '@/utils/request'

export function customerReport(data) {
  return request({
    url: '/api/customer/auth/report',
    method: 'post',
    data,
  })
}
