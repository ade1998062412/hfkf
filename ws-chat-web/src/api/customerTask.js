import request from '@/utils/request'

//群发任务列表
export function getList(data) {
  return request({
    url: `/api/customer/task/list?page=${data.page}&limit=${data.limit}&sort=${data.sort}&order=${data.order}&title=${data.title}`,
    method: 'get',
  })
}
//群发任务详情
export function getDetail(data) {
  return request({
    url: `/api/customer/task/detail?id=${data.id}&page=${data.page}&limit=${data.limit}&sort=${data.sort}&order=${data.order}`,
    method: 'get',
  })
}
//创建发送任务
export function taskAdd(data) {
  return request({
    url: `/api/customer/task/add`,
    method: 'post',
    data,
  })
}
//excel文件上传
export function excelAdd(data) {
  return request({
    url: `/api/customer/task/uploadExcel`,
    method: 'post',
    data,
  })
}
//获取发送模板
export function getTemplate(data) {
  return request({
    url: `/api/customer/task/template`,
    method: 'post',
    data,
  })
}
// web聊天应用列表
export function getWebAppList(data) {
  return request({
    url: `/api/customer/app/list`,
    method: 'post',
    data,
  })
}
// 修改应用客服在线时间
export function updateOnlineTime(data) {
  return request({
    url: `/api/customer/app/updateOnlineTime`,
    method: 'post',
    data,
  })
}
