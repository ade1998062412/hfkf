import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/customer/scoreLog/list',
    method: 'post',
    data,
  })
}
