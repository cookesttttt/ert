import axios from '@/libs/api.request'
//获取出库登记数据
export const getOUtData= (pageNum, pageSize, value,projectId) => {
  return axios.request({
    url: '/pcm/rep/out/orders/'+pageNum+'/'+pageSize+'/'+projectId+"?keyWord="+value,
    method: 'get',
  })
}
//删除数据
export const deleteTable = (id) => {
  return axios.request({
    url: '/pcm/rep/out/order/'+id,
    method: 'delete',
  })
}
