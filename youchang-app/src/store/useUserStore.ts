import { defineStore } from 'pinia'
const useUserStore = defineStore(
    'user',
    {
        state():UserStore{
            return{
                token:'',
                userInfo:({} as UserInfo),
                address:'',
            }
        },
        actions:{
            setToken(_newToken:string){
                this.token = _newToken;
                console.log('setToken被调用了');
            },
            setUserInfo(_newUserInfo:UserInfo){
                this.userInfo = _newUserInfo;
            },
            setAddress(_newAddress:string){
                this.address =_newAddress
            }
        },
        getters:{
            tokenInfo():string{
                return this.token
            },
            myUserInfo():UserInfo{
                return this.userInfo
            },
            addressInfo():string{
                return this.address
            }
        }
    }
)

export default useUserStore // 导出;

// 2-1
