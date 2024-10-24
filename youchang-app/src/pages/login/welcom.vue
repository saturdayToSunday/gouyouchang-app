<template>
    <div class="welcome-cls">
        <van-circle
            class="my-circle"
            v-model:current-rate="currentRate"
            :clockwise="false"
            :rate="rate"
            size="56px"
            color="#d81e06"
            :text="Math.ceil(currentRate/20)+'s'"
            @click="toPage"
         />
         <div class="brand">购优偿</div>
         <div class="txt">
            购优质商品，优质服务，优财支付，优财生活，<br>优财尽在“优偿”！
         </div>
         <div class="right-info">
            致迈协创技术支持 &copy; 2023~
        </div>
    </div>

</template>
<script setup lang="ts">
    // 需要定义
    import { onMounted,ref } from 'vue';
    import {autoLoginApi} from  '../../apis/uesApi';
    import useUserStore from '../../store/useUserStore';
    import { useRouter } from 'vue-router';
    import { encodeApi } from '../../utils';
    const currentRate = ref<number>(100)
    const flag = ref<string>('正在登录')
    // 5s 100个进度归零 100s/5 = 20进度/s 1000ms/20进度=50
    const rate = ref(100)
    const store =useUserStore();
    const router = useRouter();
    const timer = ref<number>(0);
     onMounted(function(){
       timer.value =  setInterval(function(){
            currentRate.value --;
            if(currentRate.value<1){
                clearInterval(timer.value)
                if(flag.value === '登录成功'){
                    router.push('/home')
                }else{
                    router.push('/login')
                }
            }
        },50)
        let token = localStorage.getItem('my-token');
        console.log(token,'可以调用免登录接口');
        
        if(token){
            console.log(token,'调用免登录接口');
            // 0.1 token存到pinia
            // 1. 存进去之后调用免登录接口
            // 1.1 接口调用拦截器，拦截器
            // 0.2 拦截器将数据token加上
            store.token = token;
            // 1. 调用免登录接口：
            autoLoginApi().then(d=>{
                console.log(d.data+'调用免登录的结果');
                if(d.code ===1){
                    store.setUserInfo(d.data);
                    store.token = d.data.token;
                    localStorage.setItem('my-token',d.data.token)
                    sessionStorage.setItem('token-info',encodeApi(d.data.token + '--'+Date.now()))
                    flag.value = '登录成功'
                }else{
                    flag.value = '登录失败'
                }
            })
        }else{
            flag.value = '登录失败'
        }
    }) 
        // 免登录请求没有完成，点击跳转不会生效；
    function toPage(){
        if(flag.value === '正在登录') return;
        clearInterval(timer.value)// 倒计时没有到才能够点击到关闭并跳转，时间到了自己就跳转了
        if(flag.value === '登录成功'){
            router.push('/home')
        }else{
            router.push('/login')
        }
    }
</script>
<style lang="less" scoped>
// 添加：制作样式穿透；
    @import "../../style/common.less";
    .welcome-cls{
            .rel();
            padding-top: 20vh;
            >.brand{
                display: block;
                text-align: center;
                font-size: 1.2rem;
                line-height: 40px;
                height: 40px;
                color: @c6;
                &::before{
                    content: '';
                    display: inline-block;
                    vertical-align: bottom;
                    width: 40px;
                    height: 40px;
                    margin-right: 1vh;
                    background: url(../../images/youchanglogo.png) center center/100% 100% no-repeat;
                }
            }
            > .txt{
                // width: 60%;
                display: block;
                text-align: center;
                font-size: .65rem;
                font-family:'Microsoft yahei';
                line-height:'0.7rem';
                color:@c6;
                margin-top:2vh;
            }
        }
    .my-circle{
        display: block;
        position: absolute;
        top: 1vh;
        right: 1vh;
        :deep(.van-circle__text){
            color: @c6;
        }
    }
    
</style>