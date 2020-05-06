import axios from '@/libs/api.request'
//添加违章信息
export const newVehicleViolationData = (data) => {
  return axios.request({
    url: 'pcm/vehicles/penalty',
    method: 'post',
    data: data,
  })
}
//获取全部违章信息
export const getAllVehicleViolationData = (projectId,vehicleNumber,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/penalty/'+projectId+'/'+vehicleNumber+'/'+ pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}

//删除违章信息
export const deleteVehicleViolationData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/penalty/' + id,
    method: 'delete'
  })
}
//编辑违章信息
export const getEditVehicleViolationData=(data,id)=>{
  return axios.request({
    url: 'pcm/vehicles/penalty/'+id,
    data:data,
    method: 'put'
  })
}
