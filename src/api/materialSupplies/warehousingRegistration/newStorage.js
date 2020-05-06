import axios from '@/libs/api.request'
//获取单据编号
export const getNumber= (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+2,
    method: 'get',
  })
}
//新建入库
export const newStorageData= (data) => {
  return axios.request({
    url: '/pcm/rep/in/order',
    data:data,
    method: 'post',
  })
}
//获取入库库房
export const getStoreroom= (projectId) => {
  return axios.request({
    url: '/pcm/repertories/selection/'+projectId,
    method: 'get',
  })
}
/*//新增入库用品
export const newSuppliesData= (projectId) => {
  return axios.request({
    url:'/pcm/supplies/tree/'+projectId+'/'+'1'+'?orderId='+'',
    method: 'get',
  })
}*/
export const newSuppliesData= (projectId) => {
  return axios.request({
    url:'/pcm/supplies/categories/supplies/'+projectId,
    method: 'get',
  })
}
