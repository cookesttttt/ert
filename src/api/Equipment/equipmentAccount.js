import axios from '@/libs/api.request'
// 获取列表全部数据
export const getAllData = (projectId, pageNum,pageSize) => {
  return axios.request({
    url: 'pcm/equipments/records/' + projectId + '/' + pageNum + '/' + pageSize,
    method: 'get'
  })
}
