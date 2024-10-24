<template>
    <div class="page-layout">
       <main>
        <!-- 首页、分类页面放置位置， -->
            <router-view></router-view>
       </main>
       <div class="my-tabs">
           <div v-for="it in menu" :class="{active:it.active}" :key="it.path" @click="$router.push(it.path)" >
               <i :class="['icon',it.icon]"></i>
               <span>
                   {{it.name}}
               </span>
           </div>
       </div>
    </div>
</template>
<script setup lang="ts">
import { ComputedRef,computed } from 'vue';
import {useRoute} from 'vue-router';
const route =useRoute();
    const menu:ComputedRef<Array<MenuList> >= computed(function(){
        return[
        {active:true,name:'首页',icon:'home',path:'/home'},
        {active:false,name:'分类',icon:'type',path:'/type'},
        {active:false,name:'视频',icon:'videos',path:'/videos'},
        {active:false,name:'购物车',icon:'cart',path:'/cart'},
        {active:false,name:'我的',icon:'me',path:'/me'},
    ].map((it : MenuList) =>{
        it.active = it.path === route.path;
        return it
        })
    })
</script>
<style lang="less" scoped>

@import '../style/common.less';
        .page-layout{
        .rel();
        >main{
            .rel(calc(100% - 50px));
        }
        >.my-tabs{
            display: flex;
            height: 50px;
            background-color: @g01;
            border-top: 1px solid #ddd;
            >div{
                flex: 1;
                padding: 6px 0;
                >.icon{
                     display: block;
                     position: relative;
                     width: 26px;
                     height:26px;
                     margin: auto auto 4px;
                     background-position: center;
                     background-size: 22px;
                     background-repeat: no-repeat;
                    //  & 这个符号表示同级；
                     &.home{
                        background-image: url(../images/bars/home-def.png);
                     }
                     &.type{
                        background-image: url(../images/bars/type-def.png);
                     }
                     &.videos{
                        background-image: url(../images/bars/videos-def.png);
                     }
                     &.cart{
                        background-image: url(../images/bars/cart-def.png);
                     }
                     &.me{
                        background-image: url(../images/bars/me-def.png);
                     }
                }
                >span{
                    display: block;
                    text-align: center;
                    color: #999;
                    font-size: .5rem;
                    height: 12px;

                }

                &.active{
                    >.icon{
                    //  & 这个符号表示同级；
                     &.home{
                        background-image: url(../images/bars/home.png);
                     }
                     &.type{
                        background-image: url(../images/bars/type.png);
                     }
                     &.videos{
                        background-image: url(../images/bars/videos.png);
                     }
                     &.cart{
                        background-image: url(../images/bars/cart.png);
                     }
                     &.me{
                        background-image: url(../images/bars/me.png);
                     }
                }
                >span{
                    color:  @c7;

                }
                }
            }
        }
    }
</style>