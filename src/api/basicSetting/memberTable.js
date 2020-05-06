import axios from '@/libs/api.request'
// 获取项目类别
export const getTeamers = (id) => {
  return axios.request({
    url: '/auth/teamer/teamers/team/' + id,
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
// 调整项目成员的岗位
export const putTeamer = (projectId, data) => {
  return axios.request({
    url: 'auth/teamer/team/job/' + projectId,
    data: data,
    method: 'put'
  })
}
// 调整项目成员的岗位2
export const putTeamer2 = (projectId, level, data) => {
  return axios.request({
    url: 'auth/teamer/team/job/' + level + '/' + projectId,
    data: data,
    method: 'put'
  })
}
// 移除项目成员的岗位
export const deleteTeamer = (projectId, userId) => {
  return axios.request({
    url: 'auth/teamer/team/job/' + projectId + '/' + userId,
    method: 'delete'
  })
}

// newUserTable -- 获取项目成员
export const getNewAllRole = id => {
  return axios.request({
    url: 'auth/org/depts/listview/' + id,
    method: 'get'
  })
}

// 带层次组织架构工作内容的列表视图接口
export const getDeptJobAllRole = id => {
  return axios.request({
    url: 'auth/org/roles/listview/' + id,
    method: 'get'
  })
}
