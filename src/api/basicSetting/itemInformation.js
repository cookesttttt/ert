import axios from '@/libs/api.request'
// 获取项目类别
export const getCategoriesData = () => {
  return axios.request({
    url: '/pcm/projects/categories',
    method: 'get'
  })
}
// 项目信息数据
export const getInformationData = id => {
  return axios.request({
    url: '/pcm/projects/project/' + id,
    method: 'get'
  })
}
// 提交项目信息
export const submitInformation = data => {
  return axios.request({
    url: '/pcm/projects/project',
    method: 'put',
    data: data
  })
}

// 保存合同信息
export const submitContractInformation = (id, data) => {
  return axios.request({
    url: '/pcm/project/contract/' + id,
    method: 'post',
    data: data
  })
}

// 获取合同信息
export const getContractInformation = id => {
  return axios.request({
    url: '/pcm/project/contract/' + id,
    method: 'get'
  })
}

// 获取参见单位信息
export const getContractorsInformation = id => {
  return axios.request({
    url: '/pcm/project/projectorg/' + id,
    method: 'get'
  })
}

// 保存参建单位信息
export const saveContractorsInformation = (id, data) => {
  return axios.request({
    url: '/pcm/project/projectorg/' + id,
    data: data,
    method: 'post'
  })
}