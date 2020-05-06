import axios from '@/libs/api.request'
// 获取列表全部数据
export const getAllData = (projectId,data) => {
  return axios.request({
    url: 'pcm/equipments/using_manager/record_bills/' + projectId,
    data:data,
    method: 'post'
  })
}
