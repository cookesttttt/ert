import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/rent_in/bills/'+ projectId,
    method: 'get',
  })
}
//删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_in/bill/'+ id,
    method: 'delete',
  })
}

//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_in/bill/attachment/'+ id,
    method: 'delete'
  })
}

//新增数据
export const newLease = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_in/bill',
    data: data,
    method: 'post',
  })
}

//数据详情回显
export const getDataEcho = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_in/bill/'+id,
    method: 'get',
  })
}
//编辑数据
export const editData = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_in/bill',
    data:data,
    method: 'put',
  })
}

//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_in/bill/equipments',
    data:data,
    method: 'delete'
  })
}
