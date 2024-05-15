import request from '@/utils/request'

//推广商列表
export function getList(data) {
  return request({
    url: '/api/customer/promoter/lists',
    method: 'post',
    data,
  })
}
//添加
export function doUpdate(data) {
  return request({
    url: '/api/customer/promoter/add',
    method: 'post',
    data,
  })
}
//修改推广商
export function doEdit(data) {
  return request({
    url: '/api/customer/promoter/edit',
    method: 'post',
    data,
  })
}
//删除
export function doDelete(data) {
  return request({
    url: '/api/customer/promoter/delete',
    method: 'post',
    data,
  })
}
