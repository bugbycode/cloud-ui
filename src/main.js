import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import axios from 'axios'
import router from './router'
import Request from './lib/request'
import localStore from 'store'									// 浏览器存储
import store from './store' 									  // vuex
import Components from './components'


Vue.use(ElementUI);
Vue.use(Request);
Vue.use(Components);

Vue.prototype.$axios = axios;
// 添加实例方法, 使用本地存储插件
Vue.prototype.$localStore = localStore;

Vue.config.productionTip = false

Vue.config.productionTip = false

new Vue({
  router,
	store,
  render: h => h(App),
}).$mount('#app')
