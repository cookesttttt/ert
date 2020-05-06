import axios from '@/libs/api.request'
//获取设备
export const getDeviceData = (projectId) => {
  return axios.request({
    url: '/pcm/equipment/categories/'+projectId,
    method: 'get',
  })
}
//获取工程部位
export const getEngineeringSite = (projectId) => {
  return axios.request({
    url: '/pcm/fbfx/unitproject/tree/'+projectId,
    method: 'get',
  })
}
//保存数据
export const saveDeviceData = (projectId,data) => {
  return axios.request({
    url: '/pcm/equipments/entirety_plans/'+projectId,
    data:data,
    method: 'post',
  })
}
//获取全部数据
export const getAllData=(projectId)=>{
  return axios.request({
    url: '/pcm/equipments/entirety_plans/'+projectId,
    method: 'get',
  })
}
//删除数据
export const deleteData=(data)=>{
  return axios.request({
    url: '/pcm/equipments/entirety_plans',
    data:data,
    method: 'delete',
  })
}
//删除数据
export const clearAll=(projectId)=>{
  return axios.request({
    url: '/pcm/equipments/clear/entirety_plans/'+projectId,
    method: 'delete',
  })
}
//修改数据
export const   editData= (projectId,data) => {
  return axios.request({
    url: '/pcm/equipments/entirety_plans/'+projectId,
    data:data,
    method: 'post',
  })
}
