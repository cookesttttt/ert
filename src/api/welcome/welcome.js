import axios from '@/libs/api.request'
// 获取当前的项目状态
export const getItemState = projectId => {
  return axios.request({
    url: '/pcm/project/userproject/status/' + projectId,
    method: 'get'
  })
}

// 修改当前的项目状态
export const putItemState = (projectId, data) => {
  return axios.request({
    url: '/pcm/project/userproject/status/' + projectId,
    data: data,
    method: 'put'
  })
}
