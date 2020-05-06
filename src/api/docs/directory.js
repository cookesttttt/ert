import axios from '@/libs/api.request'
//获取所有目录
export const getAllDirectories = (projectId) => {
  return axios.request({
    url: '/docs/directories/tree/'+projectId,
    method: 'get'
  })
}
//获取点击目录
export const getClickDirectories = (projectId,id) => {
  return axios.request({
    url: '/docs/directories/'+ id+'/'+projectId,
    method: 'get'
  })
}
//删除目录
export const deleteDirectories = (dirId) => {
  return axios.request({
    url: '/docs/directory/' + dirId,
    method: 'delete'
  })
}
//编辑目录
export const editDir=(dir)=>{
  return axios.request({
    url: '/docs/directory',
    data: dir,
    method: 'put'
  })
}
//添加目录
export const addDir = (dir) => {
  return axios.request({
    url: '/docs/directory',
    data: dir,
    method: 'post'
  })
}
