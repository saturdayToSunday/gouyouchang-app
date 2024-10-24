<template>
    <div class="videos-box">
        <div class="search">
            <van-button  round block style="height: 38px; line-height: 38px;border: none;">
                <i class="icon"></i>
                <van-swipe vertical
                    style="height: 38px;line-height: 38px;display: inline-block;vertical-align: middle;"
                    :autoplay="2000"
                    :touchable="false"
                    :show-indicators="false">
                    <van-swipe-item>海洋</van-swipe-item>
                    <van-swipe-item>鱼群</van-swipe-item>
                </van-swipe>
            </van-button>
         </div>
         <div class="content" ref="node">
            <van-swipe style="height: 100%;" 
                :show-indicators="false"
                vertical
                @change="changeEvt">
                <van-swipe-item v-for="it in list" :key="it._id">
                     <div class="my-item" @click="playEvt(it._id)">
                        <video :src="it.src" :id="it._id" :muted="it.isPlay"></video>
                        <div :class="['my-btn', it.isPlay && 'act']" ></div> 
                        <div class="dm-btn" @click="show=true">发送弹幕</div>
                        <span class="dm-txt" 
                            v-for="it in dmList"
                            :style="{ top:it.top+'px', right:it.right+'px'}"
                            :key="it.id"
                        >{{ it.txt }}</span>
                    </div> 
                </van-swipe-item>
            </van-swipe>

         </div>
    </div>
    <!-- 弹出框写在最外层： -->
    <van-dialog 
        v-model:show="show" 
        title="发送弹幕" 
        show-cancel-button 
        class="dm-box"
        @confirm="sendEvt">
        <input v-model="dmTxt" type="text"  placeholder="输入弹幕信息" class="dm-ipt clearfix">
    </van-dialog>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import {userApi,getApi,videosApi,videosListApi} from '../../apis/uesApi.ts'
import {ref,reactive,Ref}from 'vue';
import { onBeforeMount } from 'vue';
import { onBeforeUnmount } from 'vue';
const show = ref<boolean>(false);
const list = ref<VideosObject[]>([])
// const isPlay = ref<boolean>(false);
const dmList : Ref<DMList[]> = ref([]);
const dmTxt :Ref<string>=ref('');
const node: Ref<HTMLDivElement|undefined> = ref()
videosListApi().then(res=>{
    console.log(res);
    if(res.code ===1){
        // list.value = res.data;
        list.value = res.data.map((it:VideosObject,i:number)=>{
            it.isPlay = i=== 0;//由于本省请求的res返回值的没有，因此手动添加
        return it
        })
        console.log(list.value);
        setTimeout(function(){
            // let node : HTMLVideoElement = document.getElementById(it._id) as HTMLVideoElement
            let node :HTMLVideoElement = document.getElementById(list.value[0]._id) as HTMLVideoElement;
            node && node.play()
            // 必须静音才能自动播放，该浏览器
            setTimeout(function(){
                // 声音再打开；
                
            })
        })
    }
})
function playEvt(id:string){    console.log(id);
    // 如下查找灵活的id
    // 如下是查找固定的id
    let obj = list.value.find((oo:VideosObject)=>oo._id === id)
    let video : HTMLVideoElement = document.getElementById(id) as HTMLVideoElement;
    if(video.paused){
        video.play();
        obj && (obj.isPlay= true);
        // isPlay.value = true;
    }else{
        video.pause();
        obj && (obj.isPlay= false);
        // isPlay.value = false;
    }
}
function changeEvt(idx:number){
    console.log(arguments);
    list.value.forEach((it: VideosObject,i:number)=>{
        let node : HTMLVideoElement = document.getElementById(it._id) as HTMLVideoElement
        if(i == idx){
            !!node && node.play();
            it.isPlay = true;
            // node存在且播放
        }else{
            !!node && node.pause()
            it.isPlay = false;
            // node存在且暂停
        }
    })
}
function sendEvt(){
    dmList.value.push({
        id:Date.now(),
        txt:dmTxt.value,
        right:(0-dmTxt.value.length *12),
        top:Math.ceil(Math.random()*160 +30)
    })
    dmTxt.value=''

}
let timer = ref<number>(0)
onMounted(function(){
    let width :number = node.value.clientWidth
    // 启动定时
    timer.value = setInterval(function(){
        let ids:number[]=[]
        dmList.value.forEach((it:DMList)=>{
            it.right += 1
            if(it.right > width )ids.push(it.id)
        })
    ids.forEach((it:number)=>{
        let idx:number = dmList.value.findIndex((oo:DMList)=> oo.id ==it)
        dmList.value.splice(idx,1)
    })
    },50)
})
// 离开页面；销毁定时
onBeforeUnmount(function(){
    clearInterval(timer.value)
})

</script>

<style scoped lang="less">
@import "../../style/common.less";
@b:#222;
.clearfix::after{
    content: 'shabi';
    display: block;
    height: 100px;
    clear:both ;
    visibility: hidden;
}
.clearf{
    *zoom:1;
}
.videos-box {
    .rel();
    > .search {
        height: 46px;
        background: @b;
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
        background-color: @b;
        
    }
}
.my-item{
    > video{
            display: block;
            width: 100%;
            height: 220px;
            position: absolute;
            top: calc( 50% - 160px )

        }
        .my-btn{
            display: block;
            position: absolute;
            top: calc(50% - 90px);
            width: 68px;
            height: 68px;
            border-radius: 100%;
            left: calc(50% - 34px);
            background:rgba(1,1,1,.1) url('../../images/start.png') center/80% no-repeat ;
            opacity: .6;
            transition: all .25s linear; 
        &.act {
            opacity: 0;
        }
        }
        .dm-btn{
            display:block;
            position: absolute;
            width: 80%;
            height: 48px;
            left: calc(50% - 150px);
            bottom: 30px;
            text-align: center;
            line-height: 48px;
            color: white;
            font-size: .6rem;
            border-radius: 24px;
            background-color: #999;
        }
        .dm-txt{
            display: block;
            color: white;
            font-size: 12px;
            position: absolute;
            right: -48px;
            transition: all .05s linear;
            white-space: nowrap;
            top: 100px;
            // 4个字，每个字12px,总共48px;
        }
}
.dm-box{
    .dm-ipt{
        width: 90%;
        display: block;
        text-indent: 1rem;
        margin: 20px auto ;
        height: 30px;
        outline: none;
        border: 1px solid #d2d1d1;
    }
}
</style>