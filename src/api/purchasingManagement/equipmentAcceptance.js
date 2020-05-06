import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (projectId) => {
  return axios.request({
    url: 'pcm/equipments/accept/bills/' + projectId,
    method: 'get',
  })
}
//删除列表数据
export const deleteList = (id) => {
  return axios.request({
    url: '/pcm/equipments/accept/bill/' + id,
    method: 'delete',
  })
}
//获取单号
export const getOrderNumber = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/contracts/numbers/'+projectId,
    method: 'get',
  })
}
//新增
export const newAccept = (data) => {
  return axios.request({
    url: 'pcm/equipments/accept/bill',
    data: data,
    method: 'post',
  })
}

//编辑数据
export const editAccept = (data,id) => {
  return axios.request({
    url: 'pcm/equipments/accept/bill/'+id,
    data:data,
    method: 'put',
  })
}
//详情
export const getAccept = (id) => {
  return axios.request({
    url: 'pcm/equipments/accept/bill/'+id,
    method: 'get',
  })
}
