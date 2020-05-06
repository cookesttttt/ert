import axios from '@/libs/api.request'

// 获取数据
export const getDepartmentAllData = id => {
  return axios.request({
    url: 'auth/org/depts/graph/' + id,
    method: 'get'
  })
}

// 获取数据
export const getDepartmentAllUser = id => {
  return axios.request({
    url: 'auth/org/depts/graph4user/' + id,
    method: 'get'
  })
}

// 点击按钮跳转判断是否有权限
export const getJurisdiction = (id, where) => {
  return axios.request({
    url: 'auth/org/havarole/' + id + '/' + where,
    method: 'get'
  })
}
