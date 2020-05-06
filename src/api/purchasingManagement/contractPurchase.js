import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/contracts/' + projectId,
    method: 'get',
  })
}
//删除列表数据
export const deleteList = (id) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract/' + id,
    method: 'delete',
  })
}
//获取单号
export const getOrderNumber = (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+1,
    method: 'get',
  })
}
//新增合同
export const newContract = (data) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract',
    data: data,
    method: 'post',
  })
}

//获取合同基本信息
export const getInformation  = (id) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract/'+id,
    method: 'get',
  })
}
//获取设备清单
export const getInventory = (id) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract/equipments/'+id,
    method: 'get',
  })
}
//获取获取附件
export const getAppendix  = (id) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract/attachments/'+id,
    method: 'get',
  })
}
//编辑数据
export const editApplication = (data,id) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract/'+id,
    data:data,
    method: 'put',
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract/attachment/'+ id,
    method: 'delete'
  })
}
//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/contracts/contract/equipments',
    data:data,
    method: 'delete'
  })
}
