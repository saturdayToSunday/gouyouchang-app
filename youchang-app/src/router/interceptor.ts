import useUserStore from "../store/useUserStore";
import { decodeApi } from "../utils";

function intercepter(to:any,from:any,next:any){
    console.log(to,'zhelishitoxiaokeai');
    if(to.meta.needAuth){
        let token = useUserStore().token;
        let _token = sessionStorage.getItem('token-info')
        console.log(_token,!_token);
        
        if(!_token){
            console.log('没获取到了token');
            next('/')
        }else{
            console.log('获取到token');
        
            let str: string[] = decodeApi(_token).split('--')
            if(Date.now()-((str[1] as any)  * 1) > 2 *60 *60*1000){
                console.log(Date.now()-((str[1] as any)  * 1));
                next('/')
            }else{
                if(token == str[0]){
                    next()
                }else{
                    // 未登录
                    next('/login')
                }
            }
        }
    }else{
        next()
    }
    
}
export default intercepter
