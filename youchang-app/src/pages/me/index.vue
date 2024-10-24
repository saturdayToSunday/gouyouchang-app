<template>
    <div class="me-box">
        <van-nav-bar title="我的"/>
        <div class="me-content">
            <van-row class="me-line1">
                <van-col span="6">
                    <van-image
                        round
                        width="4rem"
                        height="4rem"
                        :src=headPic
                        />
                </van-col>
                <van-col span="12" class="uMsg">
                    <div class="uName">
                        欢迎&nbsp;<span>{{user.name}}</span>&nbsp;登录
                    </div>
                    <div class="uAddress" @click="router.push('/address')">
                        <i class="icon"></i> 收货地址
                    </div>
                </van-col>
                <van-col span="6" class="uErweima">
                    <!-- <i class="sao"></i> -->
                </van-col>
            </van-row>
            <van-cell-group inset class="me-line2">
                <van-cell title="我的订单" value="全部 >" @click="router.push('/myorder')"/>
                <!-- <van-cell title="待付款" value="内容" label="描述信息" /> -->
                <!-- <van-cell title="待发货" value="内容" label="描述信息" /> -->
                <!-- <van-cell title="待评价" value="内容" label="描述信息" /> -->
            </van-cell-group>
            <van-cell-group inset class="me-line3">
                <!-- <van-cell title="我的收藏" value="内容" /> -->
                <van-cell title="地图" value="展开 >"  @click="router.push('/detailaddress')"/>
            </van-cell-group>
            <van-cell-group inset class="me-line3">
                <van-cell title="设置" />
                <van-cell title="个人信息" @click="router.push('/umsg')"/>
                <!-- <van-cell>
                        <vueqr
                        text="https://www.baidu.com/"
                        :size="200"
                        colorDark="#EE6779"
                        colorLight ="#F5E1D9"
                        ></vueqr>
                </van-cell> -->
                <van-cell>
                    <van-button round type="danger" class="logoutBtn" @click="logoutEvt">退出登录</van-button>
                </van-cell>
            </van-cell-group>
        </div>

    </div>
</template>
<script setup>
    import vueqr from 'vue-qr/src/packages/vue-qr.vue'
    import {useRouter} from 'vue-router';
    import useUserStore from '../../store/useUserStore';
    import {funcIconsApi} from '../../apis/uesApi.ts'
    import { showConfirmDialog,showToast } from 'vant';

    const router = useRouter();
    const user = useUserStore().userInfo;
    const store = useUserStore();

    console.log(store,user);
    let headPic= '/apis/'+ user.photo;
    console.log(headPic);
    function logoutEvt(){
        showConfirmDialog({
                title:'确认退出登录？',
                message:
                    '用户信息将会保存'
            }).then(()=>{
                router.push('/login')
            })
    }
</script>
<style lang="less" scoped>  
    @import '../../style/common.less';
    .me-box{
            .rel();
            >.me-content{
                .rel(calc( 100% - 46px ));
                display: flex;
                flex-direction: column;
                justify-content:flex-start;
                >*{
                    margin-top:1rem;
                }
            }    
        }
            .me-line1{
                padding: 1rem 0 0 1rem;
                font: normal 16px/16px 'Microsoft yahei';
                .uMsg{
                    .uName{
                    margin-top: 1.5rem;
                        >span{
                        font-weight: bold;
                        }
                    };
                .uAddress{
                    position: relative;
                    padding-left: .8rem;
                    font: normal 11px/34px 'Microsoft yahei';
                    color: @g06;
                    .icon{
                        display: block;
                        position: absolute;
                        left: 0;
                        width: 16px;
                        height:34px;
                        background-position: center;
                        background-size: 16px;
                        background-repeat: no-repeat;
                        background-image: url(../../images/addresss.png);
                    }
                    } 
                }
                .uErweima{
                    position: relative;
                    .sao{
                        display: block;
                        position: absolute;
                        right: 1rem;
                        top: 1.5rem;
                        width: 1rem;
                        height: 1rem;
                        background-position: center;
                        background-size: 1rem;
                        background-repeat: no-repeat;
                        background-image: url(../../images/sao.png);
                    }
                }
                


            }
            .me-line2{
            }
            .me-line3{
                :deep(.logoutBtn){
                    background-color: @c6;
                    display: block;
                    width: 100%;
                }
            }
          

</style>