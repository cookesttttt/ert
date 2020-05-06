import axios from '@/libs/api.request'
//添加维修保养信息
export const newMaintenanceData = (data) => {
  return axios.request({
    url: 'pcm/vehicles/maintenance',
    method: 'post',
    data: data,
  })
}
//获取全部维修保养信息
export const getAllMaintenanceData = (projectId,vehicleNumber,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/maintenance/'+projectId+'/'+vehicleNumber+'/' + pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}

//删除维修保养信息
export const deleteMaintenanceData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/maintenance/' + id,
    method: 'delete'
  })
}
//编辑维修保养信息
export const getEditMaintenanceData=(data,id)=>{
  return axios.request({
    url: 'pcm/vehicles/maintenance/'+id,
    data:data,
    method: 'put'
  })
}
