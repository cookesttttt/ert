import axios from '@/libs/api.request'
// 获取列表全部数据
export const getAllData = (projectId,pageNum,pageSize) => {
  return axios.request({
    url: 'pcm/equipments/protect_bills/'+projectId+'/'+ pageNum + '/' + pageSize,
    method: 'get'
  })
}
// 删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: 'pcm/equipments/protect_bill/' + id,
    method: 'delete'
  })
}

//新增
export const newData = (projectId,data) => {
  return axios.request({
    url: 'pcm/equipments/protect_bill/'+projectId,
    data: data,
    method: 'post',
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: 'pcm/equipments/protect_bill/attachment/' + id,
    method: 'delete'
  })
}
//编辑
export const editData = (id,data) => {
  return axios.request({
    url: 'pcm/equipments/protect_bill/'+id,
    data: data,
    method: 'put',
  })
}
//  获取编辑数据
export const getEditData = (id) => {
  return axios.request({
    url: 'pcm/equipments/protect_bill/'+id,
    method: 'get'
  })
}
