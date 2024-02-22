import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '@/lang'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasLang:false
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async getLangs({ commit }){
      return new Promise(async (resolve, reject) => {
        const messages = {
          en: {},
          zh: {},
          jp: {}
        };

        await mergeLocale('Menu')
        await mergeLocale('dataasset')
        await mergeLocale('common')

        resolve(true)

        async function mergeLocale(project){
          for(let key in messages){
            await axios.get(`/langs/${project}/${key}.json`).then(res=>{
              i18n.mergeLocaleMessage(key, res.data)
            }).catch((err)=>{
              reject(err)
            })
          }
        }
      })
    },
  },
  modules: {
  }
})
