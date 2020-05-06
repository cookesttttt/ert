import axios from '@/libs/api.request'
//获取电话号码
export const getTel = (tel) => {
  return axios.request({
    url: '/uac/user/password/'+tel,
    method: 'get'
  })
}
// 提交新密码
export const newPasswordData = (data) => {
  return axios.request({
    url: '/uac/user/password',
    method: 'put',
    data:data
  })
}
//获取验证码
export const getVerificationCode=(tel)=>{
  return axios.request({
    url: '/uac/user/password/code/' + tel,
    method: 'get'
  })
}
