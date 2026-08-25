//引入项目中全部的全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import type { App } from 'vue'
//全局对象
const allGloablComponent = { SvgIcon, Pagination }
//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: App) {
    //注册项目全部的全局组件
    ;(
      Object.keys(allGloablComponent) as Array<keyof typeof allGloablComponent>
    ).forEach((key) => {
      //注册为全局组件
      app.component(key, allGloablComponent[key])
    })
  },
}
