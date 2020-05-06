import axios from '@/libs/api.request'
//
// export const getRouterReq = (access) => {
//   return axios.request({
//     url: 'get_router',
//     params: {
//       access
//     },
//     method: 'get'
//   })
// }
export const mainList = id => {
  return axios.request({
    url: 'auth/org/roles/self/' + id,
    method: 'get'
  })
}
