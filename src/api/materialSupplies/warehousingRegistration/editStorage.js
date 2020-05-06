import axios from '@/libs/api.request'
//获取编辑数据
export const getEditStorageData= (id) => {
  return axios.request({
    url: '/pcm/rep/in/order/'+id,
    method: 'get',
  })
}
//获取入库库房
export const getStoreroom= (projectId) => {
  return axios.request({
    url: '/pcm/repertories/selection/'+projectId,
    method: 'get',
  })
}
//新增入库用品
export const newSuppliesData= (projectId) => {
  return axios.request({
    url:'/pcm/supplies/categories/supplies/'+projectId,
    method: 'get',
  })
}
//提交修改数据
export const editStorageData= (data,id) => {
  return axios.request({
    url:'/pcm/rep/in/order/'+id,
    data:data,
    method: 'put',
  })
}
