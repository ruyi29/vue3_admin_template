import { createApp } from 'vue'
import App from '@/App.vue'

//引入element-plus插件与样式（完整引入）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

//获取应用实例对象
const app = createApp(App)
//安装element-plus插件
// app.use(ElementPlus)
app.use(ElementPlus, {
  locale: zhCn,
})
//打印环境变量
console.log(import.meta.env)
//svg文件需要的配置代码
//@ts-ignore
import 'virtual:svg-icons-register'
//引入自定义插件对象:注册整个项目全局组件
import gloablComponent from '@/components'
//安装自定义插件对象
app.use(gloablComponent)
//引入模板的全局样式
import '@/styles/index.scss'
//将应用挂载到挂载点上
app.mount('#app')
