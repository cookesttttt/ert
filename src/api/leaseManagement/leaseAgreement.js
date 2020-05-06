import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/rent/contracts/'+ projectId,
    method: 'get',
  })
}
//删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract/'+ id,
    method: 'delete',
  })
}
//新增数据
export const newLeaseContract = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract',
    data: data,
    method: 'post',
  })
}
//获取单据编号
export const getNumber= (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+2,
    method: 'get',
  })
}
//获取数据回显
//合同基本信息
export const getDataEcho = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract/'+id,
    method: 'get',
  })
}
//合同清单
export const getDataEchoInventory= (id) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract/equipments/'+id,
    method: 'get',
  })
}
//附件列表
export const getDataEchoPicture = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract/attachment/'+id,
    method: 'get',
  })
}
//编辑数据
export const editData = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract',
    data:data,
    method: 'put',
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract/attachment/'+ id,
    method: 'delete'
  })
}
//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/rent/contract/equipments',
    data:data,
    method: 'delete'
  })
}
