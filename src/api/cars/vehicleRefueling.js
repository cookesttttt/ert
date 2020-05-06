import axios from '@/libs/api.request'
//添加加油信息
export const newVehicleRefuelingData = (data) => {
  console.log(data)
  return axios.request({
    url: 'pcm/vehicles/gas',
    method: 'post',
    data: data,
  })
}
//获取全部加油信息
export const getAllVehicleRefuelingData = (projectId,vehicleNumber,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/gas/'+projectId+'/'+vehicleNumber+'/' + pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}

//删除加油信息
export const deleteVehicleRefuelingData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/gas/' + id,
    method: 'delete'
  })
}
//编辑加油信息
export const getEditVehicleRefuelingData=(data,id)=>{
  return axios.request({
    url: 'pcm/vehicles/gas/'+id,
    data:data,
    method: 'put'
  })
}
