import Vue from 'vue';
import $ from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
import Axios from 'axios'
import store from './store'
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
