import axios from '@/libs/api.request'
//新建库房
export const newWarehouse = (data) => {
  return axios.request({
    url: '/pcm/repertories/repertory',
    data:data,
    method: 'post',
  })
}
//获取库房
export const getWarehouse = (id) => {
  return axios.request({
    url: '/pcm/repertories/repertories/'+id,
    method: 'get',
  })
}
//删除库房
export const deleteWarehouse = (id) => {
  return axios.request({
    url: '/pcm/repertories/repertory/'+id,
    method: 'delete',
  })
}
//编辑库房
export const editWarehouse = (data,id) => {
  return axios.request({
    url: '/pcm/repertories/repertory/'+id,
    data:data,
    method: 'put',
  })
}
