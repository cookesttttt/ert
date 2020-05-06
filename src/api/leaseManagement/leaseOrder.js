import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (pageNum,pageSize,projectId) => {
  return axios.request({
    url: '/pcm/equipments/rent_apply/bills/'+pageNum+'/'+pageSize+'/'+ projectId,
    method: 'get',
  })
}
//获取单号
export const getOrderNumber = (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+4,
    method: 'get',
  })
}
//删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_apply/bill/'+ id,
    method: 'delete',
  })
}
//新增数据
export const newLease = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_apply/bill',
    data: data,
    method: 'post',
  })
}
//获取数据回显
export const getDataEcho = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_apply/bill/'+id,
    method: 'get',
  })
}
//编辑数据
export const editData = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_apply/bill',
    data:data,
    method: 'put',
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_apply/bill/attachment/'+ id,
    method: 'delete'
  })
}
//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_apply/bill/equipments',
    data:data,
    method: 'delete'
  })
}
