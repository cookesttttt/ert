import axios from '@/libs/api.request'

// 所有项目
export const AllItem = type => {
  return axios.request({
    url: 'pcm/projects/self/projects/' + type,
    method: 'get'
  })
}

// 删除项目
export const deleteItem = id => {
  return axios.request({
    url: 'pcm/projects/project/' + id,
    method: 'delete'
  })
}

// 进入项目调用接口
export const gotoitem = id => {
  return axios.request({
    url: 'pcm/projects/select/project/' + id,
    method: 'get'
  })
}

// 最近使用项目
export const recentItem = () => {
  return axios.request({
    url: 'pcm/project/recent/projects',
    method: 'get'
  })
}
