import router from "./router";
import store from "./store";

router.beforeEach(async(to, from, next) => {
  if(store.state.hasLang){
    next()
  }else{
    await store.dispatch('getLangs').then(res=>{
      store.state.hasLang = true
      next()
    }).catch((err)=>{
      console.error('翻译获取失败');
      console.error(`error:`+err);
    })
  }
})