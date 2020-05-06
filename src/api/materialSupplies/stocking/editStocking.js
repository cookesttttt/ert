import axios from '@/libs/api.request'
//获取编辑数据
export const getEditData= (id) => {
  return axios.request({
    url: '/pcm/rep/check/order/'+id,
    method: 'get',
  })
}
//获取库房
export const getStoreroom= (projectId) => {
  return axios.request({
    url: '/pcm/repertories/selection/'+projectId,
    method: 'get',
  })
}
//获取用品
export const newSuppliesData= (projectId) => {
  return axios.request({
    url:'/pcm/supplies/categories/supplies/'+projectId,
    method: 'get',
  })
}
//修改盘点
export const editStockingData= (data,id) => {
  return axios.request({
    url: '/pcm/rep/check/order/'+id,
    data:data,
    method: 'put',
  })
}
//获取表格数据
export const getEditTableData= (id) => {
  return axios.request({
    url:'/pcm/rep/check/order/supplies/'+id,
    method: 'get',
  })
}
