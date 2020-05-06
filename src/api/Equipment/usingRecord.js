import axios from '@/libs/api.request'
// 获取列表全部数据
export const getAllData = (projectId, pageNum,pageSize) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/record_bills/' + projectId + '/' + pageNum + '/' + pageSize,
    method: 'get'
  })
}
// 删除列表数据
export const deleteData = (id) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/record_bill/' + id,
    method: 'delete'
  })
}
//新增
export const newData = (data,projectId) => {
  return axios.request({
    url: '/pcm/equipments/using_manager/record_bill/'+projectId,
    data: data,
    method: 'post',
  })
}
//修改
export const editData = (projectId,id,data) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/record_bill/'+projectId+'/'+id,
    data: data,
    method: 'put',
  })
}
//获取设备名称
export const getAllName = (projectId,name) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/equipment/' + projectId+'?name='+name,
    method: 'get'
  })
}//获取设备型号
export const getAllModel = (projectId,name,model) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/equipment/' + projectId+'/'+name+'?model='+model,
    method: 'get'
  })
}//获取设备功率
export const getAllPower = (projectId,name,model,power) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/equipment/' + projectId+'/'+name+'/'+model+'?power='+power,
    method: 'get'
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/record_bill/attachment/' + id,
    method: 'delete'
  })
}
//删除图片
export const getEditAllData = (id) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/record_bill/' + id,
    method: 'get'
  })
}
