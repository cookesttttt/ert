import axios from '@/libs/api.request'
// 获取整体进度计划基本信息
export const getSchedule = projectId => {
  return axios.request({
    url: '/pcm/schedule/whole/basicInfo/' + projectId,
    method: 'get'
  })
}

// 保存整体进度计划基本信息
export const saveSchedule = (projectId, data) => {
  return axios.request({
    url: '/pcm/schedule/whole/basicInfo/' + projectId,
    method: 'post',
    data: data
  })
}

// 获取整体进度计划单位工程信息
export const getPartialDay = planId => {
  return axios.request({
    url: '/pcm/schedule/whole/unitprojectInfo/' + planId,
    method: 'get'
  })
}

// 保存整体进度计划单位工程信息
export const savePartialDay = (planId, data) => {
  return axios.request({
    url: '/pcm/schedule/whole/unitprojectInfo/' + planId,
    method: 'post',
    data: data
  })
}

// 获取整体进度计划 计划明细
export const getDetailedSchedule = planId => {
  return axios.request({
    url: '/pcm/schedule/whole/graph/infos/' + planId,
    method: 'get'
  })
}
