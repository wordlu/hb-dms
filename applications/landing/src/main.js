import { createApp } from 'vue'
import App from './App.vue'
import routers from './router'
import store from '@/store'
import '@/icons'  // 导入图标资源
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
import i18n from '@/lang';
import ElementPlus from 'element-plus'
import '@/styles/element.scss'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

let instance = null
let router = null
function render(props) {
  const { dmsApi, labelCaApi, filter , menuList } = props
  router = routers
  instance = createApp(App).component('svg-icon', SvgIcon).use(store).use(router).use(i18n).use(ElementPlus, { locale: zhCn })
  instance.config.globalProperties.$api = dmsApi
  instance.config.globalProperties.$labelCaApi = labelCaApi
  instance.config.globalProperties.$menuList = menuList
  
  instance.config.globalProperties.$filter = filter
  instance.mount('#landing')
}

if (window.__POWERED_BY_QIANKUN__) { // 动态添加publicPath
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export async function bootstrap(props) {
  console.log('[vue] vue app bootstraped');
};

export async function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    i18n.global.locale.value = state.lang
  });
  render(props)
}

export async function unmount(props) {
  instance.unmount()
  instance._container.innerHTML = '';
  instance=null;
  router=null;
}

export async function update(props) {
  render(props);
  console.log('执行了 update')
}
