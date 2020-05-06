import axios from "@/libs/api.request";

//获取消息
export const getMessages = (pageNum, pageSize,projectId, keyWord) => {
  return axios.request({
    url: 'logs/messages/all/'+pageNum+'/'+pageSize+'/'+projectId+'?keyWord='+keyWord,
    method: 'get'
  })
}
//删除
export const deleteMessages= (id) => {
  return axios.request({
    url: 'logs/messages/' + id,
    method: 'delete'
  })
}
//消息以读
export const putMessages = (data) => {
  return axios.request({
    url: 'logs/messages/status',
    data: data,
    method: 'put'
  })
}
//未读状态
export const unreadStatus= (projectId) => {
  return axios.request({
    url: 'logs/messages/status/'+projectId,
    method: 'get'
  })
}
