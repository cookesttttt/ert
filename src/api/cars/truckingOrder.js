import axios from '@/libs/api.request'
//获取单号
export const getOrderNumber = (projectId) => {
  return axios.request({
    url: 'pcm/bill/numbers/number/'+projectId+'/'+1,
    method: 'get',
  })
}
//新建派车单
export const newTruckingOrderData = (data) => {
  return axios.request({
    url: 'pcm/vehicles/distribution',
    method: 'post',
    data: data,
  })
}
//获取全部数据
export const getAllTruckingOrderData = (projectId,vehicleNumber,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/distributions/'+projectId+'/'+vehicleNumber+'/' + pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}
//删除派车单号
export const deleteTruckingOrderData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/distribution/' + id,
    method: 'delete'
  })
}
//编辑派车单号
export const getEditTruckingOrderData=(data)=>{
  return axios.request({
    url: 'pcm/vehicles/distribution',
    data:data,
    method: 'put'
  })
}
//回车登记
export const getReturnRegistrationData=(data)=>{
  return axios.request({
    url: 'pcm/vehicles/distribution/back',
    data:data,
    method: 'post'
  })
}
