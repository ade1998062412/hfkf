import request from '@/utils/request'

//会话列表
export function getSessionList(data) {
  return request({
    url: '/api/customer/session/getSessionList',
    method: 'post',
    data,
  })
}
//根据会话获取聊天内容
export function getMessageList(data) {
  return request({
    url: '/api/customer/session/getMessageList',
    method: 'post',
    data,
  })
}
