import axios from "@/libs/api.request";

// 查询所有单位工程
export const getAllUnitproject = projectId => {
  return axios.request({
    url: "pcm/fbfx/unitproject/unitprojects/" + projectId,
    method: "get"
  });
};

// 单位工程是否能添加的检查接口
export const isADD = projectId => {
  return axios.request({
    url: "pcm/fbfx/unitproject/check/" + projectId,
    method: "get"
  });
};

// 新建单位工程 -- 单位工程类型
export const getPartialType = () => {
  return axios.request({
    url: "pcm/fbfx/template/categories",
    method: "get"
  });
};

// 新建单位工程
export const newPartial = (data) => {
  return axios.request({
    url: "pcm/fbfx/unitproject/unitproject",
    data:data,
    method: "post"
  });
};

// 导出所有的分部分项数据
export const derivePartial = projectId => {
  return axios.request({
    url: "pcm/fbfx/unitproject/export/" + projectId,
    method: "get"
  });
};

// 删除单位工程
export const removePartial = id => {
  return axios.request({
    url: "pcm/fbfx/unitproject/unitproject/" + id,
    method: "delete"
  });
};

// 删除单位工程
export const getPartial = id => {
  return axios.request({
    url: "pcm/fbfx/unitproject/unitproject/" + id,
    method: "get"
  });
};

// 修改单位工程
export const amendPartial = (data) => {
  return axios.request({
    url: "pcm/fbfx/unitproject/unitproject",
    data:data,
    method: "put"
  });
};