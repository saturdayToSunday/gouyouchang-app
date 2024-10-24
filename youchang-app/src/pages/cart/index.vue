<template>
    <div class="cart-box">
        <van-nav-bar title="购物车"
            @click-right="editEvt"
            :right-text="editTxt"/>
            <!-- :right-text ='isEdit ? '完成':'编辑'' -->
        <div class="content">
            <van-card 
                class="shop-item"
                v-for="it in list"
                :key="it._id"
                :price="it.price.toFixed(2)"
                :title="it.name"
                :thumb="it.bgUrl"
                >
                <!-- 价格修改为toFixed; -->
                <template #tag>
                    <van-checkbox v-model="it.checked"></van-checkbox>
                </template>
                <template #num>
                    <van-button @click="optEvt(it,'minus')" size="mini" type="default" round icon="minus"></van-button>
                    <span class="item-number" >{{it.count}}</span>
                    <van-button @click="optEvt(it,'add')" size="mini" type="warning" round icon="plus"></van-button>
                </template>
            </van-card>
        </div>
        <van-submit-bar :price="amount * 100" :button-text="editBtn" @submit="submitEvt" >
            <van-checkbox v-model="checkAll">全选</van-checkbox>
            <template #tip>
                <span>地址：{{address_info}} </span> <span class="sup" @click="editAddress">修改地址</span>
            </template>
        </van-submit-bar> 
    </div>
</template>
<script lang="ts" setup>
    import { ref,Ref}from 'vue';
    import {cartListApi,cartDeleteApi, cartModifyApi,orderAddApi} from '../../apis/uesApi'
    import useUserStore from '../../store/useUserStore';
    import { watchEffect,watch,computed,ComputedRef } from 'vue';
    import { showConfirmDialog,showToast } from 'vant';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const list:Ref<any[]> = ref([]);
    const user = useUserStore().userInfo;
    const store = useUserStore();
    console.log(store);
    
    console.log(user,store,'222222222');
    let address_info =ref('')
    address_info.value = store.addressInfo ? store.addressInfo : '你的收货地址不支持配送,'
    const checkAll = computed({
        set(flag:boolean){
            list.value.forEach((it:CartObject)=>{
                it.checked = flag
            })
        },
        get(){
            return list.value.every((it:CartObject) =>it.checked)
        }
    })
    const amount : ComputedRef<number> = computed(function(){
        return list.value.reduce((num:number,it:CartObject)=>{
            if(it.checked) num += it.price *it.count;
            return num 
        },0)
    })
    let editTxt = ref('编辑');
    let editBtn = ref('提交订单');
    let isEdit =ref<Boolean>(false);
    let address = ref('')
    
    
    cartListApi(user.userId).then(d=>{
        if(d.code ==1){
            console.log(d);
            list.value = d.data.map((it:CartObject)=>{
                it.price = it.price * 1;
                // it.count = 1;
                it.checked = false;
                return it;
            });
        }
    })
    function editAddress(){
        router.push('/address')
    }
    function submitEvt(){
        let ids = list.value.filter((it:CartObject)=>it.checked).map((it:CartObject)=>it._id)
        if(editBtn.value== '删除'){      
            console.log(ids);
            if(ids.length <1 ){
                showToast('选择你要删除的商品')
                return
            }
            showConfirmDialog({
                title:'删除确认',
                message:
                    '确认要删除商品？'
            })
            .then(()=>{
                cartDeleteApi({
                    userId:user.id,
                    ids
                }).then(d => {
                    console.log(d.code);
                    if (d.code === 1) {
                        ids.forEach((_id)=>{
                            list.value.splice(
                                list.value.findIndex((it: CartObject) => it._id === _id),1
                            )
                        })
                    } else {
                        showToast('删除错误')
                    }
                })
            })
            
        }else{
            let myList = list.value.filter((it:CartObject)=>it.checked).map((v:CartObject)=>{
                v.detailaddress = user.address;
                return{
                    ...v,
                    userId:user.userId
                }
            })
            console.log(myList,list);
            orderAddApi(myList).then(d=>{
                if(d.code ===1){
                    showToast('提交订单成功')
                    console.log(myList);
                    cartDeleteApi({
                        userId:user.id,
                        ids
                    })
                    myList.map((it:CartObject)=>it._id).forEach((_id)=>{
                            list.value.splice(
                                list.value.findIndex((it: CartObject) => it._id === _id),1
                            )
                        })
                }else{
                    showToast('提交订单失败')
                }
            })
        }
    }
    let flag = true;
    function editEvt() {
        // isEdit.value =!isEdit.value;
        console.log(flag);
        if(flag){
            editTxt.value = '完成' ;
            editBtn.value = '删除'
            flag=false;
        }else{
            editTxt.value = '编辑';
            editBtn.value = '提交订单'
            flag=true;
        }
    }
    function optEvt(obj:CartObject,type:String){
        let count: number = 0;
        if(type === 'minus'){
            count = obj.count -1;
        }
        else{
            count = obj.count +1;
        }
        if(count <1){
            showConfirmDialog({
            title: '删除确认',
            message:
                '确认要删除商品?',
            })
            .then(()=>{
                console.log(obj.userId);
                
                cartDeleteApi({
                    userId:obj.userId,
                    ids:[obj._id]
                }).then(d => {
                    if (d.code === 1) {
                        list.value.splice(
                            list.value.findIndex((it: CartObject) => it._id === obj._id),1
                        )
                    } else {
                        showToast('删除错误')
                    }
                })
            })
            .catch(()=>{})
        }else{

        }
        cartModifyApi({
            _id:obj._id,
            count
        }).then((d)=>{
            if(d.code ===1){
                // 页面数据随同更改：
                obj.count = count
            }
        })
    }

    

</script>
<style lang="less" scoped>
    @import '../../style/common.less';
    .cart-box{
        .rel();
        >.content{
            display: block;
            height: calc(100% - 46px - 85px);
            overflow-x: hidden;
            .shop-item{
                margin: .5rem;
                padding-left: 2rem;
                background-color: white;
                .item-ipt{
                    display: inline-block;
                    width: 1.5rem;
                    height: 1.5rem;
                    outline: 0;
                    border: 1px solid #ddd;
                }
               .item-number{
                    display: inline-block;    
                    vertical-align:bottom ;
                    padding: 0 .5rem;
                    font:normal .6rem/1rem  'Microsoft yahei';
                    
                }
            }

        }
    
    }
    // 样式穿透；样式没有data-v 所以需要携带样式穿透；
    :deep(.van-card__tag){
        top: calc(50% - .2rem);
        left:-1.3rem;
    }
    :deep(.sup){
                color:red;
                text-decoration: underline ;
                text-decoration-color: red !important;
            }
    .van-submit-bar{
        position: absolute;
    }
</style>