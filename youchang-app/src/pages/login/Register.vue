<template>
    <div class="register-box">
        <van-nav-bar title="用户注册"
                        left-text="返回"
                        left-arrow
                        @click-left="$router.push('/login')"/>
        <!-- .go(-1) 也可-->
        <div class="content">
            <van-form  @submit="onSubmit">
            <van-cell-group inset>
                <!-- 用户名 -->
                <van-field v-model="userInfo.name"
                            name="用户名"
                            label="用户名"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"/>
                <van-field v-model="userInfo.password"
                        type="password"
                        name="密码"
                        label="密码"
                        placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]"/>
                <van-field name="uploader" label="用户头像">
                    <template #input>
                        <van-uploader  v-model="userInfo.photo"
                        :after-read="filePicker"
                        multiple :max-count="1"/>
                    </template>
                </van-field>
                <!-- 性别 -->
                <van-field name="radio" label="性别">
                <template #input>
                    <van-radio-group v-model="userInfo.sex" direction="horizontal">
                        <van-radio checked-color="#d81e06" name="man">男</van-radio>
                        <van-radio checked-color="#d81e06" name="woman">女</van-radio>
                    </van-radio-group>
                </template>
                </van-field>
                <!-- 地址选择 -->
                <!-- <van-field
                    v-model="result"
                    is-link
                    readonly
                    name="area"
                    label="地区选择"
                    placeholder="点击选择省市区"
                    @click="showArea = true"
                    /> -->
                    <van-field
                    name="uploader"
                    is-link
                    label="地区选择"
                    placeholder="点击选择省市区"
                    v-model="city"
                    @click="showCity = true"
                    />
                <!-- 详细地址 -->
                <van-field v-model="userInfo.address"
                        name="address"
                        label="详细地址"
                        placeholder="详细地址输入"
                        :rules="[{ required: true, message: '请填写地址' }]"/>
                <!-- 时间选择 -->
                <van-field
                    name="uploader"
                    is-link
                    label="生日"
                    placeholder="点击选择生日"
                    v-model="userInfo.birthday"
                    @click="showBirthday = true"
                    />
                    <!-- 手机号码 -->
                    <van-field v-model="userInfo.phone"
                        name="phone"
                        label="手机号码"
                        placeholder="详细地址输入"
                        :rules="[{validator, message: '请填写手机号' }]"/>
                    <!-- email -->
                    <van-field v-model="userInfo.email"
                        name="email"
                        label="邮箱"
                        placeholder="详细邮箱输入"
                        :rules="[{ required: true, message: '请填写邮箱' }]"/>
                    <!-- remark -->
                    <van-field v-model="userInfo.remark"
                        name="remark"
                        label="备注"
                        placeholder="输入备注内容"
                        :rules="[{ required: true, message: '请填写备注' }]"/>
            </van-cell-group>

                <div style="margin: 16px;">
                    <van-button color="#d81e06" rouphotond block native-type="submit">
                    提交
                    </van-button>
                </div>
            </van-form>
        </div>
        </div>
        <!-- 和地址配套的但放在大盒子div外面？？不理解，尊重 -->
        <van-popup v-model:show="showCity" position="bottom">
            <van-area
                :area-list="areaList"
                @confirm="pickCity"
                @cancel="showCity = false"
            />
            </van-popup>
        <!-- 与生日配套 :注意自己加上confirm/cancel事件-->
        <van-popup v-model:show="showBirthday" position="bottom">
            <van-date-picker v-model="birthday"
                    type="date"
                    title="选择年月日"
                    @cancel="showBirthday=false"
                    @confirm="pickBirthday"
                    :min-date="minDate"
                    :max-date="maxDate"
                    />
        </van-popup>
</template>
<script setup lang="ts">
    import {ref,Ref,reactive} from 'vue'
    import {areaList} from '@vant/area-data'
    import { uploadFileApi,registerApi } from '../../apis/uesApi';
    // Toast 轻提示组件
    import { showToast } from 'vant';
    import { useRouter } from 'vue-router';
    const birthday = ref<any[]>(['2000','01','01']);
    const userInfo = reactive<UserInfo>({
    "id": "",
    "name": "",
    "password": "",
    "photo": [],
    "sex": "女",
    "address": "",
    "birthday": '',
    "phone": "",
    "email": "",
    "remark": "",
    "userId":'',
})
const router = useRouter();
const showCity:Ref<boolean>=ref(false);
const showBirthday:Ref<boolean>=ref(false);
const city = ref<string>('')
    function filePicker(obj:any){
        let fd = new FormData();
        console.log(fd);
        // 当前元素节点后面插入元素element;
        fd.append('file',obj.file)
        // 调用useApi.ts中定义的接口
        uploadFileApi(fd).then(
            (d:any)=>{
                console.log(d)
                if(d.code ==1){
                    console.log(d.data);
                // if(d.code == 200){
                    userInfo.photo = [{url:'/apis/'+d.data[0].path}]
                    console.log(userInfo.photo);  
                }
        }
        )
    }
    async function onSubmit():void {
        // console.log(userInfo);
        let userId =(Math.random()*1000000000).toFixed(0)+'';
        let obj ={
            "userId": userId,
            "name": userInfo.name,
            "password": userInfo.password,
            "sex": userInfo.sex,
            "birthday": userInfo.birthday,
            "phone": userInfo.phone,
            "email": userInfo.email,
            "remark": userInfo.remark,
            address:city.value+ '/'+userInfo.address,
            photo:userInfo.photo[0].url.replace('/apis','')
        }
        // console.log(obj);
        registerApi(obj)
            .then(res =>{
                if(res.code == 1){
                    showToast('注册成功')
                    router.push('/login')
                }else{
                    showToast('注册失败')
                }
            })
    };
    // 地址信息的方法：
    function pickCity(_data:any){
        // console.log(arguments);
        // 将对象的city值转为数组；
        city.value =_data.selectedOptions.map((it:any)=>
            it.text
        ).join('/')
        showCity.value=false;
    }
    // 时间选择器；
    const minDate = new Date('1980-12-12')
    const maxDate = new Date();
    function pickBirthday(_data:any){
        userInfo.birthday = birthday.value.join('/');//添加/变成字符串保证对象中b值的格式正确
        showBirthday.value=false;
    }
    // 手机号验证
    function validator(v:any){
        return /1\d{10}/.test(v)
    }
</script>
<style lang="less" scoped>
    @import "../../style/common.less";
    .register-box{
        .rel();
        >.content{
            position:relative;
            height: calc(100% - 46px);
            overflow-x: hidden;
            padding: 16px 0;
        }
    }
</style>