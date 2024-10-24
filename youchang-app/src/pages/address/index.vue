<template>
    <div class="address-box">
        <van-nav-bar title="管理用户地址"
            @click-left="$router.go(-1)"
            left-arrow/>
        <div class="box">
            <!-- 下拉地址选择： -->
                <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="常用"
                @add="onAdd"
                @edit="onEdit"
                @select = "onSelect"/>
        </div>
    </div>
        <van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }" >
            <van-address-edit 
                :area-list="areaList"
                show-delete
                show-set-default
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
                :address-info="addInfo"
                />
        </van-popup>
</template>
<!-- 组件库： -->
<script lang="ts" setup>
    import {ref,reactive} from 'vue';
    import {areaList} from '@vant/area-data'
    import useUserStore from '../../store/useUserStore';
    import {addressListApi,addressAddApi,addressDeleteApi,addressModifyApi} from '../../apis/uesApi';
    import { numberKeyboardProps, showSuccessToast, showToast } from 'vant';
    import { showDialog } from 'vant';
import router from '../../router';
    const list = ref([])
    let chosenAddressId = ref('1');
    let show = ref<boolean>(false);
    const store = useUserStore();
    const user: UserInfo = useUserStore().userInfo;

    
    const searchResult = ref([]);
    const address:string = ref('');
    // 发送到后端
    const addUser = ref({
        "userId" : " ",
        "name" : " ",
        "phone" : " ",
        "address" : " ",
        "tag" : " ",
        "detailAdd":'',
        "_id":'',
    });
    // 同步到页面
    const addInfo = ref({
        "name":"",
        "tel":"",
        "province":"",
        "city":"",
        "country":"",
        "addressDetail":"",
        "isDefault":false,
    });
    // user.id ='user-2';
     function onSelect(e){
        let address = e.address+''+e.detailAdd;
        console.log(address);
        store.setAddress(address);
        async function backTocart(){
            await showDialog({ message: '地址设置成功' });
            await router.push('/cart');
        }   
        backTocart()
    }
    function getList(){
        addressListApi(user.userId).then(d=>{
        if(d.code ===1 ){
            list.value = d.data.map((it:any)=>{
                console.log(it);
                it.id=it._id;
                it.isDefault = it.tag === 'Y' ? true :false ;
                it.tel = it.phone;
                return it;
            })
            console.log(list.value);
            }
        })
    }
    getList()
    // 新增地址
    let flag = ref();
    function onAdd() {
        flag.value =1;
        show.value = true
        addInfo.value={}
    }
    // 编辑地址
    function onEdit(e:any){
        flag.value = 0;
        console.log(e,'onedit');
        show.value = true;
        addInfo.value.name = e.name;
        // addInfo.value.tel = user.id;
        addInfo.value.tel = e.phone;
        let [p,ci,co] =e.address.split('/');
        addInfo.value.province =p;
        addInfo.value.city=ci ;
        addInfo.value.country =co ;
        addInfo.value.addressDetail = e.detailAdd;
        console.log(addInfo.value.isDefault);
        if(e.tag=='Y'){ addInfo.value.isDefault =true}else{addInfo.value.isDefault=false}
        console.log(addInfo.value.isDefault);
        addUser.value._id =e._id    
    }
    function onSave(e:any){
        console.log(e,'onSave文本框内容');
        if(flag.value ==1){
        console.log('调用新增api');  
        // 需要发送到服务器新增的内容
        addUser.value.name=e.name;
        addUser.value.userId = user.userId;
        addUser.value.phone = e.tel;
        addUser.value.address =e.province+'/'+ e.city+'/'+e.county;
        addUser.value.detailAdd = e.addressDetail;
        console.log(addUser.value.tag);
        addUser.value.tag = e.isDefault ? 'Y' :'N'
        addUser.value._id =(Math.random()*10000000000).toFixed(0)+'';
        console.log(addUser.value);
        
            addressAddApi(addUser.value)
            .then(d=>{
                if(d.code === 1){
                    show.value = false;
                    showSuccessToast('保存地址成功')
                    // debugger
                    getList();
                }
            })
            .catch(err=>{
                showToast('地址添加失败')
            })
        }else{
            console.log('调用修改api',e);
            addUser.value.name=e.name;
            addUser.value.userId = user.userId;
            addUser.value.phone = e.tel;
            addUser.value.address =e.province+'/'+ e.city+'/'+e.county;
            addUser.value.detailAdd = e.addressDetail;
            addUser.value.tag = e.isDefault ? 'Y' :'N';
            console.log(addUser.value,'modify修改');
            addressModifyApi(addUser.value).then(d=>{
                showSuccessToast('修改地址成功')
                show.value = false;
                getList();
            })
        }  
    }
    function onDelete(e:any){
        console.log(e,'dedededededededededededed');
        // addressDeleteApi(e)
        addUser.value.name=e.name;
        addUser.value.userId = user.userId;
        addUser.value.phone = e.tel;
        addUser.value.address =e.province+'/'+ e.city+'/'+e.county;
        addUser.value.detailAdd = e.addressDetail;
        addUser.value.tag = e.isDefault ? 'Y' :'N';
        let v = addUser.value;
        addressDeleteApi(addUser.value)
        .then(d=>{
                if(d.code === 1){
                    show.value = false;
                    showSuccessToast('删除地址成功')
                    // debugger
                    getList();
                }
            })
            .catch(err=>{
                showToast('地址删除失败')
            })
    }
</script>
<style lang="less" scoped>
    @import "../../style/common.less" ;
    .address-box{
        .rel();
        > .box{
            .rel(calc(100% - 46px));
        }
    }
</style>