import axios from '@/libs/api.request'
//获取单据编号
export const getNumber= (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+2,
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
//新建盘点
export const newStockingData= (data) => {
  return axios.request({
    url: '/pcm/rep/check/order',
    data:data,
    method: 'post',
  })
}
