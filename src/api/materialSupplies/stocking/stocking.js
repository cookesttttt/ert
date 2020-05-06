import axios from '@/libs/api.request'
//获取数据
export const getData= (pageNum, pageSize, value,projectId) => {
  return axios.request({
    url: '/pcm/rep/check/orders/'+pageNum+'/'+pageSize+'/'+projectId+"?keyWord="+value,
    method: 'get',
  })
}
//删除数据
export const deleteTable = (id) => {
  return axios.request({
    url: '/pcm/rep/check/order/'+id,
    method: 'delete',
  })
}
