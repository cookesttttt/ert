import axios from '@/libs/api.request'

// 获取个人信息接口
export const getInfo = () => {
  return axios.request({
    url: 'auth/userinfo/infos',
    method: 'get'
  })
}

// 修改用户姓名接口
export const putName = (realname) => {
  return axios.request({
    url: 'auth/userinfo/user/realname/' + realname,
    method: 'put'
  })
}

// 修改用户密码接口
export const putPwd = (data) => {
  return axios.request({
    url: 'auth/userinfo/user/password',
    method: 'put',
    data: data
  })
}

// 修改用户密码接口
export const putPhone = (phone) => {
  return axios.request({
    url: 'auth/userinfo/user/updatephone/smscode/' + phone,
    method: 'get'
  })
}

// 验证手机验证码接口
export const putCode = (phone, code) => {
  return axios.request({
    url: 'auth/userinfo/user/validate/smscode/' + phone + '/' + code,
    method: 'get'
  })
}

// 验证手机验证码接口
export const putNewPhone = (data) => {
  return axios.request({
    url: 'auth/userinfo/user/updatephone',
    data: data,
    method: 'put'
  })
}
