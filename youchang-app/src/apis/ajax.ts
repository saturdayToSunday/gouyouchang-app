// 封装一个ajax库,引入数据类型;
import axios,{InternalAxiosRequestConfig} from 'axios'
import useUserStore from '../store/useUserStore';

const Axios = axios.create({
    baseURL:'/apis'
})
///////
Axios.interceptors.request.use(function(config: InternalAxiosRequestConfig){
    // debugger;
    config.headers.token = useUserStore().token;
    config.headers.Authorization ='bearer '+useUserStore().token
    console.log(config.headers,'注意看axios拦截的部分');
    console.log(config.headers.token,'1111111');
    
    return config; 

    return Promise.resolve({code:200,message:'success'} as any)
})
type Req ={
    url:string;
    data?:any;
    params?:any;
    method?:'POST' | 'DELETE' | 'PUT';
}
export default function ajax(req:Req):Promise<{code:number;message:string;data?:any;msg?:string}>{
    return new Promise(resolve=>{
        Axios.request({
        url:req.url,
        params:req.params || {},
        data:req.data || {},
        method:req.method || 'GET'
        }).then(d=>{
            resolve(d.data)
        }).catch(e=>{
            resolve(e)
        })
    })
}