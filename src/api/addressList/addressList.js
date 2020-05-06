import axios from '@/libs/api.request'

// 通讯录最近联接
export const latest = id => {
  return axios.request({
    url: 'auth/teamer/teamers/latest/' + id,
    method: 'get'
  })
}

// 项目部所有成员通讯录
export const allteamers = (currentPage, pageSize, id) => {
  return axios.request({
    url:
      'auth/teamer/team/teamers/' +
      currentPage +
      '/' +
      pageSize +
      '/' +
      id +
      '?keyword=',
    method: 'get'
  })
}

// 树状部门查找 √
export const getTree = id => {
  return axios.request({
    url: 'auth/org/depts/level/' + id,
    method: 'get'
  })
}

// 添加更多同事中，获取部门 √
export const getdepartment = id => {
  return axios.request({
    url: 'auth/org/depts/' + id,
    method: 'get'
  })
}

// 获取岗位 √
export const getRoles = (projectId, departmentId) => {
  return axios.request({
    url: 'auth/org/roles/dept/' + projectId + '/' + departmentId,
    method: 'get'
  })
}

// 添加更多同事： 保存按钮
export const addColleague = data => {
  return axios.request({
    url: 'auth/teamer/team/member',
    data: data,
    method: 'post'
  })
}

// 获取部门下的同事
export const sectionColleague = (currentPage, pageSize, id, dept) => {
  return axios.request({
    url: 'auth/teamer/dept/teamers/' + currentPage + '/' + pageSize + '/' + id,
    params: { dept: dept },
    method: 'get'
  })
}

// 搜索通讯录同事
export const searchColleague = (currentPage, pageSize, id, search) => {
  return axios.request({
    url: 'auth/teamer/team/teamers/' + currentPage + '/' + pageSize + '/' + id,
    params: { keyword: search },
    method: 'get'
  })
}

// 手动邀请同事
export const manualInvited = (projectId, teamerId) => {
  return axios.request({
    url: 'auth/teamer/invitation/code/' + projectId + '/' + teamerId,
    method: 'get'
  })
}

// 获取当前自己在那个部门
export const getOwnSection = projectId => {
  return axios.request({
    url: 'auth/org/depts/self/dept/' + projectId,
    method: 'get'
  })
}
