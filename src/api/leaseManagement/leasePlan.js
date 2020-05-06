import axios from '@/libs/api.request'
//获取类别数据
export const planList= (projectId) => {
  return axios.request({
    url: '/pcm/equipments/rent_plan/rent_plans/' + projectId,
    method: 'get',
  })
}

//获取整体计划汇总
export const getVerallPlanData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/rent_plan/init/' + projectId,
    method: 'get',
  })
}

//编辑计划
export const  editAllData = (id,projectId,data) => {
  return axios.request({
    url: '/pcm/equipments/rent_plan/rent_plans/'+id+'/'+projectId,
    data:data,
    method: 'put',

  })
}
//清空采购计划
export const emptyData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/rent_plan/rent_plans/'+projectId,
    method: 'delete',
  })
}
//删除
export const deleteData = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_plan/rent_plans',
    data:data,
    method: 'delete',
  })
}
//保存计划

export const saveData = (projectId,data) => {
  return axios.request({
    url: '/pcm/equipments/rent_plan/rent_plans/'+projectId,
    data:data,
    method: 'post',
  })
}
