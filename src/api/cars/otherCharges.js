import axios from '@/libs/api.request'
//添加其他费用
export const newOtherChargesData = (data) => {
  return axios.request({
    url: 'pcm/vehicles/cost',
    method: 'post',
    data: data,
  })
}
//获取全部其他费用
export const getAllOtherChargesData = (projectId,vehicleNumber,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/cost/'+projectId+'/'+vehicleNumber+'/' + pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}

//删除其他费用
export const deleteOtherChargesData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/cost/' + id,
    method: 'delete'
  })
}
//编辑其他费用
export const getEditOtherChargesData=(data,id)=>{
  return axios.request({
    url: '/pcm/vehicles/cost/'+id,
    data:data,
    method: 'put'
  })
}
