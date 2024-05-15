import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/customer/customerService/lists ',
    method: 'post',
    data,
  })
}
//添加
export function doUpdate(data) {
  return request({
    url: '/api/customer/customerService/add',
    method: 'post',
    data,
  })
}
//修改
export function doEdit(data) {
  return request({
    url: '/api/customer/customerService/edit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/api/customer/customerService/delete',
    method: 'post',
    data,
  })
}
