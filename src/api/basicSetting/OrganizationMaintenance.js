import axios from '@/libs/api.request'
// 获取 ableData 数据
export const getAllData = (projectId, departmentId) => {
  return axios.request({
    url: 'auth/org/allInfo/' + projectId + '/' + departmentId,
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

// 获取所有岗位
export const getAllJob = projectId => {
  return axios.request({
    url: 'auth/org/roles/basic/' + projectId,
    method: 'get'
  })
}

// 移动岗位
export const moveJob = (projectId, roleId, departmentId) => {
  return axios.request({
    url: 'auth/org/job/' + projectId + '/' + roleId + '/to/' + departmentId,
    method: 'put'
  })
}

// 加入已有岗位
export const jobMoveDept = (projectId, data) => {
  return axios.request({
    url: 'auth/org/job/moveto/' + projectId,
    data: data,
    method: 'put'
  })
}

// 加入已有岗位2
export const jobMoveDept2 = (projectId, level, data) => {
  return axios.request({
    url: 'auth/org/job/moveto/' + level + '/' + projectId,
    data: data,
    method: 'put'
  })
}

// 获取可以加入该部门的部门
export const getMoveDept = (projectId, departmentId) => {
  return axios.request({
    url: 'auth/org/departmentInfo/child/' + projectId + '/' + departmentId,
    method: 'get'
  })
}

// 加入已有部门
export const deptMoveDept = (projectId, data) => {
  return axios.request({
    url: 'auth/org/department/moveto/' + projectId,
    data: data,
    method: 'put'
  })
}

// 获取项目下所有部门
export const getAllDept = (projectId) => {
  return axios.request({
    url: 'auth/org/depts/post/' + projectId,
    method: 'get'
  })
}

// 部门移动 获取可移动到的部门
export const getCanMoveDept = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/department/moveto/' + projectId + '/' + deptId,
    method: 'get'
  })
}

// 部门移动接口 /org/department/{projectId}/{curId}/to/{deptId}
export const MoveDept = (projectId, curId, deptId) => {
  return axios.request({
    url: 'auth/org/department/' + projectId + '/' + curId + '/to/' + deptId,
    method: 'put'
  })
}

// 加入黑名单 /blacklist/blacklist/{projectId}/{userId}
export const joinBlacklist = (projectId, teamerId, data) => {
  return axios.request({
    url: 'auth/blacklist/blacklist/' + projectId + '/' + teamerId,
    data: data,
    method: 'post'
  })
}

// 获取部门下的工作范围
export const getDeptWorkingRange = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/dept/workcontents4dept/' + projectId + '/' + deptId,
    method: 'get'
  })
}

// 获取部门下的所有工作范围
export const getAllDeptWorkingRange = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/dept/allworkcontents4dept/' + projectId + '/' + deptId,
    method: 'get'
  })
}

// 修改部门下的工作范围
export const putAllDeptWorkingRange = (projectId, deptId, data) => {
  return axios.request({
    url: 'auth/org/dept/updateDeptWork/' + projectId + '/' + deptId,
    method: 'post',
    data: data
  })
}

// 判断是否拥有当前部门的操作权限
export const ifHaveAddBrother = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/depts4brother/haveRole/{projectId}/{deptId}' + projectId + '/' + deptId,
    method: 'get'
  })
}

// 获取兄弟下的工作范围
export const getbrotherDeptWorkingRange = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/dept/brother/workcontents4dept/' + projectId + '/' + deptId,
    method: 'get'
  })
}

// 获取能否增加兄弟节点
export const getisBrotherAdd = (projectId, deptId) => {
  return axios.request({
    url: 'auth/org/depts4brother/haveRole/' + projectId + '/' + deptId,
    method: 'get'
  })
}

// 获取管理内容的部门和岗位
export const getWork = (projectId, workId) => {
  return axios.request({
    url: 'auth/org/workcontent/info/' + projectId + '/' + workId,
    method: 'get'
  })
}

// 移动管理权限
export const moveWorkContent = (projectId, deptId, workId, newdeptId) => {
  return axios.request({
    url: 'auth/org/dept/info/' + projectId + '/' + deptId + '/' + workId + '/' + newdeptId,
    method: 'post'
  })
}

// 转移部门权限
export const transferDept = (projectId, todeptId, data) => {
  return axios.request({
    url: '/auth/org/dept/transfer/' + projectId + '/' + todeptId,
    method: 'post',
    data: data
  })
}

// 转移部门权限
export const getTransferPower = (projectId) => {
  return axios.request({
    url: '/auth/org/dept/transfer/' + projectId,
    method: 'get'
  })
}

// 转移岗位权限
export const getJobTransferPower = (projectId) => {
  return axios.request({
    url: '/auth/org/roles/transfer/permissions/' + projectId,
    method: 'get'
  })
}

// 转移岗位权限
export const transferJob = (projectId, roleId, data) => {
  return axios.request({
    url: '/auth/org/roles/transfer/permissions/' + projectId + '/' + roleId,
    method: 'post',
    data: data
  })
}

// 移出部门权限
export const removeDeptPower = (projectId, deptId) => {
  return axios.request({
    url: '/auth/org/dept/transfer/' + projectId + '/' + deptId,
    method: 'delete'
  })
}

// 移出岗位权限
export const removeJobPower = (projectId, roleId) => {
  return axios.request({
    url: '/auth/org/roles/transfer/permissions/' + projectId + '/' + roleId,
    method: 'delete'
  })
}
