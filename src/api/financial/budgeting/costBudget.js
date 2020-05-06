import axios from '@/libs/api.request'
// 获取汇总表数据接口
export const getCostData = projectId => {
  return axios.request({
    url: 'cost/cost/summary/' + projectId,
    method: 'get'
  })
}
// 设置起止日期
export const CostDate = (projectId, data) => {
  return axios.request({
    url: 'cost/cost/datetime/' + projectId,
    data: data,
    method: 'put'
  })
}

// 修改起止日期
export const putCostDate = (costId, data) => {
  return axios.request({
    url: 'cost/cost/datetime/' + costId,
    data: data,
    method: 'post'
  })
}

// 首页--获取用户数据
export const getUserInfo = projectId => {
  return axios.request({
    url: 'pcm/home/userinfo/' + projectId,
    method: 'get'
  })
}
