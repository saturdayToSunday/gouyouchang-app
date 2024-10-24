/// <reference types="vite/client" />
// 全局变量，接口
declare module "*.vue" {}  // 识别所有vue文件作模块
// 由于多处使用,将该接口从useUserStore中换到全局当中
interface UserStore{
    token:string;
    userInfo:UserInfo;
    address:string;
} 

interface UserInfo{
    id:string;
    name:string;
    password:string;
    photo:string|any[];
    sex:'男' | '女';
    address:string;
    birthday:string;
    phone:string;
    email:string;
    remark:string;
    userId:string;
}
type MenuList = {
    active:boolean;
    name:string;
    icon:string;
    path:string;
}
type VideosObject = {
    _id:string;
    name:string;
    comments:number;
    likes:number;
    src:string;
    isPlay:boolean;
}
type DMList = {
    id :number;
    txt :string;
    right: number;
    top: number
}
type CartObject ={
    userId:String,
    price:Number,
    time:String,
    count:Number,
    name:String,
    detailaddress:String,
    bgUrl:String,
    checked?=Boolean,
    ifPay:Number,
    _id:String
}
declare module 'crypto-js' 
declare module 'vue-qr'
