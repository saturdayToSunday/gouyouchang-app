<template>
    <van-nav-bar title="个人信息" @click-left="$router.go(-1)" left-arrow/>
    <div class="uMsg_content">
        <van-image
                class="headPic"
                round
                :src=headPic
                />
        <van-cell-group inset>
                <van-cell title="用户名" :value="user.name" />
                <van-cell title="性别" :value="sex" />
                <van-cell title="生日" :value="user.birthday" />
                <van-cell title="电话" :value="user.phone" />
                <van-cell title="邮箱" :value="user.email" />
                <van-cell title="地址" :value="user.address" />
                <van-cell>
                    <van-button round type="default" class="saveBtn" @click="getPerson">允许获取联系人信息</van-button>
                <!-- orentation 摇一摇的制作陀螺仪 -->
                </van-cell>
        </van-cell-group>
    </div>
</template>
<script setup>
    import {useRouter} from 'vue-router';
    import useUserStore from '../../store/useUserStore';
    import {ref} from 'vue'
    const user = useUserStore().userInfo;
    const store = useUserStore();
    console.log(user);
    let sex = user.sex =='man' ? '男':'女'
    let headPic= '/apis'+ user.photo;
    console.log(user.birthday);
    // let birthday = new Date(user.birthday)
    console.log(headPic);
// html5plus 真机接口调用代码获取联系人
    function getPerson(){
        plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
		addressbook.find(["displayName","phoneNumbers"],function(contacts){
			console.log(contacts);
		}, function () {
			console.log("error");
		},{multiple:true});
        },function(e){
            console.log("Get address book failed: " + e.message);
        });
    }
</script>
<style lang="less" scoped>
@import '../../style/common.less';
.uMsg_content{
.rel();
display: flex;
flex-direction: column;
align-items: center;
.headPic{
        width:6rem;
        height:6rem;
        margin:3rem 0; 
    };
.saveBtn{
            background-color: @g06;
            display: block;
            width: 100%;
            color:@g01;
        }
}

</style>