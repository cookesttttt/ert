import axios from '@/libs/api.request'
// 获取职位
export const getUserData = projectId => {
  return axios.request({
    url: 'auth/org/role/post/' + projectId,
    method: 'get'
  })
}
// 保存名字部门工作职责
export const getInfos = (projectId, data) => {
  return axios.request({
    url: 'auth/org/role/post/' + projectId,
    method: 'post',
    data: data
  })
}
// 获取所属部门
export const getDepartmentData = id => {
  return axios.request({
    url: 'auth/org/depts/post/' + id,
    method: 'get'
  })
}
// 获取所有角色
export const getAllRole = id => {
  return axios.request({
    url: 'auth/org/roles/type/' + id,
    method: 'get'
  })
}
// 获取所有资质信息
export const getInformationData = (id) => {
  return axios.request({
    url: '/uac/user/certificate/' + id,
    method: 'get'
  })
}
// 删除
export const deleteinformationData = id => {
  return axios.request({
    url: '/uac/user/certificate/' + id,
    method: 'delete'
  })
}
// 编辑
export const editInformationData = data => {
  return axios.request({
    url: '/uac/user/certificate/edit',
    data: data,
    method: 'post'
  })
}
