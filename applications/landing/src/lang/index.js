import { createI18n } from "vue-i18n";
import axios from 'axios'
import Cookies from 'js-cookie'

const messages = {
  en: {},
  zh: {},
  jp: {}
};

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage
  return 'zh'
}

const i18n = createI18n({
  locale: getLanguage(), // 设置当前语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  messages,
});

mergeLocale('Menu')
mergeLocale('common')
mergeLocale('landing')

function mergeLocale(project){
  for(let key in messages){
    axios.get(`/langs/${project}/${key}.json`).then((res)=>{
      i18n.global.mergeLocaleMessage(key, res.data)
    }).catch((err)=>{
      console.log(err,'err')
    })
  }
}

export default i18n;
