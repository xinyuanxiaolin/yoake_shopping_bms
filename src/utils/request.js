import axios from "axios";
const service = axios.create({
  // 请求超时
  timeout: 15000,
});

// 异常响应，有空写
const err = (error) => {
  console.log(error);
};
// 请求拦截
service.interceptors.request.use((config) => {
  // 添加token,做判断权限跳转，防越界
  config.headers.token=localStorage.getItem("token")
  return config;
});
// 响应拦截
service.interceptors.response.use((response) => {
  //处理回显数据，比如保证格式统一
  return response.data;
}, err);

export default service;
