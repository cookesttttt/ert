import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (projectId,pageSize,pageNum) => {
  return axios.request({
    url: '/pcm/equipments/count/bills/'+ projectId +'/'+pageSize+'/'+pageNum,
    method: 'get',
  })
}
//删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: '/pcm/equipments/count/bill/'+ id,
    method: 'delete',
  })
}



//获取单据编号
export const getNumber= (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+7,
    method: 'get',
  })
}
//新增数据
export const newLeaseContract = (data,projectId) => {
  return axios.request({
    url: '/pcm/equipments/count/bill/'+projectId,
    data: data,
    method: 'post',
  })
}
//数据详情
export const getDataEcho = (id) => {
  return axios.request({
    url: '/pcm/equipments/count/bill/'+id,
    method: 'get',
  })
}

//编辑数据
export const editData = (data,projectId,id) => {
  return axios.request({
    url: '/pcm/equipments/count/bill/'+projectId+'/'+id,
    data:data,
    method: 'put',
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: '/pcm/equipments/count/bill/attachment/'+ id,
    method: 'delete'
  })
}
//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/count/bill/equipments',
    data:data,
    method: 'delete'
  })
}
