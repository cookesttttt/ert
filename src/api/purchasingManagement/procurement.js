import axios from '@/libs/api.request'
//获取整体计划汇总
export const getVerallPlanData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/entirety_plans/' + projectId,
    method: 'get',
  })
}
//保存计划
export const saveData = (projectId,data) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/buy_plans/' + projectId,
    data:data,
    method: 'post',
  })
}
//修改数据
export const   editAllData= (id,projectId,data) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/buy_plans/'+id+'/'+projectId,
    data:data,
    method: 'put',
  })
}
//获取采购计划中的全部数据
export const getData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/buy_plans/list/' + projectId,
    method: 'get',
  })
}
//删除
export const deleteData = (data) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/buy_plans',
    data:data,
    method: 'delete',
  })
}
//清空采购计划
export const emptyData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/buy_plans/'+projectId,
    method: 'delete',
  })
}
//导出excel
export const importExcel = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/buy_plans/excel/'+projectId,
    responseType: 'blob',
    method: 'get',
  })
}
//导入excel

