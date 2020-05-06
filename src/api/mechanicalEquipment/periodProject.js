import axios from '@/libs/api.request'
//获取期间计划
export const  getTimeplanold = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/map/'+projectId,
    method: 'get',
  })
}

//获取期间计划是不是填写
export const  getTimeplanNew = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/plans/date/'+projectId,
    method: 'get',
  })
}
//保存日期
export const Saveplan = (data) => {
  return axios.request({
    url: '/pcm/equipments/plans/date',
    data:data,
    method: 'post',
  })
}
