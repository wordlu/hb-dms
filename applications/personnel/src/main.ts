import { createApp } from 'vue'
import App from './App.vue'
import routers from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import i18n from './lang'

let instance:any = null
let router:any = null
function render(props:any) {
  const { dmsApi, labelCaApi, filter , menuList } = props
  router = routers
  instance = createApp(App).use(store).use(router).use(ElementPlus)
  instance.config.globalProperties.$api = dmsApi
  instance.config.globalProperties.$labelCaApi = labelCaApi
  instance.config.globalProperties.$menuList = menuList
  instance.config.globalProperties.$filter = filter
  instance.mount('#personnel')
}

if ((window as any).__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}


export async function bootstrap(props:any) {
  console.log('[vue] vue app bootstraped');
}

// to do
export async function mount(props:any) {
  props.onGlobalStateChange((state:any, prev:any) => {
    // i18n.global.locale.value = state.lang
  });
  render(props)
}

export async function unmount(props:any) {
  instance.unmount()
  instance._container.innerHTML = '';
  instance=null;
  router=null;
}

export async function update(props:any) {
  render(props);
  console.log('执行了 update')
}
