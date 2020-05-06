import axios from '@/libs/api.request'
// 删除部门
export const deleteDepartmentData = (id, deptId) => {
  return axios.request({
    url: 'auth/org/dept/' + id + '/' + deptId,
    method: 'delete'
  })
}
// 新增部门
export const addDepartmentData = (id, deptId, data) => {
  return axios.request({
    url: 'auth/org/dept/' + id + '/' + deptId,
    method: 'post',
    data: data
  })
}
// 同级部门
export const addBrotherData = (id, deptId, data) => {
  return axios.request({
    url: 'auth/org/dept/brother/' + id + '/' + deptId,
    method: 'post',
    data: data
  })
}
// 编辑部门
export const editorialDepartmentData = (id, deptId, data) => {
  return axios.request({
    url: 'auth/org/dept/' + id + '/' + deptId,
    method: 'put',
    data: data
  })
}
// 获取所有部门数据
export const getAllDepartmentsData = id => {
  return axios.request({
    url: 'auth/org/depts/post/' + id,
    method: 'get'
  })
}
// 获取项目部组织机构树
export const getAlltreeData = projectId => {
  return axios.request({
    url: 'auth/org/depts/level4root/' + projectId,
    method: 'get'
  })
}
// 获取全部列表数据
export const getAllTableData = projectId => {
  return axios.request({
    url: '/uac/departments/' + projectId,
    method: 'get'
  })
}

// 获取自己所在部门
export const getOwnDept = projectId => {
  return axios.request({
    url: 'auth/org/depts/self/dept/' + projectId,
    method: 'get'
  })
}
