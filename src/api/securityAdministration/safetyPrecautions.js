import axios from '@/libs/api.request'
//获取所有数据
export const allData = (projectId, pageNum, pageSize, value,) => {
  return axios.request({
    url: '/pcm/safe/precautions/' + projectId + '/' + pageNum + '/' + pageSize + '?keyWord=' + value,
    method: 'get',
  })
}
//新建
export const newData = (data) => {
  return axios.request({
    url: '/pcm/safe/precautions/precaution',
    data: data,
    method: 'post',
  })
}
//删除数据
export const deleteTable = (id) => {
  return axios.request({
    url: '/pcm/safe/precautions/precaution/' + id,
    method: 'delete',
  })
}

//编辑
export const editData = (data) => {
  return axios.request({
    url: '/pcm/safe/precautions/precaution/edit',
    data: data,
    method: 'post',
  })
}
//删除附件
export const deleteAttachments = (id) => {
  return axios.request({
    url: '/pcm/safe/precautions/precaution/attachment/' + id,
    method: 'delete',
  })
}
//获取数据详情
export const getDetails = (id) => {
  return axios.request({
    url: '/pcm/safe/precautions/precaution/' + id,
    method: 'get',
  })
}
