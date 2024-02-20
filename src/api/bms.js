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


/* 商品管理 */
//发布商品
export const publishGoods= (data)=>{
  return postAction('/goods/publish',data)
}

//获取商品列表
export const getGoodsList= ()=>{
  return getAction('/goods/list')
}
//通过商品id和二级分类id获取到商品的详细数据
export const getGoodsById= (parentId,id)=>{
  let data = {
    parentId,
    id
  }
  return getAction('/goods/detail',data)
}
//修改商品
export const putGoods =(data)=>{
  return putAction('/goods',data)
}
//删除单个商品或者批量删除商品
export const deleteGoods = (ids)=>{
  return deleteAction(`/goods/${ids}`)
}


/* 用户管理 */
export const getUsers = (pageNum,pageSize,searchText) =>{
  let data ={
    pageNum,
    pageSize,
    searchText
  }
  return getAction("/member",data)
}

/* 新增或者编辑用户,有传id为编辑用户 */
export const putUsers = (data)=>{
  return putAction("/member",data)
}

/* 删除用户,可批量 */
export const deleteUsers = (ids)=>{
  return deleteAction(`/member/${ids}`)

}
