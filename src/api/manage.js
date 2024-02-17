import axios from "@/utils/request";


// 对每种请求进行封装，用于发送请求时添加一些重要标识
// get请求
export function getAction(url,data){
    // 请求头

    return axios({
        method:'get',
        url:url,
        params:data,

    })
}

// post请求
export function postAction(url,data){

    return axios({
        method:'post',
        url,
        data,
    })
}

// put请求
export function putAction(url,data){
    
    return axios({
        method:'put',
        url,
        data,
    })
}

// http请求
export function httpAction(url,data){
    
    return axios({
        method:'http',
        url,
        data,
    })
}

//delete请求
export function deleteAction(url,data){
    
    return axios({
        method:'delete',
        url:url,
        params:data
    })
}
