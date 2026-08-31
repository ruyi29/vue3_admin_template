// layout组件相关配置仓库
import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('useLayOutSettingStore', {
  state: () => {
    return {
      fold: false, // 菜单折叠or收起控制
    }
  },
})

export default useLayOutSettingStore
