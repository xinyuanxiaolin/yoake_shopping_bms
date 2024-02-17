import {
  getAction,
  postAction,
  deleteAction,
  putAction,
  httpAction,
} from "@/api/manage";

/* 商城后台管理接口 */

//登录
export const Login = (data) => {
  return postAction("/login/bms", data);
};

/* 分类管理 */
//添加分类
export const addCategory = (data) =>{
  return postAction("/category",data);
}
//获取分类详情
export const getCategory = ()=>{
  return getAction("/category")
}

//删除一级分类
export const deleteOneCategory=(id)=>{
  return deleteAction(`/category/one/${id}`)

}
//删除二级分类
export const deleteTwoCategory=(id)=>{
  return deleteAction(`/category/two/${id}`)

}

//编辑分类
export const putCategory=(data)=>{
  return putAction(`/category`,data)
}
