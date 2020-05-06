import axios from '@/libs/api.request'

// 最近使用项目
export const recentItem = () => {
  return axios.request({
    url: 'pcm/project/recent/projects',
    method: 'get'
  })
}

// 加入项目
export const joinItem = (authCode) => {
  return axios.request({
    url: 'auth/teamer/team/join/' + authCode,
    method: 'get'
  })
}

// 受邀加入项目
export const inviteItem = (code, invitor, data) => {
  return axios.request({
    url: 'pcm/projects/invite/project/' + code + '/' + invitor,
    data: data,
    method: 'post'
  })
}

// 获取当前用户重要的未读消息
export const getMessages = (projectId) => {
  return axios.request({
    url: 'logs/messages/important/' + projectId,
    method: 'get'
  })
}

// 标记消息已读
export const putMessages = (data) => {
  return axios.request({
    url: 'logs/messages/status',
    data: data,
    method: 'put'
  })
}

// 删除标记消息
export const deleteMessages = (messageId) => {
  return axios.request({
    url: 'logs/messages/' + messageId,
    method: 'delete'
  })
}
