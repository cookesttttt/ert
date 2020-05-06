import axios from "@/libs/api.request";
import { type } from "os";

// 获取左侧树状图数据
export const getTree = partialId => {
  return axios.request({
    url: "pcm/fbfx/info/fbfxs/" + partialId,
    method: "get"
  });
};

// 获取子分部分项的模板数据
export const getChildrenTemplate = (type, id) => {
  return axios.request({
    url: "pcm/fbfx/info/fbfx/child/" + type + "/" + id,
    method: "get"
  });
};

// 删除单个分部分项数据
export const removePartial = id => {
  return axios.request({
    url: "pcm/fbfx/info/fbfx/" + id,
    method: "delete"
  });
};

// 新增子分部分项
export const addPartial = (currentFbfxId, type, data) => {
  return axios.request({
    url: "pcm/fbfx/info/fbfx/child/" + type + "/" + currentFbfxId,
    data: data,
    method: "post"
  });
};

// 拷贝当前分部分项的数据
export const copyPartial = (id, num) => {
  return axios.request({
    url: "pcm/fbfx/info/fbfx/copy/" + id + "/" + num,
    method: "get"
  });
};

// 修改分部分项数据
export const modificationPartial = data => {
  return axios.request({
    url: "pcm/fbfx/info/fbfx/",
    data: data,
    method: "put"
  });
};

// 完成单个单位工程分部分项的划分
export const completeDivision = id => {
  return axios.request({
    url: "pcm/fbfx/unitproject/complete/" + id,
    method: "get"
  });
};

// 查询单个单位工程分部分项的数据
export const getPartial = id => {
  return axios.request({
    url: "pcm/fbfx/info/fbfx/" + id,
    method: "get"
  });
};
