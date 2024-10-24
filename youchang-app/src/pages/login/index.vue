<template>
    <div class="login-box">
        <div class="brand">
            购优偿
        </div>
        <div class="ipt">
            <input type="number" v-model="phone" placeholder="输入手机号">
        </div>
        <div class="ipt ipt2">
            <input type="text" v-model="code" placeholder="输入验证码">
            <span @click="getCode">{{msg}}</span>
        </div>
        <div class="check0">
            <div class="check ">
                <van-checkbox v-model="remember" checked-color="#ee0a24">记住手机号？</van-checkbox>
            </div>
            <div class="check ">
                <van-checkbox v-model="auto" checked-color="#ee0a24">同意免登录协议？</van-checkbox> 
            </div>
        </div>
        <van-button
        block 
        :loading="loading"  
        :disabled="!canLogin"
        loading-text="登陆中..."
        @click ="loginEvt"
        color="linear-gradient(to right, #f5222d, #a8071a)">
            登录
        </van-button>
        <div class="check">
            <van-checkbox v-model="agree" checked-color="#ee0a24">同意购优偿使用协议？</van-checkbox>
        </div>
        <div class="reg-btn" @click="$router.push('/register')">去注册？</div>
        <div class="right-info">致迈协创软件技术支持 &copy; 2023~</div>
    </div>
</template>

<script lang="ts" setup>
    import{ref,Ref,computed} from 'vue';
    import{encodeApi, isPhone} from '../../utils/index.ts';
    import{getCodeApi,loginApi} from '../../apis/uesApi.ts';
    import { showToast } from 'vant';
    import useUserStore from '../../store/useUserStore';
    import { nextTick } from 'vue';
    import { useRouter } from 'vue-router';
    import { onMounted } from 'vue';
    
    const checked:Ref<boolean> = ref(false);
    const loading:Ref<boolean> = ref(false);
    const phone = ref<string>('')
    const code = ref<string>('')
    const msg = ref<string>('获取验证码')// 默认状态
    const timer = ref<any>()
    const remember :Ref<boolean> = ref(false);
    const auto :Ref<boolean> = ref(false);
    const agree :Ref<boolean> = ref(false);
    const store =useUserStore();
    const router = useRouter();
    function tiaozhuan(){
        router.push('/home')
    }
    const canLogin = computed<boolean>(function(){
        // 正常：
        return isPhone(phone.value) && /^[0-9]{4}$/.test(code.value)
    })
    onMounted(function(){
        let _phone = localStorage.getItem('my-phone')
        if(_phone){
            remember.value = true
            phone.value = _phone
        }
    })
    async function getCode(){
        // 1. 检验手机号正确,并节流，
        // 1.1 连续点击则会显示获取中；将控制台调整慢一点slow 3g
        if(msg.value !=='获取验证码') return;
        // 2. 调用获取验证码的方法；
        if(!isPhone(phone.value)){
            showToast('请输入正确的手机号码')
            return
        }
        msg.value = '获取中...'
        let result = await getCodeApi(phone.value)
        console.log(result);
        if(result.code===1){
            console.log(result.data);
            showToast(result.data.code)
            let t= 0;
            msg.value = `重新获取（58s）`
            timer.value = setInterval(function(){
                t++;
                msg.value = `重新获取（${60-t}s)`
            },1000)
        }else{
            // 查询成功后才可正常继续点击验证码；
            msg.value ='获取验证码'
        }
    }   
    async function loginEvt(){
        loading.value = true;
        let _code = code.value * 1;
        let result = await loginApi({phone:phone.value,code:_code})
        // 
        console.log(result)
        loading.value = false;
        if(result.code!==1){
            showToast('登陆错误'+result.msg)
            return
        }

        showToast('登陆成功')
        // 第一次勾选了记住，则代码会缓存到本地
        // 第二次未勾选，则代码会清除
        if(remember.value){
            localStorage.setItem('my-phone',phone.value)
            console.log(remember.value);
        }else{
            localStorage.removeItem('my-phone')
            console.log(remember.value);
        }
        if(auto.value){
            localStorage.setItem('my-token',result.data.token)
        }else{
            localStorage.removeItem('my-token')
        }
        console.log(result.data);
        store.setUserInfo(result.data);
        console.log(store.myUserInfo);
        store.token = result.data.token; 
        sessionStorage.setItem('token-info', encodeApi(result.data.token + '--' +  Date.now()))
        // debugger
        router.push('/home')
    }
</script>

<style lang="less" scoped> 
    @import "../../style/common.less";
    .login-box{
        .rel();
        padding: 20vh 1rem 0;
        .brand{
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
                    background: url(../../images/youchanglogo.png) center center/1.5rem 1.5rem no-repeat;
                }
        }
        >.ipt{
            display: flex;
            line-height: 1.8rem;
            padding: 10px 0;
            border-bottom: 1px solid  @g05;
            margin:1rem 0;
        //     font-size:0.9rem;
        //     color:@g06;
            > input{
                flex: 1;
                border:none;
                outline:none;
                background: transparent;
                font-size: .9rem;
                letter-spacing: 1px;
                text-align: left;
                text-indent: 1.5em;
                color: @c7;
                &::webkit-input-placeholder{
                    // font-size: .6rem;
                    // color: @c6;
                }
            }
        }
        >.ipt2{
            >span{
                color: @g06;
                font-size: .7rem;
                text-align: center;
            }
        }
        > .check0{
            margin: 1.2rem 0 5rem  0;
        }
        .check{
            font-size: .65rem;
            margin: 1.5rem 0;  
        }

    }
    .reg-btn{
        display: block;
        height: 2rem;
        text-align: right;
        line-height: 2rem;
        font-size: 0.65rem;
        color: @c6;
    }
</style>