<template>
    <div  class="detaill_box">
        <van-nav-bar title="地图" @click-left="$router.go(-1)" left-arrow/>
        <div ref="node" class="detail_content" id="container" >
        </div>
        <div class="search">
            <!-- 
                <van-cell-group inset >
            输入任意文本 
                <van-field v-model="start_point" label="起点" />
                <van-field v-model="end_point" label="终点"/>
            </van-cell-group>
            <div id="r-result">请输入:<input type="text" id="suggestId" size="20" value="百度" style="width:150px;" /></div>
	        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div> -->
        </div>
    </div>
</template>
<script setup lang="ts">
    /* import onMounted from 'vue'
    // 地图使用
    // const node :HTMLDivElement = ref<HTMLDivElement>() // node于ref内node保持一致；
    */
   import { showToast } from 'vant';
    import {ref} from 'vue'
    import { onMounted } from 'vue';
    let start_point = ref('');
    let end_point = ref('')
    onMounted(function(){
        var map = new BMapGL.Map('container'); // 创建Map实例 //传递容器 ref--node.value访问不了，只能使用id
        new BMapGL.Geolocation().getCurrentPosition(function(arg:any){
        console.log(arg.longitude,arg.latitude);
        let cur_point =new BMapGL.Point(arg.longitude, arg.latitude);//中心点的位置
        map.centerAndZoom(cur_point, 12);//经纬度，地图缩放级别；初始化地图,设置地图大致范围和地图级别
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            // 定义标记点；
            var marker1 = new BMapGL.Marker(cur_point);
            // 在地图上添加点标记
            map.addOverlay(marker1);
            // 地图路线导航；
            var driving = new BMapGL.DrivingRouteLine(map, { 
                renderOptions: { 
                    map: map, 
                    autoViewport: true,
                    enableDragging: true,
                }
            })
            map.addEventListener('click', function (e) {
                // 清除所有覆盖物
                var allOverlay = map.getOverlays();
                // map.removeOverlay();
                // map.clearOverlays();
                let cur_point = new BMapGL.Point(e.latlng.lng, e.latlng.lat)
                // 点击定义标记点；
                var marker1 = new BMapGL.Marker(cur_point);
                // 在地图上添加点标记
                map.addOverlay(marker1);

                // 通过经纬度获取详细中文地址； Geocoder getLoction;
                new BMapGL.Geocoder().getLocation(cur_point, function(arg:any) {
                    console.log(arguments)
                    showToast(arg.address)
                })
            });
            let end = new BMapGL.Point(104.155486, 30.619911725979);
            driving.search(cur_point, end,{});
        })
    })
/*     onMounted(function(){
        let map = new BMapGL.Map("container");
        new BMapGL.Geolocation().getCurrentPosition(function(arg:any){
            console.log(arguments);
            // let currentpoint
            map.centerAndZoom(new BMapGL.Point(arg.longitude, arg.latitude), 19);//经纬度，地图缩放级别；
            map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            // 定义标记点；
            var marker1 = new BMapGL.Marker(new BMapGL.Point(116.404, 39.925));
        },{enableHighAccuracy:true})

        map.setHeading(64.5);
        map.setTilt(73);
    }) */
</script>
<style scoped lang="less">
@import '../../style/common.less';
.detaill_box{
        .rel();
        >.detail_content{
            .rel(calc( 100% - 46px ));
            // 注意calc的格式，写错不生效
            padding-top: 16px;
        }
        .search{
            position: fixed;
            width: 100%;
            height: auto;
            top: 3rem;
            font-size: .8rem;
            z-index: 999;
            // .van-cell{
            //     background-color: rgba(255, 220, 220, 0.5);
            // }
        }
    }
    body,html,.detail_content {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
        font-family: "微软雅黑";
    }

</style>
<!-- vue通常不直接用id 使用ref=“node”-->
<!-- 1. html步骤2
     2. 地图容器 //直接let map 报错的原因，setup本质在beforeCreate生命周期前面，因此dom节点用不了，
      - 将let map 放在onMonted生命周期上；
    3. 隐藏百度地图的图标，选中class,display:none;
    4. 创建gMap实例，获取位置点
    5. 将地图准确范围显示出来；
    6. 用标识点准确标注出来；
    7. 添加点击事件，获取点击位置的地址信息；
    8. 添加根据经纬度接收的接口，反地址解析；geocoder().getLocation(cur_point)
    -->
    <!-- 
        1. 真机联调
            1. 
     -->
