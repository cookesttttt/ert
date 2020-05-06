import axios from '@/libs/api.request'
//添加机械类型
export const newMechanicalTypeData = (data) => {
  return axios.request({
    url: '/pcm/equipment/categories/category',
    method: 'post',
    data: data,
  })
}
//获取全部机械类型
export const getAllMechanicalTypeData = (pageNum, pageSize, projectId,keyWord) => {
  return axios.request({
    url: '/pcm/equipment/categories/' + pageNum + '/' + pageSize +'/'+ projectId + '?keyWord=' + keyWord,
    method: 'get'
  })
}
//删除机械类型
export const deleteMechanicalTypeData = (id) => {
  return axios.request({
    url: '/pcm/equipment/categories/category/' + id,
    method: 'delete'
  })
}
//编辑机械类型
export const getEditMechanicalTypeData = (data, id) => {
  return axios.request({
    url: '/pcm/equipment/categories/category/' + id,
    data: data,
    method: 'put'
  })
}
