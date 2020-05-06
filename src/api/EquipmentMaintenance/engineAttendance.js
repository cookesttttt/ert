import axios from '@/libs/api.request'
// 获取列表全部数据
export const getAllData = (pageNum,pageSize,projectId) => {
  return axios.request({
    url: 'pcm/equipments/maintenance/bills/'+ pageNum + '/' + pageSize +'/'+projectId,
    method: 'get'
  })
}
// 删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: 'pcm/equipments/maintenance/bill/' + id,
    method: 'delete'
  })
}
//新增
export const newData = (projectId,data) => {
  return axios.request({
    url: 'pcm/equipments/maintenance/bill/'+projectId,
    data: data,
    method: 'post',
  })
}
//编辑
export const editData = (projectId,id,data) => {
  return axios.request({
    url: 'pcm/equipments/maintenance/bill/'+projectId+'/'+id,
    data: data,
    method: 'put',
  })
}
//  获取编辑数据
export const getEditData = (id) => {
  return axios.request({
    url: 'pcm/equipments/maintenance/bill/'+id,
    method: 'get'
  })
}
//删除设备
export const deleteDevice = (data) => {
  return axios.request({
    url: 'pcm/equipments/maintenance/bill/cost_detail',
    data:data,
    method: 'delete'
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: 'pcm/equipments/maintenance/bill/attachments/' + id,
    method: 'delete'
  })
}
