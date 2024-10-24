import {AES,enc} from 'crypto-js'
const key = 'youchang0key0sec'

// 将解密加密以及字符集单独开辟一个工具类;
export function encodeApi(msg:string) : string{
    return AES.encrypt(msg,key).toString()
}
// 第二个参数类似于密钥;
// 强行破解需要数据库对撞,或加密只有一层,银行卡密码,因此不要使用生日密码;
export function decodeApi(msg:string):string{
    // debugger
    console.log(msg+'');
    
    // msg = (msg+'').replace(/\n*$/g, '').replace(/\n/g, '');//) 将换行符替换为空否则会报错;
    return AES.decrypt(msg,key).toString(enc.Utf8)
}
// 注意密钥需要与加密保持一致;
export function isPhone(v:any){
    return /1\d{10}/.test(v)
}
