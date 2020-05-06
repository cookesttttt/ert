import axios from '@/libs/api.request'
//获取全部车牌号码
export const getAllNumber = (projectId) => {
  return axios.request({
    url: 'pcm/vehicles/numbers/'+projectId,
    method: 'get',
  })
}
