import axios from '@/libs/api.request'
//获取单据编号
export const getNumber= (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+2,
    method: 'get',
  })
}

//新增用品
/*export const newSuppliesData= (projectId) => {
  return axios.request({
    url:'/pcm/supplies/tree/'+projectId+'/'+"3"+'?orderId='+'',
    method: 'get',
  })
}*/
export const newSuppliesData= (projectId) => {
  return axios.request({
    url:'/pcm/supplies/categories/supplies/'+projectId,
    method: 'get',
  })
}
//新建直入直出
export const newStockingData= (data) => {
  return axios.request({
    url: '/pcm/rep/direct/order ',
    data:data,
    method: 'post',
  })
}
