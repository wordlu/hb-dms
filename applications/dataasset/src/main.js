import './public-path';
import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import routers from './router';
import store from './store';
import './icons'; // icon
import './utils/elDialog';
import fuzzysearch from './fuzzysearch/fuzzysearch.js';
import i18n from './lang';
import './permission' // permission control
import jscookie from 'js-cookie'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(fuzzysearch);

axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

let instance = null
let router = null
function render(props) {
  router = routers
  instance = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#dataasset'); // 这里是挂载到自己的html中  基座会拿到这个挂载后的html 将其插入进去
}

if (window.__POWERED_BY_QIANKUN__) { // 动态添加publicPath
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
if (!window.__POWERED_BY_QIANKUN__) { // 默认独立运行
  render();
}

export async function bootstrap(props) {
  console.log('[vue] vue app bootstraped');
};

// to do
export async function mount(props) {
  const { dmsApi,setting,icons,dataassetApi } = props;
  Vue.prototype.$icons = icons;
  Vue.prototype.$CommandInfoIsVisible = setting; //显示隐藏方法共享
  Vue.prototype.$api = dmsApi; //api方法共享
  Vue.prototype.$dataassetApi = dataassetApi;
  props.onGlobalStateChange((state, prev) => {
    console.log(state,'statestatestatestate')
    i18n.locale = state.lang==''?(jscookie.get('language')?jscookie.get('language'):'zh'):state.lang
  });
  render(props);
}

export async function unmount(props) {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance=null;
  router=null
}

export async function update(props) {
  render(props);
}