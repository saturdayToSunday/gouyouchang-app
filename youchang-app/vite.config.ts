import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/-
export default defineConfig({
  plugins: [vue()],
  // base:'./',// app打包发布的时候必须修改为：./ 否则很多资源加载不出来；
  // 配置代理规则;//只能在开发环境代理，生产环境会无法找到位置报错；apis的ajax.ts的Axios处修改；
  server:{
    host:'192.168.1.4',//真机联调时使用，将本机ipv4放入
    proxy:{
      // 每次请求时,是否包含该字段
      // 'apis' ==> vite ==> 配置 ==> 服务器选项;
      '/apis':{
        // target: 'http://www.yszhsc.com:15666', //已过期,许老的可以勉强使用,哈哈哈哈
        // target:'http://jx.xuzhixiang.top/ap/api/allproductlist.php',
        target:'http://localhost:3000',
        // target:'http://www.yszhsc.com:15666',
        changeOrigin: true,
       // 将上方识别到的apis替换为''空字符串;
        rewrite: (path) => path.replace(/^\/apis/, ''),
      }
      // hmr:{
      //   overlay:false
      // }
    }
  }
})
