import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'uac/user/login/web',
    data,
    method: 'post'
  })
}
