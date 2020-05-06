import axios from '@/libs/api.request'
//获取用品类别管理树
export const getCategoryTree = (id) => {
  return axios.request({
    url: '/pcm/supply/category/nodes/'+id,
    method: 'get',
  })
}
//新建用品管理类别
export const newCategory = (data) => {
  return axios.request({
    url: '/pcm/supply/category',
    data:data,
    method: 'post',
  })
}
//获取表格数据
export const getTableData = (projectId,id) => {
  return axios.request({
    url: '/pcm/supply/categories/'+projectId+'/'+id,
    method: 'get',
  })
}
//删除表格数据
export const deleteTableData = (id) => {
  return axios.request({
    url: '/pcm/supply/category/'+id,
    method: 'delete',
  })
}
//编辑表格数据
export const editTableData = (data,id) => {
  return axios.request({
    url: '/pcm/supply/category/'+id,
    data:data,
    method: 'put',
  })
}
