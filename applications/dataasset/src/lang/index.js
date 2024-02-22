import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import Cookies from 'js-cookie'
 
axios.defaults.withCredentials = true;

Vue.use(VueI18n);
 
const messages = {
  en: {},
  zh: {},
  jp: {}
};

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')?Cookies.get('language'):'zh'
  return chooseLanguage
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages,
  // silentTranslationWarn: true,
})

 
export default i18n;