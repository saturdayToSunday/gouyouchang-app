/**
 * @anthor 周蓉
 * @time 2023-12-04 21:30PM
 * @description 定义项目的路由
*/
import {createRouter,createWebHashHistory,Router} from 'vue-router'
// 引入页面路由01-1
import Login from '../pages/login/index.vue'
import Home from '../pages/home/index.vue'
import Type from '../pages/type/index.vue'
import Videos from '../pages/videos/index.vue'
import Cart from '../pages/cart/index.vue'
import Me from '../pages/me/index.vue'
import Address from '../pages/address/index.vue'

import intercepter from './interceptor'

import Welcome from '../pages/login/welcom.vue'
import Register from '../pages/login/Register.vue'
import Umsg from '../pages/me/umsg.vue'
import DetailAddress from '../pages/me/detailaddress.vue'
import Myorder from '../pages/me/myorder.vue'
// 配置引入的路由01-2
const router: Router = createRouter({
    //指定路由模式--hash
    history: createWebHashHistory(),
    routes: [
        {path:'/',redirect:'/welcome'},
        {path:'/welcome',component:Welcome},
        {path:'/login',component:Login},
        {path:'/register',component:Register},
        {path:'/umsg',component:Umsg},
        {path:'/home',component:Home,meta:{needAuth:true,layout:'main-layout'}},
        {path:'/type',component:Type,meta:{layout:'main-layout'}},
        {path:'/videos',component:Videos,meta:{layout:'main-layout'}},
        {path:'/cart',component:Cart,meta:{layout:'main-layout'}},
        {path:'/me',component:Me,meta:{layout:'main-layout'}},
        {path:'/address',component:Address},
        {path:'/detailaddress',component:DetailAddress},
        {path:'/myorder',component:Myorder}
    ]
    // layout 是下方的菜单栏；
})
router.beforeEach(intercepter);
export default router;
