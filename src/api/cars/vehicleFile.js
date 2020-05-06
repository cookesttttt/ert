import axios from '@/libs/api.request'
//添加车辆
export const newVehicleData = (data) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle',
    method: 'post',
    data: data,
  })
}
//获取全部车辆数据
export const getAllVehicleData = (projectId,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/'+projectId+'/' + pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}

//删除车辆
export const deleteVehicleData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/' + id,
    method: 'delete'
  })
}
//编辑车辆信息
export const getEditVehicleData=(data)=>{
  return axios.request({
    url: 'pcm/vehicles/vehicle',
    data:data,
    method: 'put'
  })
}
