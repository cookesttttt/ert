import axios from '@/libs/api.request'
//获取类别管理树
export const getCategoryTree = (projectId) => {
  return axios.request({
    url: '/pcm/quality/specification/categories/tree/' + projectId,
    method: 'get',
  })
}
//新建物质
export const newData = (data) => {
  return axios.request({
    url: '/pcm/quality/specifications/specification',
    data: data,
    method: 'post',
  })
}
//获取所有数据
export const allData = (categoryId, pageNum, pageSize, value,) => {
  return axios.request({
    url: '/pcm/quality/specifications/' + categoryId + '/' + pageNum + '/' + pageSize + '?keyWord=' + value,
    method: 'get',
  })
}
//删除数据
export const deleteTable = (id) => {
  return axios.request({
    url: '/pcm/quality/specifications/specification/' + id,
    method: 'delete',
  })
}
//编辑物质信息
export const editData = (data) => {
  return axios.request({
    url: '/pcm/quality/specifications/specification/edit',
    data: data,
    method: 'post',
  })
}
//删除附件
export const deleteAttachments = (id) => {
  return axios.request({
    url: '/pcm/quality/specifications/specification/attachments/' + id,
    method: 'delete',
  })
}
//获取数据详情
export const getDetails = (id) => {
  return axios.request({
    url: '/pcm/quality/specifications/specification/' + id,
    method: 'get',
  })
}
