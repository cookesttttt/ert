import axios from '@/libs/api.request'
//获取用品类别管理树
export const getCategoryTree = (id) => {
  return axios.request({
    url: '/pcm/supply/category/nodes/'+id,
    method: 'get',
  })
}
//新建物质
export const newMaterial = (data) => {
  return axios.request({
    url: '/pcm/supplies/supply',
    data:data,
    method: 'post',
  })
}
//获取所有用品
export const allData = (pageNum, pageSize, value,categoryId) => {
  return axios.request({
    url: '/pcm/supplies/supplies/'+pageNum+'/'+pageSize+'/'+categoryId+'?keyWord='+value,
    method: 'get',
  })
}
//删除数据
export const deleteTable = (id) => {
  return axios.request({
    url: '/pcm/supplies/supply/'+id,
    method: 'delete',
  })
}
//编辑物质信息
export const editMaterial = (data,id) => {
  return axios.request({
    url: '/pcm/supplies/supply/'+id,
    data:data,
    method: 'put',
  })
}
