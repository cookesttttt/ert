import axios from '@/libs/api.request'

//删除高层
export const removeHighLevel = (id) => {
  return axios.request({
    url: '/uac/leaders/leader/' + id,
    method: 'delete'
  })
}
//获取选中分管部门
export  const  getSelectedDepartment =(id)=>{
  return axios.request({
    url: '/uac/leaders/departments/' + id,
    method: 'get'
  })
}
//获取全部分管部门
export const getDepartment=()=>{
   return axios.request({
     url: '/uac/leaders/departments',
     method: 'get'
   })
}
//添加高层
export const  addHighLevelData=(data)=>{
   return axios.request({
     url: '/uac/leaders/leader',
     method: 'post',
     data: data
   })
}

//编辑高层
export const  editorialLevelData=(data)=>{
  return axios.request({
    url: '/uac/leaders/leader',
    method: 'put',
    data: data
  })
}

//获取所有高层的数据
export const getAllHighLevelData=()=>{
  return axios.request({
    url: '/uac/leaders/leaders',
    method: 'get'
  })
}

