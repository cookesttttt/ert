import axios from '@/libs/api.request'
import {  getToken } from '@/libs/util'
//删除文件
export const deletedFile = (dirId) => {
  return axios.request({
    url: '/docs/file/' + dirId,
    method: 'delete'
  })
}
//查看文件
export const readFile  = () => {
  return axios.request({
    url: '/docs/fileContent',
    method: 'get'
  })
}
//下载文件
export const downloadFile = (id) => {
  return axios.request({
    method: 'get',
    url: '/docs/file/' +id,
    responseType: 'blob'
  })
}

//我的分享全部文件
export const shareFiles=(projectId,pageNum, pageSize, value,)=>{
  return axios.request({
    url: '/docs/shareFiles/'+projectId+ '/' + pageNum + "/" + pageSize + "?fileName=" + value,
    method: "get"
  })
}

//分享给我的全部文件
export const shareFilesToMe= (currentPage,pageSize,fileName,projectId) => {
  return axios.request({
    url: '/docs/shareFilesToMe/'+projectId+"/"+currentPage+"/"+pageSize+"?fileName="+fileName,
    method: "get"
  })
}

//我上传的全部文件
export const myUploadFiles= (projectId,currentPage,pageSize,fileName) => {
  return axios.request({
    url: '/docs/myUploadFiles/'+projectId+"/"+currentPage+"/"+pageSize+"?fileName="+fileName,
    method: "get"
  })
}

//文件上传
export const uploadFileInfo=(fileInfo)=>{
  return axios.request({
    url: '/docs/fileInfo',
    data: fileInfo,
    method: 'post'
  })
}
