import axios from '@/libs/api.request'
//获取入库登记数据
export const getReceiptData= (pageNum, pageSize, value,projectId) => {
  return axios.request({
    url: 'pcm/rep/in/orders/'+pageNum+'/'+pageSize+'/'+projectId+"?keyWord="+value,
    method: 'get',
  })
}
//删除数据
export const deleteTable = (id) => {
  return axios.request({
    url: '/pcm/rep/in/order/'+id,
    method: 'delete',
  })
}


