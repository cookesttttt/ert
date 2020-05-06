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
//删除季度计划设备
export const  deleteData = (data) => {
  return axios.request({
    url: '/pcm/equipments/quarter_plans',
    data:data,
    method: 'delete',
  })
}
//保存季度计划数据
export const SaveSeasonalplan = (data,projectId,year,quarter) => {
  return axios.request({
    url: '/pcm/equipments/quarter_plans/'+projectId+'/'+year+'/'+quarter,
    data:data,
    method: 'post',
  })
}
//修改季度计划数据
export const   editSeasonalplan= (data,projectId,year,quarter) => {
  return axios.request({
    url: '/pcm/equipments/quarter_plans/'+projectId+'/'+year+'/'+quarter,
    data:data,
    method: 'post',
  })
}
//获取全部数据
export const getAllData=(projectId,year,quarter)=>{
  return axios.request({
    url: '/pcm/equipments/quarter_plans/'+projectId+'/'+year+'/'+quarter,
    method: 'get',
  })
}
//清空计划列表
export const clearanceData=(projectId,year,quarter)=>{
  return axios.request({
    url: '/pcm/equipments/clear/quarter_plans/'+projectId+'/'+year+'/'+quarter,
    method: 'delete',
  })
}
//重新自动生成
export const anewData=(projectId,year,quarter)=>{
  return axios.request({
    url: '/pcm/equipments/init/quarter_plans/'+projectId+'/'+year+'/'+quarter,
    method: 'get',
  })
}
