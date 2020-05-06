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
//删除年度计划设备
export const  deleteData = (data) => {
  return axios.request({
    url: '/pcm/equipments/year_plans',
    data:data,
    method: 'delete',
  })
}
//保存年度计划数据
export const SaveAnnualPlan = (data,projectId,year) => {
  return axios.request({
    url: '/pcm/equipments/year_plans/'+projectId+'/'+year,
    data:data,
    method: 'post',
  })
}
//修改年度计划数据
export const   editAnnualPlan= (data,projectId,year) => {
  return axios.request({
    url: '/pcm/equipments/year_plans/'+projectId+'/'+year,
    data:data,
    method: 'post',
  })
}

//获取全部数据
export const getAllData=(projectId,year)=>{
  return axios.request({
    url: '/pcm/equipments/year_plans/'+projectId+'/'+year,
    method: 'get',
  })
}
//清空计划列表
export const clearanceData=(projectId,year)=>{
  return axios.request({
    url: '/pcm/equipments/clear/year_plans/'+projectId+'/'+year,
    method: 'delete',
  })
}
//重新自动生成
export const anewData=(projectId,year)=>{
  return axios.request({
    url: '/pcm/equipments/init/year_plans/'+projectId+'/'+year,
    method: 'get',
  })
}
