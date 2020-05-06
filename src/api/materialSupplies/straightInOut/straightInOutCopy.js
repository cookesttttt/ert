import axios from '@/libs/api.request'
//获取编辑数据
export const getEditData= (id) => {
  return axios.request({
    url: '/pcm/rep/direct/order/'+id,
    method: 'get',
  })
}
//新增出库用品
/*export const newSuppliesData= (projectId,id) => {
  return axios.request({
    url:'/pcm/supplies/tree/'+projectId+'/'+"3"+'?orderId='+id,
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
//获取单据编号
export const getNumber= (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+2,
    method: 'get',
  })
}
//获取表格数据
export const getEditTableData= (id) => {
  return axios.request({
    url:'/pcm/rep/direct/order/supplies/'+id,
    method: 'get',
  })
}
