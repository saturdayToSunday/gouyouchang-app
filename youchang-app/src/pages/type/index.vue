<template>
    <div class="type-box" id="box">
         <div class="search">
            <van-button  round block style="height: 38px; line-height: 38px;border: none;">
                <i class="icon"></i>
                <van-swipe vertical
                    style="height: 38px;line-height: 38px;display: inline-block;vertical-align: middle;"
                    :autoplay="2000"
                    :touchable="false"
                    :show-indicators="false">
                    <van-swipe-item>做任务</van-swipe-item>
                    <van-swipe-item>抽大奖</van-swipe-item>
                </van-swipe>
            </van-button>
         </div>
         <div class="content" >
            <van-sidebar class="l" v-model="active">
                <van-sidebar-item class="item" v-for="it in list" :key="it" :title="it.title" @click="changeMenu(it._id)"/>
                <!-- <div class="item "></div> -->
            </van-sidebar>
            <div class="r" id="right" @scroll="scrollEvt">
                <div :id="it._id" v-for="it in list" :class="[it._id,'items']"  :key="it._id">
                    <div class="t">
                        {{it.title}}
                        <span class="hot">人气排行</span>
                    </div>
                    <div class="box">
                        <div class="item"
                            v-for="item in it.items"
                            >
                            <img class="icon" :src="item.path"/> 
                            <!-- 注意这里不要放img 为localhost开头的完整图片连接，使用/apis/www/imgupload/hd.webp格式 -->
                            <span class="txt">{{ item.txt}}</span> 
                        </div>
                    </div>
                </div>
            </div>
         </div>
         
    </div>
</template>
<script lang="ts" setup>
    import { ref ,onMounted} from 'vue';
    import{mainTypesApi,homeRecommendApi, uploadFileApi} from '../../apis/uesApi.ts';
    import{Sidebar,SidebarItem} from 'vant'
    type Items ={ 
        img:string; 
        path:string;
        txt:string;
        items:Object;
    }
    type MyItem ={path:string;txt:string};
    const list = ref<Array<Items>>([]);
    const menus = ref<string[]>({});
    const topList = ref({});
    const active = ref(0)
    let fileList =ref([]);
    let node:HTMLDivElement=ref();
    // let right :HTMLDivElement = document.getElementById('right') as HTMLDivElement;
    function scrollEvt(e){
        let div :HTMLDivElement = e.target as HTMLDivElement;
        let past = div.scrollTop; //滚动的距离
        let nodes= ref([]);
        console.log(past);
        topList.value.forEach((v,i)=>{
            if(past.value>topList[i].top){
                
            }

        })
        console.log(topList.value);    
    }
    // const useUserStore =
    function afterRead(obj:any) {
        console.log(obj,'1');
        console.log(typeof obj);
        const keys =Object.keys(obj)
        let fd = new FormData();
        if( keys.includes('0')){
            obj.forEach((v:any)=>{
            fd.append('file',v.file)
        })
        }else{
            fd.append('file',obj.file)
        }
        console.log(fd,'2');
        uploadFileApi(fd).then((d:any)=>{
            if(d.code == 1){
                console.log(d);
            }
        })
    }
    function changeMenu(id){
       node= document.getElementById(id) as HTMLDivElement;
       console.log(node);
       node.scrollIntoView({behavior:"smooth"})
    }
    onMounted((e)=>{
        console.log(list.value);
        mainTypesApi().then(d=>{
        // console.log(d,'---------');
        if(d.code == 1){
            list.value = d.data.map((it:Items)=>{
                it.items = it.items.map((it: MyItem) => {
                it.path = '/apis/' + it.path;
                return it;
            })
            return it;
            });
            console.log(list.value);
            setTimeout(()=>{
                topList.value = list.value.map((v,i)=>{
                let id = v._id;
                node= document.getElementById(id) as HTMLDivElement;
                let top = node.offsetTop;
                // dom节点的获取在monted生命周期有v-if/for则失败；添加timeout异步可以解决该问题；
                return {id,top}
                })
                console.log(topList.value);
                
            },1000)

        }
        })
    })


</script>
    @import "../../style/common.less";
    .type-box{
        .rel();
        > .search{
            height: 46px;
            background-color: @c6;
            padding: 4px 28px;
            .icon{
                display: inline-block;
                width: 38px;
                height: 38px;
                display: inline-block;
                background: url(../../images/search.png)  no-repeat center;
                background-size: 50% ;
                vertical-align: middle;
            }
        }
        > .content{
            .rel(calc(100% - 46px));
            display: flex;
            > .l{
                flex:1;
                height: 100%;
                line-height: 42px;
                font-size: .75rem;
                color: @g06;
                .item{
                    position: relative;
                    padding-left: 20px;
                   &.act{
                    color: @c6; 
                    background-color: @g01;
                    &:before{
                        position: absolute;
                        content: '';
                        width: 2px;
                        height: 16px;
                        left: 10px;
                        top: calc(50% - .4rem);
                        background-color: @c6;
                        // ba
                    }
                   }
                }
            }
            > .r{
                flex: 3;
                width: 0;// flex溢出处理
                height: 100%;
                overflow-x:0;
                background-color:white;
                padding:12px;
                > .items{
                    display: block;
                    position: relative;
                    > .t{
                        display: block;
                        overflow: hidden;
                        font-size: .75rem;
                        color: #111;
                        > .hot{
                            float: right;
                            font-size: .6rem;
                            color: @c6;
                        }
                    }
                    > .box{
                        display: flex;
                        flex-wrap: wrap;
                        > .item{
                            flex: 0 0 calc(100% / 3);
                            margin-bottom: 10px;
                            > .icon{
                                display: block;
                                margin: auto;
                                width: 68px;
                                height: 68px;
                            }
                            > .txt{
                                display: block;
                                text-align: center;
                                font-size: .6rem;

                            }
                        }
                    }
                }
            }
        }
    }
</style> -->
<style lang="less" scoped>
@import "../../style/common.less";

.type-box {
    .rel();
    > .search {
        height: 46px;
        background: @c6;
        padding: 4px 28px;
        .icon {
            display: inline-block;
            height: 38px;
            width: 38px;
            background: url(../../images/search.png) center center / 22px 22px no-repeat;
            vertical-align: middle;
        }
    }
    > .content {
        .rel(calc(100% - 46px));
        display: flex;
        > .l {
            flex: 0 0 93px;
            height: 100%;
            width: 0;
            overflow-x: hidden;
            .van-sidebar-item--select:before{
                background-color: @c6 ;
            }
        > .r {
            flex: 1;
            padding: 0 16px;
            width: 0; // flex溢出处理
            height: 100%;
            overflow-x: hidden;
            background: white;
            transition: all .25s linear;
            .items {
                display: block;
                position: relative;
                > .t {
                    display: block;
                    overflow: hidden;
                    font-size: .75rem;
                    color: #111;
                    line-height: 48px;
                    > .hot {
                        float: right;
                        font-size: .6rem;
                        color: @c6;
                    }
                }
                > .box {
                    display: flex;
                    flex-wrap: wrap;
                    > .item {
                        flex: 0 0 calc(100% / 3);
                        width: 0;
                        margin-bottom: 12px;
                        > .icon {
                            display: block;
                            margin: auto;
                            width: 68px;
                        }
                        > .txt {
                            display: block;
                            text-align: center;
                            font-size: .6rem;
                            line-height: 24px;
                            color: #999;
                        }
                    }
                }
            }
        }
    }
}
</style>
