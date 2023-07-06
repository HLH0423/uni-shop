import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'
import store from './store/store.js'

uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
  
  // 判断请求的是否为有权限的 API 接口
  if(options.url.indexOf('/my/') !== -1) {
    options.header = {
      Authorization:store.state.m_user.token
    }
  }
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  // 将 store 挂载到 Vue实例上
  store
})
app.$mount()
