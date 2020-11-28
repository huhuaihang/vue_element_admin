import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
//配置请求根目录
axios.defaults.baseURL = 'http://39.107.61.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
	// console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

//vue tree 树形组件 手动注册
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
