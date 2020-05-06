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
//删除每月计划设备
export const  deleteData = (data) => {
  return axios.request({
    url: '/pcm/equipments/month_plans',
    data:data,
    method: 'delete',
  })
}
//保存每月计划数据
export const SaveMonthlyPlan = (data,projectId,year,month) => {
  return axios.request({
    url: '/pcm/equipments/month_plans/'+projectId+'/'+year+'/'+month,
    data:data,
    method: 'post',
  })
}
//修改每月计划数据
export const   editMonthlyPlan= (data,projectId,year,month) => {
  return axios.request({
    url: '/pcm/equipments/month_plans/'+projectId+'/'+year+'/'+month,
    data:data,
    method: 'post',
  })
}
//获取全部数据
export const getAllData=(projectId,year,month)=>{
  return axios.request({
    url: '/pcm/equipments/month_plans/'+projectId+'/'+year+'/'+month,
    method: 'get',
  })
}

//清空计划列表
export const clearanceData=(projectId,year,month)=>{
  return axios.request({
    url: '/pcm/equipments/clear/month_plans/'+projectId+'/'+year+"/"+month,
    method: 'delete',
  })
}
//重新自动生成
export const anewData=(projectId,year,month)=>{
  return axios.request({
    url: '/pcm/equipments/init/month_plans/'+projectId+'/'+year+'/'+month,
    method: 'get',
  })
}
