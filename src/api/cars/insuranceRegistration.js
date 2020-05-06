import axios from '@/libs/api.request'
//添加保险登记
export const newInsuranceRegistrationData = (data) => {
  return axios.request({
    url: 'pcm/vehicles/insurance',
    method: 'post',
    data: data,
  })
}
//获取全部保险登记
export const getAllInsuranceRegistrationData = (projectId,vehicleNumber,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/insurance/'+projectId+'/'+vehicleNumber+'/' + pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}
//删除保险登记
export const deleteInsuranceRegistrationData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/insurance/' + id,
    method: 'delete'
  })
}
//编辑保险登记
export const getEditInsuranceRegistrationData=(data,id)=>{
  return axios.request({
    url: 'pcm/vehicles/insurance/' + id,
    data:data,
    method: 'put'
  })
}
