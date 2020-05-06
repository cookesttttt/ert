import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/rent_stop/bills/'+ projectId,
    method: 'get',
  })
}
//删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_stop/bill/'+ id,
    method: 'delete',
  })
}
//获取单据编号
export const getNumber= (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+5,
    method: 'get',
  })
}
//新增数据
export const newLeaseContract = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_stop/bill',
    data: data,
    method: 'post',
  })
}
//数据详情
export const getDataEcho = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_stop/bill/'+id,
    method: 'get',
  })
}

//编辑数据
export const editData = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_stop/bill',
    data:data,
    method: 'put',
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent_stop/bill/attachment/'+ id,
    method: 'delete'
  })
}
//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent_stop/bill/equipments',
    data:data,
    method: 'delete'
  })
}
