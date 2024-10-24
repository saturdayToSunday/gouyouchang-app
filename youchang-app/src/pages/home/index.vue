<template>
    <div class="home-box">
        <van-nav-bar title="购优偿"/>
        <div class="content" @scroll="scrollEvt">
            <div class="search">搜一搜</div>
            <div class="menu">
                <div class="item" v-for="it in menuList" :key="it.pimg">
                    <img class="icon" :src="it.pimg"/>
                    <!-- <img class="icon" :src="it.pimg"></img> -->
                    <div class="txt">{{it.txt}}</div>
                </div>
            </div>
            <div class="items">
                <div class="item"  v-for="it in list" :key="it._id">
                    <img :src="it.path" alt="">
                    <div class="t">{{ it.title }}</div>
                    <div class="tag">
                        <!-- <span v-for="t in it.tag" :key="t">{{ t }}</span> -->
                        <span  :key="it._id" v-for="v in it.tag">{{ v }}</span>
                    </div>
                    <div class="price">
                        ￥ <em>{{ it.price }}</em>
                        <i class="add-card" @click="addToCart(it)"></i>
                    </div>
                </div>
            </div>

            <div class="loading-txt">
                <span v-if="loading">加载中...</span>
                <span v-else-if="hasMore">上滑加载更多数据</span>
                <span v-else>没有更多数据</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import dayjs from 'dayjs'
    import { ref } from 'vue';
    import { homeTypeApi, homeRecommendApi,cartAddApi } from '../../apis/uesApi' 
    import { onMounted } from 'vue';
    import useUserStore from '../../store/useUserStore';
    import { showToast } from 'vant';
    const menuList = ref<{txt:string;pimg:string}[]>([]);
    const list = ref<any[]>([])
    // 默认进入页面立即加载，并且有更多数据，因此为真
    const hasMore =ref<boolean>(true)
    const loading =ref<boolean>(true)
    const pagenum = ref<number>(1);
    const user = useUserStore().userInfo;
    const store = useUserStore()
    console.log(store.token,user,'******');

    homeTypeApi().then(d =>{
        console.log(d);
        if(d.code === 1)menuList.value = d.data.map((it:any)=>{it.pimg=it.img;return it})
        menuList.value.forEach(v=>{console.log(v,v.pimg)})
        console.log(menuList.value);
        
    });
    onMounted(function(){
        getList();
    })
    function getList(){
        homeRecommendApi({pagesize:4,pagenum:pagenum.value}).then(
            d=>{
                console.log(d,'+++++++');
                if(d.code === 1){
                    console.log(list.value,'1');
                    console.log(d.data,'2');
                    let tagList = [];
                    d.data.forEach((e:any)=>{
                        e.count = 1;
                        console.log(e);     
                    })
                    d.data.forEach((e:any,i:number)=> {
                        // e.tag
                        e.tag = e.tag.split(',');
                        e.tag
                        console.log(e.tag,i);
                    });

                    list.value = [...list.value,...d.data]
                    console.log(list.value);
                    
                };
            }

        )
        loading.value=false;
    }

    function scrollEvt(e:PointerEvent){
        // 指针事件，鼠标事件类似将鼠标，触摸，触控笔三种事件的整合
        let div: HTMLDivElement = e.target as HTMLDivElement;
        console.log(div.clientHeight,div.scrollTop,div.scrollHeight,div);
        let hasToBotton: boolean = div.scrollHeight -80 <(div.clientHeight + div.scrollTop)
        console.log(hasToBotton);//false 
        // 整个除开头与导航的高度-尾部提示文字 < 内容可视高度 + 顶部滚过的高度；
        if(hasMore.value && !loading.value && hasToBotton){/
            // 此处开启节流；
            loading.value = true;
            pagenum.value += 1;
            console.log(pagenum.value+'当前页数节流');
            // 加载数据
            getList();
        }
    }
    function addToCart(it:any){
        // 引入插件day.js 轻量级JavaScript 日期库；
        console.log(it.count,it);
        
        cartAddApi({
            userId:user.userId,
            price:it.price,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            count:it.count,
            name:it.title,
            detailaddress:'',
            bgUrl:it.path,
            ifPay:0,

        }).then(d =>{
            if(d.code == 1){
                showToast('添加成功');
            }
        })
    }
</script>
<style lang="less" scoped>
    @import '../../style/common.less';
    .home-box{
        .rel();
        >.content{
            .rel(calc( 100% - 46px ));
            // 注意calc的格式，写错不生效
            padding-top: 16px;
        }
    }
    .search{
        height: 40px;
        margin: 0 16px 16px;
        text-align: center;
        font-size: .7rem;
        line-height: 40px;
        border-radius: 20px;
        background: @g05;
        &::before{
            content: '';
            display: inline-block;
            vertical-align: bottom;
            width: 40px;
            height: 40px;
            background:url( ../../images/search.png) center center / 20px 20px no-repeat;
        }
    }
    .menu {
        display: flex;
        flex-wrap: wrap;
        > .item{
            flex:  0 0 25%;
            @h : 48px;
            margin-bottom: 14px;
            >.icon{
                display: block;
                width: @h;
                height: @h;
                margin: auto;
                border-radius: 50%;
            }
            >.txt{
                display: block;
                text-align: center;
                font-size: .6rem;
                color: #999;
                line-height: 40px;
                // border-radius: ;
            }
        }
    }
    .items {
        display: flex;
        flex-wrap: wrap;
        padding: 8px 10px 16px;
        >.item{
            flex: 0 0 calc(50% - 12px);
            // height: ;
            // 按照最高的盒子设置
            margin: 0 6px 12px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow:  0 0 10px rgba(0,0,0,.08);
            >img{
            display: block;
            width: 100%;
        }
        > .t{
            padding: 6px 12px 3px 12px;
            font-size:  .7rem;
            font-weight: 600;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        > .tag{
            padding: 0 12px;
            overflow: hidden;
            height: 29px;
            >span{
                display: inline-block;
                vertical-align: middle;
                font-size: .5rem;
                border:  solid 0.025rem #f00;
                color: @c6;
                padding: 2px 3px;
                border-radius: 3px;
                margin-bottom: 10px;
                margin-right: 10px;
            }
        }
        > .price{
            font-size: .6rem;
            color: @c6;
            padding: 0 12px;
            position: relative;
            >em{
                font-size: 1rem;
                font-style: normal;
            }
        }
        }
        
    }
    .loading-txt{
        display: block;
        padding-bottom: 16px;
        >span{
            display: block;
            text-align: center;
            font-size: .5rem;
            color: @g06;
        }
    }
    .add-card{
        display: block;
        position: absolute;
        top: 0;
        right: 1rem;
        width: 1rem;
        height: 1rem;
        background: url(../../images/add-cart.png) no-repeat;
        background-size: 1rem 1rem;
    }
    
</style>