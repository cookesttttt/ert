import axios from '@/libs/api.request'
// 获取列表全部数据
export const getAllData = (projectId, pageNum,pageSize) => {
  return axios.request({
    url: 'pcm/equipments/dispatch/records/' + projectId + '/' + pageNum + '/' + pageSize,
    method: 'get'
  })
}
// 删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: 'pcm/equipments/dispatch/record/' + id,
    method: 'delete'
  })
}
//新增
export const newData = (projectId,data) => {
  return axios.request({
    url: 'pcm/equipments/dispatch/record/'+projectId,
    data: data,
    method: 'post',
  })
}
//编辑
export const editData = (projectId,id,data) => {
  return axios.request({
    url: 'pcm/equipments/dispatch/record/'+projectId+'/'+id,
    data: data,
    method: 'put',
  })
}
//  获取编辑数据
export const getEditData = (id) => {
  return axios.request({
    url: 'pcm/equipments/dispatch/record/'+id,
    method: 'get'
  })
}
//删除设备
export const deleteDevice = (data) => {
  return axios.request({
    url: 'pcm/equipments/dispatch/record/equipments',
    data:data,
    method: 'delete'
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: 'pcm/equipments/dispatch/record/attachment/' + id,
    method: 'delete'
  })
}
