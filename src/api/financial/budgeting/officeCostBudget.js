import axios from '@/libs/api.request'
// 获取表格数据接口
export const getTableData = (costBudgetId, year, month) => {
  return axios.request({
    url: 'cost/cost/office/' + costBudgetId + '/' + year + '/' + month,
    method: 'get'
  })
}

// 办公预算详情临时保存数据接口
export const officeDataSave = (id, data) => {
  return axios.request({
    url: 'cost/cost/office/temp/' + id,
    data: data,
    method: 'put'
  })
}

// 办公预算详情完成制单数据接口
export const officeDataComplete = (id, data) => {
  return axios.request({
    url: 'cost/cost/office/complete/' + id,
    data: data,
    method: 'put'
  })
}
