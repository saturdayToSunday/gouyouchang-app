import Axios from './ajax.ts'
import ajax from './ajax.ts'
export function funcIconsApi(){
    return ajax({url:'me/func/icons'})

}
export function uploadFileApi(data:FormData){

    return ajax({
        url:'api/upload/complate',
        data,
        method:'POST'
    })
}
// 我的api
export function userApi(data:any){
    return ajax({
        url:'/api/users',
        method:'POST',
        data
    })
}
export function videosApi(data:any){
    return ajax({
        url:'api/videos',
        method:'POST',
        data
    })
}
export function getApi(){ 
    return ajax({
        url:'/api',
    })
}
export function registerApi(data:any){
    return ajax({
        url:'/api/register',
        data,
        method:'POST',
    })
}
// 获取验证码的接口
export function getCodeApi(phone:string){
    return ajax({
        url:'/api/get/code',
        data:{phone},
        method:'POST'
    })
    // 需求文档中标识了参数传参选择请求体，
}
export function loginApi(data:any){
    return ajax({
        url:'/api/login/byphone',
        data,
        method:'POST'
    })
}

export function autoLoginApi(){
    return ajax({
        url:'/api/auto/login',
        method:'POST'
    })
}

export const homeTypeApi = ()=>ajax({url:'api/home/type'})
export const homeRecommendApi = (params:any)=>ajax({url:'api/home/recommend',params})
// 分类页面接口;
export const mainTypesApi =()=>ajax({url:'api/maintypes/list'})
export const videosListApi=()=>ajax({ url:'/api/videos/list'})
export function cartAddApi(data:CartObject){
    return ajax({
        url:'api/cart/add',
        method:'POST',
        data
    })
}
export const cartListApi = (uid:string) =>ajax({url:'api/cart/list/'+uid})
// 修改购物车商品数量接口：userId,id,count;
export function cartModifyApi(data:any){
    return ajax({
        url:'api/cart/modify',
        method:'POST',
        data
    })
}
// 删除购物车列表接口；userId ids:['string']
export function cartDeleteApi(data:any){
    return ajax({
        url:'api/cart/delete',
        method:'DELETE',
        data
    })
}
// order/add 提交订单
export function orderAddApi(data : any){
    return ajax({
        url:'api/order/add',
        method:'POST',
        data
    })
}
// order/delete 删除订单
export function orderDeleteApi(data:any){
    return ajax({
        url:'api/order/delete',
        method:'DELETE',
        data
    })
}
// order/list 获取订单列表
export const orderListApi = (uid:string) =>ajax({url:'api/order/list/'+uid})
// 添加地址接口 /address/add
export function addressAddApi(data:any){
    return ajax({
        url:'api/address/add',
        method:'POST',
        data
    })
}
// 修改收获地址接口 /address/modify
export function addressModifyApi(data:any){
    return ajax({
        url:'api/address/modify',
        method:'POST',
        data
    })
}
// 删除收货地址接口  /address/{userid}/{id}
export function addressDeleteApi(data:any){
    return ajax({
        url:'api/address/delete',
        method:'DELETE',
        data
    })
}
// 获取用户收货地址接口/address/{userid} 动态id；
export function addressListApi(uid:string){
    return ajax({
        url:'api/address/list/'+uid,
    })
}