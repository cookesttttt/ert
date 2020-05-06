import axios from '@/libs/api.request'
//获取列表全部数据
export const getAllData = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/purchasing_bills/' + projectId,
    method: 'get',
  })
}
//删除列表数据
export const deleteProcurement = (id) => {
  return axios.request({
    url: '/pcm/equipments/purchasing_bills/purchasing_bill/' + id,
    method: 'delete',
  })
}
//新增数据
export const newApplicationData = (data) => {
  return axios.request({
    url: '/pcm/equipments/purchasing_bills/purchasing_bill',
    data: data,
    method: 'post',
  })
}
//删除图片
export const deleteImgData = (id) => {
  return axios.request({
    url: 'pcm/equipments/purchasing_bills/attachments/'+ id,
    method: 'delete'
  })
}
//获取供应商
export const getSuppliers = (projectId) => {
  return axios.request({
    url: '/pcm/equipments/suppliers/' + projectId,
    method: 'get',
  })
}
//获取单号
export const getOrderNumber = (projectId) => {
  return axios.request({
    url: '/pcm/bill/numbers/number/'+projectId+'/'+3,
    method: 'get',
  })
}
//获取详情
export const getdetails = (id) => {
  return axios.request({
    url: '/pcm/equipments/purchasing_bills/purchasing_bill/'+id,
    method: 'get',
  })
}
//编辑数据
export const editApplication = (data,id) => {
  return axios.request({
    url: '/pcm/equipments/purchasing_bills/purchasing_bill/'+id,
    data:data,
    method: 'put',
  })
}
//删除设备
export const deleteEquipment = (data) => {
  return axios.request({
    url: '/pcm/equipments/purchasing_bills/equipments',
    data:data,
    method: 'delete'
  })
}
//按名称模糊查询设备
export const  nameData= (projectId,name) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/equipments/'+projectId+'?name='+name,
    method: 'get',
  })
}
//指定名称，按型号模糊查询设备!
export const modelData= (projectId,name,model) => {
  return axios.request({
    url: '/pcm/equipments/buy_plan/equipments/'+projectId+'/'+name+'?model='+model,
    method: 'get',
  })
}
//指定名称和型号，按功率模糊查询设备
export const powerData= (projectId,name,model,power) => {
  return axios.request({
    url: '/equipments/buy_plan/equipments/'+projectId+'/'+name+'/'+model+'?power='+power,
    method: 'get',
  })
}
