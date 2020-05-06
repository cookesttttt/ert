import axios from '@/libs/api.request'
//新增供应商
export const newSupplierData = (data, projectId) => {
  return axios.request({
    url: '/pcm/equipments/suppliers/supplier/' + projectId,
    data: data,
    method: 'post',
  })
}
//获取全部数据
export const getAllData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/suppliers/' + projectId,
    method: 'get',
  })
}
//删除供应商
export const deleteSupplier = (id) => {
  return axios.request({
    url: '/pcm/equipments/suppliers/supplier/' + id,
    method: 'delete'
  })
}

//获取编辑数据
export const getEditSupplier = (id) => {
  return axios.request({
    url:'/pcm/equipments/suppliers/supplier/'+id,
    method: "get",
  })
}
//编辑数据
export const editSupplierData = (data,projectId,id) => {
  return axios.request({
    url:'/pcm/equipments/suppliers/supplier/'+projectId+'/'+id,
    data:data,
    method: "put",
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: '/pcm/equipments/suppliers/supplier/attachment/'+ id,
    method: 'delete'
  })
}
//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/suppliers/supplier/equipments',
    data:data,
    method: 'delete'
  })
}
