import axios from '@/libs/api.request'
export const getAllDirectories = () => {
  return axios.request({
    url: 'docs/directories/',
    method: 'get'
  })
}

export const getDirsByParentId = (parentId) => {
  return axios.request({
    url: 'docs/directories/' + parentId,
    method: 'get'
  })
}

export const addDir = (dir) => {
  return axios.request({
    url: '/docs/directory',
    data: dir,
    method: 'post'
  })
}

export const deleteDir = (dirId) => {
  return axios.request({
    url: '/docs/directory/' + dirId,
    method: 'delete'
  })
}

export const editDir = (dir) => {
  return axios.request({
    url: '/docs/directory',
    data: dir,
    method: 'put'
  })
}

// 文件
export const fileData = (currentPage, pageSize, dirId) => {
  return axios.request({
    url: '/docs/fileInfos/' + currentPage + '/' + pageSize + '/' + dirId,
    method: 'get'
  })
}

export const searchdata = (currentPage, pageSize, bean) => {
  return axios.request({
    url: '/docs/fileInfos/' + currentPage + '/' + pageSize,
    data: bean,
    method: 'post'
  })
}

export const deletes = (dirId) => {
  return axios.request({
    url: '/docs/file/' + dirId,
    method: 'delete'
  })
}

export const downloadFile = (id) => {
  return axios.request({
    method: 'get',
    url: '/docs/file/' + id,
    responseType: 'blob'
  })
}

export const uploadFiles = (files) => {
  return axios.request({
    url: '/docs/fileInfo/file',
    data: files,
    method: 'post'
  })
}

// 我分享的

export const shareFiles = (currentPage, pageSize, fileName) => {
  return axios.request({
    url: '/docs/shareFiles/' + currentPage + '/' + pageSize + '?fileName=' + fileName,
    method: 'get'
  })
}

// 分享给我的

export const shareFilesToMe = (currentPage, pageSize, fileName) => {
  return axios.request({
    url: '/docs/shareFilesToMe/' + currentPage + '/' + pageSize + '?fileName=' + fileName,
    method: 'get'
  })
}

// 我上传的

export const myUploadFiles = (currentPage, pageSize, fileName) => {
  return axios.request({
    url: '/docs/myUploadFiles/' + currentPage + '/' + pageSize + '?fileName=' + fileName,
    method: 'get'
  })
}

// 人员选择
export const personnelselec = (name) => {
  return axios.request({
    url: '/docs/users/' + name,
    method: 'get'
  })
}

// 分享
export const fileShares = (shareFile) => {
  return axios.request({
    url: '/docs/fileShares',
    data: shareFile,
    method: 'post'
  })
}
//
export const readFile = () => {
  return axios.request({
    url: '/docs/fileContent',
    method: 'get'
  })
}

export const getURL = () => {
  
}
