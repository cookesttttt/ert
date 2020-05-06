import axios from '@/libs/api.request'

// 获取省份
export const getprovinces = () => {
  return axios.request({
    url: 'tools/district/provinces',
    method: 'get'
  })
}

// 获取城市
export const getcitys = id => {
  return axios.request({
    url: 'tools/district/citys/' + id,
    method: 'get'
  })
}

// 获取区县
export const getareas = id => {
  return axios.request({
    url: 'tools/district/areas/' + id,
    method: 'get'
  })
}

// 添加项目信息
export const newProject = data => {
  return axios.request({
    url: 'pcm/projects/project',
    method: 'post',
    data: data
  })
}

// 获取工作职责
export const getJob = data => {
  return axios.request({
    url: 'pcm/projects/project/depts',
    method: 'post',
    data: data
  })
}

// 进入项目调用接口
export const gotoitem = id => {
  return axios.request({
    url: 'pcm/projects/select/project/' + id,
    method: 'get'
  })
}

// 查找相似项目
export const getSimilar = (data) => {
  return axios.request({
    url: 'pcm/projects/project/similar/projects',
    data: data,
    method: 'post'
  })
}

// 获取岗位列表,如果是创建独立项目，projectId传-1
export const getItemJob = projectId => {
  return axios.request({
    url: 'pcm/projects/project/info/jobs/' + projectId,
    method: 'get'
  })
}

// 加入项目
export const joinProject = (projectId, data) => {
  return axios.request({
    url: 'pcm/projects/joinproject/' + projectId,
    method: 'post',
    data: data
  })
}

// 项目信息
export const getItemInfo = (projectId) => {
  return axios.request({
    url: 'pcm/projects/project/similar/projects/' + projectId,
    method: 'get'
  })
}
