
<template>
    <div class="order_box">
        <van-nav-bar title="我的订单" @click-left="$router.go(-1)" left-arrow/>
        <div class="order_content">
            <van-card
                v-for="it in orderList"
                class="order_item"
                :num="it.count"
                :desc=it.time
                :price="it.price.toFixed(2)"
                :title="it.name"
                :thumb="it.bgUrl"
                >
                <template #footer>
                    <div class="sum">
                        实付款: <sub>￥</sub><i class="sumPrice">{{it.sumPrice}}</i> 
                    </div>
                    <div class="eventBtn">
                        <button class="delBtn item_btn" @click="deleteOrder(it)">删除订单</button>
                        <button class="addBtn item_btn" @click="addToCart(it)">再来一单</button>
                    </div>
                </template>
            </van-card>
    </div>
    </div>

</template>
<script setup lang="ts">
// import {cartListApi,cartDeleteApi, cartModifyApi,orderAddApi} from '../../apis/uesApi.ts'

import dayjs from 'dayjs'
import {ref} from 'vue';
import {orderListApi,cartAddApi,orderDeleteApi} from '../../apis/uesApi.ts'
import useUserStore from '../../store/useUserStore' 
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
const router = useRouter();
const user = useUserStore().userInfo; 
console.log(user);
const orderList= ref([]);
getList()
function getList(){
    orderListApi(user.userId).then(d=>{
        if(d.code ==1){
            console.log(d.data);
            orderList.value = d.data.map((item:any)=>{
                item.sumPrice = item.count *item.price;
                return item
            })
        }
        console.log(orderList.value);
    })
}
function deleteOrder(it:any){
    orderDeleteApi({
                userId:user.id,
                it
    }).then(d=>console.log(d))
    async function deleteTxt(){
      await getList(),
      await showToast('删除成功')
    }
    deleteTxt()
}
function addToCart(it:any){
        // 引入插件day.js 轻量级JavaScript 日期库；
        // yarn add dayjs;=> cnpm add dayjs --save;
        console.log(it.count,it);
        let obj ={
            userId:user.userId,
            price:it.price,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            count:1,
            name:it.name,
            detailaddress:'',
            bgUrl:it.bgUrl,
            ifPay:0,
        };
        cartAddApi(obj).then(d =>{
            if(d.code == 1){
                showToast('添加成功');
                console.log(d.data);
                router.push('/cart')             
            }else if(d.code ==0){
                showToast('购物车已存在此商品')
                router.push('/cart')
            }
        })
    }
</script>
<style lang="less" scoped>
        @import '../../style/common.less';
    .order_box{
            .rel();
            >.order_content{
                display: block;
                height: calc( 100% - 46px );
                overflow-x: hidden;
                .order_item{
                    margin:.5rem;
                    background-color: white;
                    border-radius: .5rem ;
                    :deep(.van-card__content){
                        margin-top: .5rem;
                        justify-content: space-around;
                    }
                    :deep(.van-card__thumb){
                        margin-top: .5rem;
                    }
                    // 下单时间样式穿透
                    :deep(.van-card__desc){
                            margin-top: .2rem;
                        }
                    .sum{
                        margin-bottom: .6rem;
                        font: normal 700 .5rem/1rem 'Microsoft yahei';
                        .sumPrice{
                            font-size: .9rem;
                            font-style: normal ;
                        }
                    };
                    .eventBtn{
                        display: flex;
                        justify-content: end;
                        margin-bottom: .3rem;
                    .item_btn{
                        margin-left: .8rem;
                        display: block;
                        padding: .2rem 1rem;
                        background-color: white;
                        border: 1px solid @g06;
                        border-radius: .5rem ;
                    };
                    .addBtn{
                        color: @c5;
                        border:1px solid @c5;
                        }
                    }
                }
            }
        }
</style>