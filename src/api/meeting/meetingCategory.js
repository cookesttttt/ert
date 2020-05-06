import axios from '@/libs/api.request'
//删除会议类别
export const deletedCategory = (id) => {
  return   axios.request({
    url:"/pcm/meetingCategory/"+id,
    method: 'delete'
  })
}
//获取全部会议类别
export const getAllCategory = (projectId) => {
  return   axios.request({
    url: '/pcm/meetingCategories/'+projectId,
    method: 'get'
  })
}
//新增会议类别
export const addCategory = (newName,projectId) => {
  return   axios.request({
    url:"/pcm/meetingCategory/"+projectId+"?name="+newName,
    method: 'post'
  })
}
//编辑会议类别
export const editCategory = (data) => {
  return   axios.request({
    url:"/pcm/meetingCategory",
    method:"put",
    data:data
  })
}
