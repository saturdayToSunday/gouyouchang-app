import {createApp} from 'vue'
import App from './pages/index.vue'
// import VueQr from 'vue-qr';
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import router from './router/index' // 导入1
// import {AES,enc} from 'crypto-js'  // 导入配合定义全局
// 导入解密的api
import { createPinia } from 'pinia' //导入pinia
import { decodeApi, encodeApi } from './utils/index.ts';

// 引入vant组件库
// 1. 引入你需要的组件
import { 
    Button,
    Sidebar,
    SidebarItem,
    Form,
    Field,
    CellGroup,
    Circle, 
    NavBar,
    Uploader,
    RadioGroup,
    Radio,
    AddressEdit,
    Popup,
    Area,
    DatePicker,
    Swipe,
    SwipeItem,
    Dialog,
    SubmitBar,
    Card,
    CheckboxGroup,
    Checkbox,
    AddressList,
    Image as VanImage,
    Col,
    Row,
    Cell,
} from 'vant';
// 没有datetimepicker组件；在package.json中查看vant组件库使用的版本4；
// 2. 引入组件样式
import 'vant/lib/index.css';

const pinia = createPinia();

// 数据持久化的原理,实现订阅的消息;
function plugin({store}:any){ // 使用es6对象的解构出store;
    console.log(arguments);  //设置subscribe监听函数,监听state的变化
    // 订阅数据更新的消息;
    // console.log(store);
        // debugger的作用;网页调试时快速找到调试点.
    let cache = sessionStorage.getItem('user-store-info');
    if(cache){
        // 01-2 cache需要解密,否则无法直接遍历;
            // let decache = AES.decrypt(cache,'youchang-key').toString(enc.Utf8)
            // let info: any = JSON.parse(decache);
            let info: any = JSON.parse(decodeApi(cache));
            // store.setToken(info.token) // 调用设置完成的函数方法将token值修改
            for(let name in info){
                store[name] = info[name];
            }
            // store.token = info.token 使用for遍历所有
    }
    store.$subscribe(function(_:any,newState:UserStore){
        // console.log(newState);
        // let str = AES.encrypt(JSON.stringify(newState),'youchang-key').toString() 
        // 参数一:加密的消息,参数二:为key值 //加密得到字符集==>转为字符串;
        let str = encodeApi(JSON.stringify(newState))
        console.log('加密后的字符串'+str);
        // console.log('解密字符',AES.decrypt(str,'youchang-key').toString(enc.Utf8));
        
        // sessionStorage.setItem('user-store-info',JSON.stringify(newState)) //数据存储到缓存中
        sessionStorage.setItem('user-store-info',str)//01-1将存储的字符串数据加密后放入sessionStorage
    })
}
pinia.use(plugin) //将插件plugin注册到pinia库中;
// 注册全局样式；
import './style/index.less';
// 导入2

// 引入自己开发的全局插件；
// - vue2,vue3细微不同需要自己调整；
import MyPlugin from './components/index.ts';

// 全局变量，代理字段+请求地址的设置，发布用； 
window.baseURL = import.meta.env.MODE ==='development' ? '/apis' : '/localhost'
createApp(App)
    .use(router)
    .use(pinia) //引入pinia实例
    .use(Sidebar)
    .use(SidebarItem)
    .use(Button)
    .use(Checkbox)
    .use(Form)
    .use(Field)
    .use(Cell)
    .use(CellGroup)
    .use(Circle)
    .use(NavBar)
    .use(Uploader)
    .use(RadioGroup)
    .use(Radio)
    .use(Area)
    .use(Popup)
    .use(DatePicker)
    .use(Swipe)
    .use(SwipeItem)
    .use(MyPlugin)
    .use(Dialog)
    .use(SubmitBar)
    .use(Card)
    .use(CheckboxGroup)
    .use(AddressList)
    .use(AddressEdit)
    .use(VanImage)
    .use(Col)
    .use(Row)
    .mount('#root')

    // App.component('vue-qr',VueQr);
// 入口页面越简洁越好;
