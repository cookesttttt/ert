import axios from '@/libs/api.request'

// 删除岗位
export const deleteJobsData = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/role/' + projectId + '/' + deptId,
    method: 'delete'
  })
}

// // 获取岗位职责
// export const getJobsObligationData = deptType => {
//   return axios.request({
//     url: 'auth/org/role/workcontent/' + deptType,
//     method: 'get'
//   })
// }
// 获取岗位职责
export const getJobsObligationData = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/dept/workcontents/' + projectId + '/' + deptId,
    method: 'get'
  })
}
// 获取岗位职责
export const getTableData = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/roles/dept/' + projectId + '/' + deptId,
    method: 'get'
  })
}

// 岗位分类接口
export const jobsType = () => {
  return axios.request({
    url: 'auth/org/role/types',
    method: 'get'
  })
}

// 添加岗位
export const newJobsData = (projectId, data) => {
  return axios.request({
    url: 'auth/org/role/' + projectId,
    method: 'post',
    data: data
  })
}
// 编辑岗位
export const getEditJobsData = (projectId, id, data) => {
  return axios.request({
    url: 'auth/org/role/' + projectId + '/' + id,
    method: 'put',
    data: data
  })
}

// 获取项目部组织机构树
export const getAlltreeData = projectId => {
  return axios.request({
    url: 'auth/org/depts/level4root/' + projectId,
    method: 'get'
  })
}
