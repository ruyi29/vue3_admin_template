//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo } from '@/api/user'
//引入数据类型
import type { loginFrom, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由（常量路由）
import { constantRoute } from '@/router/routes'
//创建用户小仓库
let useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, // 仓库存储生成菜单需要的数组（路由）
      username: '',
      avatar: '',
    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFrom) {
      //登录请求
      let result: loginResponseData = await reqLogin(data)
      //登录成功 -> token
      //登陆失败 -> 错误信息
      if (result.code == 200) {
        //pinia仓库存储一下token
        //由于pinia|vuex存储数据其实利用js对象
        this.token = result.data.token as string
        //本地存储持久化存储一份
        // localStorage.setItem('TOKEN', (result.data.token as string))
        SET_TOKEN(result.data.token as string)
        //保证当前async返回成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
    //获取用户信息
    async userInfo() {
      //获取用户信息进行存储仓库当中[用户头像、名字]
      let result = await reqUserInfo()
      //如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.checkUser.username
        this.avatar = result.data.checkUser.avatar
      } else {
      }
    },
    //退出登录
    userLogout() {
      //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
    },
  },
  getters: {},
})
//对外暴露小仓库方法
export default useUserStore
