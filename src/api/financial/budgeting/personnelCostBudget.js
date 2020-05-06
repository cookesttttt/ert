import axios from '@/libs/api.request'
// 获取表格数据接口
export const getTableData = (costBudgetId, year, month) => {
  return axios.request({
    url: 'cost/cost/staff/' + costBudgetId + '/' + year + '/' + month,
    method: 'get'
  })
}

// 人员详情临时保存数据接口
export const staffDataSave = (id, data) => {
  return axios.request({
    url: 'cost/cost/staff/temp/' + id,
    data: data,
    method: 'put'
  })
}

// 人员详情完成数据接口
export const staffDataComplete = (id, data) => {
  return axios.request({
    url: 'cost/cost/staff/complete/' + id,
    data: data,
    method: 'put'
  })
}
