<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入获取当前时间的函数
import { getTime } from '@/utils/time'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'

let useStore = useUserStore()
//获取el-form组件
let loginForms = ref()
//获取路由器
let $router = useRouter()
//路由对象
let $route = useRoute()
//定义变量控制加载效果
let loading = ref(false)
//收集账号和密码的数据
let loginForm = reactive({ username: 'admin', password: '111111' })
// 登录回调按钮
const login = async () => {
  //保证所有表单项都通过再发请求
  await loginForms.value.validate()
  //开始加载效果
  loading.value = true
  try {
    //也可以写成.then
    await useStore.userLogin(loginForm)
    //编程式导航跳转到展示数据的首页
    //判断登录的时候，路由路径当中是否有query参数，如果有就往query参数跳，没有跳转到首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    //登陆成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi, ${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    //登陆失败提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
//自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule为校验规则对象；value为表单元素文本内容
  //函数：如果符合条件callback放行通过，如果不符合条件callback方法注入错误信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  //rule为校验规则对象；value为表单元素文本内容
  //函数：如果符合条件callback放行通过，如果不符合条件callback方法注入错误信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

//定义表单校验需要配置的对象
const rules = {
  //required表示该字段必须校验
  //min，max表示文本长度
  //message表示错误提示信息
  //trigger表示触发表单校验的时机；change表示文本变化触发校验；blur表示失去焦点触发校验
  username: [
    // {required: true, min:6, max:10, message:'账号长度至少六位', trigger: 'change'}
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh; //vh：视口高度单位。1vh=浏览器可视窗口高度的 1%
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    font-size: 20px;
    color: white;
    margin: 20px 0px;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
