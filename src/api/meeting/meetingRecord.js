import axios from '@/libs/api.request'
//会议详情
export const meetingDetails= (id) => {
  return   axios.request({
    url: '/pcm/meetingRecord/' +id,
    method: 'get'
  })
}
//会议详情删除
export const  deleteMeetingDetails=(id)=>{
    return axios.request({
      url: '/pcm/meetingRecord/' + id,
      method: 'delete'
    })
}

//获取所有会议
export  const allMeeting=(pageNum,pageSize,data)=>{
  return axios.request({
    url: '/pcm/meetingRecords/'+ pageNum + '/' +pageSize,
    data: data,
    method: 'post'
  })
}

//上传会议
export  const uploadMeeting=(data)=>{
  return axios.request({
    url: '/pcm/meetingRecord',
    data: data,
    method: 'post'
  })
}

//编辑会议
export const editorialMeeting=(data)=>{
  return axios.request({
      url: '/pcm/meetingRecord',
      method: 'put',
      data: data
    })
}
//编辑数据回显
export const dataEcho=(id)=>{
  return axios.request({
    url: '/pcm/meetingRecord/' + id,
    method: 'get'
  })
}
//图片删除
export const deleteImgData=(id)=>{
  return axios.request({
    url: 'pcm/meeting/record/attachment/' + id,
    method: 'delete'
  })
}
