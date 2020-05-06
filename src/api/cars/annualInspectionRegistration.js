import axios from '@/libs/api.request'
//添加年检登记 AnnualInspectionRegistration
export const newAnnualInspectionRegistrationData = (data) => {
  return axios.request({
    url: 'pcm/vehicles/inspection',
    method: 'post',
    data: data,
  })
}
//获取全部年检登记
export const getAllAnnualInspectionRegistrationData = (projectId,vehicleNumber,pageNum, pageSize, keyWord) => {
  return axios.request({
    url: 'pcm/vehicles/vehicle/inspection/'+projectId+'/'+vehicleNumber+"/" + pageNum + '/' + pageSize + '?keyWord=' + keyWord,
    method: 'get'
  })
}

//删除年检登记
export const deleteAnnualInspectionRegistrationData = (id) => {
  return axios.request({
    url: 'pcm/vehicles/inspection/' + id,
    method: 'delete'
  })
}
//编辑年检登记
export const getEditAnnualInspectionRegistrationData=(data,id)=>{
  return axios.request({
    url: 'pcm/vehicles/inspection/'+id,
    data:data,
    method: 'put'
  })
}
