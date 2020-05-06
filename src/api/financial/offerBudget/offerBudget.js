import axios from '@/libs/api.request'
// 获取汇总表数据接口
export const getCollectData = projectId => {
  return axios.request({
    url: 'cost/quote/summary/' + projectId,
    method: 'get'
  })
}

// 人员工资详情表数据接口
export const getSalaryData = id => {
  return axios.request({
    url: 'cost/quote/detail/staff/' + id,
    method: 'get'
  })
}

// 人员工资详情表临时保存数据接口
export const salaryDataSave = (id, data) => {
  return axios.request({
    url: 'cost/quote/detail/staff/temp/' + id,
    data: data,
    method: 'put'
  })
}

// 人员工资详情表完成制单保存数据接口
export const finishSalaryData = (id, data) => {
  return axios.request({
    url: 'cost/quote/detail/staff/complete/' + id,
    data: data,
    method: 'put'
  })
}

// 办公预算表详情数据接口
export const getOfficeData = id => {
  return axios.request({
    url: 'cost/quote/detail/office/' + id,
    method: 'get'
  })
}

// 办公预算详情临时保存数据接口
export const officeDataSave = (id, data) => {
  return axios.request({
    url: 'cost/quote/detail/office/temp/' + id,
    data: data,
    method: 'put'
  })
}

// 办公预算详情完成制单保存数据接口
export const finishOfficeData = (id, data) => {
  return axios.request({
    url: 'cost/quote/detail/office/complete/' + id,
    data: data,
    method: 'put'
  })
}
