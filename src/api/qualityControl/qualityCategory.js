import axios from '@/libs/api.request'
//获取类别管理树
export const getCategoryTree = (projectId) => {
  return axios.request({
    url: '/pcm/quality/specification/categories/tree/'+projectId,
    method: 'get',
  })
}
//获取表格数据
export const getTableData = (projectId,id) => {
  return axios.request({
    url: '/pcm/quality/specification/categories/'+projectId+'/'+id,
    method: 'get',
  })
}
//新建管理类别
export const newCategory = (data) => {
  return axios.request({
    url: '/pcm/quality/specification/categories/category',
    data:data,
    method: 'post',
  })
}
//删除表格数据
export const deleteTableData = (id) => {
  return axios.request({
    url: '/pcm/quality/specification/categories/category/'+id,
    method: 'delete',
  })
}
//编辑表格数据
export const editTableData = (data) => {
  return axios.request({
    url: '/pcm/quality/specification/categories/category',
    data:data,
    method: 'put',
  })
}
