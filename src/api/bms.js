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

//获取商品列表多条件查询
export const getGoodsList= (pageNum,pageSize,searchText)=>{
  let data={
    pageNum,
    pageSize,
    searchText
  }
  return getAction('/goods/list',data)
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
//上架商品
export const putPutGood = (id)=>{
  return putAction(`/goods/put/${id}`)
}
//下架商品
export const putRemoveGood = (id)=>{
  return putAction(`/goods/removed/${id}`)
}

//获取全部商品
export const getAllGoods =()=>{
  return getAction("/goods/statistic");
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


/* 订单管理 */
//获取订单列表条件查询
export const getOrderListApi =(pageNum,pageSize,orderState,searchText) =>{
  let data={
    pageNum,
    pageSize,
    orderState,
    searchText
  }
  return getAction("/member/order/list",data)
}
//获取所有订单列表
export const getOrderListAllApi =()=>{
  return getAction("/member/order/list/all")
}
//取消订单
export const cancelOrderApi = (id)=>{
  let data ={
    id,
    cancelReason:"管理员取消"
  }

  return putAction(`/member/order/${id}/cancel`,data)
}
//删除订单
export const deleteOrderApi = (ids)=>{
  let data={
    ids
  }
  return deleteAction("/member/order",data)
}

//发货
export const getConsignmentApi =(id)=>{
  return getAction(`/member/order/consignment/${id}`)
}
//退款退货
export const confirmRefundApi = (id)=>{
  return putAction(`/member/order/${id}/confirmReject`)
}

//二手回收相关
//管理员同意回收
export const confrimRecycleApi =(id)=>{
  return putAction(`/recycle/${id}/admin/confirm`)
}

//管理员改变回收价格
export const changeEvaluateApi = (id,evaluate)=>{
  let data = {
    id,
    evaluate
  }
  return postAction("/recycle/changeEvaluate",data)
}
//二手回收订单条件分页查询
export const getRecycle=(page,pageSize,state,searchText)=>{
  let data={
    page,
    pageSize,
    state,
    searchText
  }
  return getAction("/recycle/admin",data)
}
//删除二手回收订单
export const delRecycleApi=(id)=>{
  return deleteAction(`/recycle/${id}`)
}
//取消二手回收订单
export const candelRecycleApi = (id)=>{
  return putAction(`/recycle/${id}`)
}

/* 设置 */

//获取所有轮播图
export const getBannerApi =()=>{
  return getAction("/home/banner/all")
}
//修改和新增轮播图
export const putBannerApi =(data)=>{
  return putAction("/home/banner",data)
}


//删除轮播图
export const deleteBannerApi = (ids)=>{
  return deleteAction(`/home/banner/${ids}`)
}