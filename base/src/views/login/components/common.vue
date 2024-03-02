<template>
  <div id="common" :loading="loading">
    <div class="login-container">
      <div class="logo-title-container">
        <div class="grid-content bg-purple logo-title-rows">
          <!-- <img class="logo-image" :src="logoImge" alt="" draggable="false"> -->
          <span class="logo-title-rows-span">
            <b>{{$keycloak.client_name !== 'daily-report'?$t('login.title'):'日报管理系统'}}</b>
          </span>
          <!-- <lang-select class="set-language language-box" /> -->
        </div>
      </div>
      <div class="login-from-container">
        <iframe v-if="NODE_ENV !== 'development'" id="loginFrom" :src="$keycloak.login" frameborder="0"></iframe>
          
        <el-form v-else :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="$t('login.email')" prop="email">
            <el-input type="text" v-model.trim="ruleForm.email" tabindex="1" autocomplete="on" size="small"></el-input>
          </el-form-item>
          <el-form-item  :label="$t('login.password')" prop="password">
            <el-input type="password" v-model.trim="ruleForm.password" autocomplete="off" show-password size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('login.system')" prop="system">
            <el-select v-model="ruleForm.system" aria-setsize="mini" @change="getSystemInfo()">
              <el-option
                v-for="item in options"
                :key="item.client_id"
                :label="lang == 'zh'?item.client_cn_name:item.client_name"
                :value="item.client_name">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button size="small" type="" @click="submitForm('ruleForm')" >{{ $t('login.logIn') }}</el-button>
            <el-button type="text" @click="openChangePasswordPage" style="font-size:12px;float:right">{{ $t('login.forgot') }}</el-button>
          </el-form-item>
        </el-form>

        <el-button class="changePasswordPage" v-if="NODE_ENV !== 'development'" type="text" @click="openChangePasswordPage" style="font-size:12px;float:right">{{ $t('login.forgot') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import LangSelect from '@/components/LangSelect'
// import md5 from 'js-md5';
import keycloakInfo from '@/utils/setKeycloak'
import axios from 'axios';

export default {
  name: 'common',
  components: { LangSelect },
  data() {
    var validateUser = (rule, value, callback) => {
      // if (
      //   /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
      //     value
      //   ) == false
      // ) {
      //   callback(new Error(this.$t('邮箱格式错误')));
      // } 
      // else {
        if (this.ruleForm.password !== '') {
          this.$refs.ruleForm.validateField('ruleForm');
        }
        callback();
      // }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('home.Please_enter_password')));
      }  else {
        callback();
      }
    };
    return {
      origin:null,
      client:null,
      loading:false,
      NODE_ENV:null,
      ruleForm: {
        email: '',
        password: '',
        // system:null,
        // systemId:null
      },
      options:[],
      uid: null,
      client_id: "XwgxtaFThqfJ4lru-a-",
      redirect_uri: "http://localhost:1024/oauth-callback",
      http:"https://8qo3qi8vid.execute-api.cn-northwest-1.amazonaws.com.cn/v0/hjoauth/",
      rules: {
        email: [
          { validator: validateUser, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      logoImge:require('../../../assets/images/logo.png'),
    }
  },
  created(){
    this.NODE_ENV = process.env.NODE_ENV
    this.origin = window.location.origin
    this.client = location.host.split('.')[0]
    this.keycloakIP = location.host.substring(location.host.indexOf('.',1))
  },
  mounted() {
    this.$nextTick(()=>{
      let self = this
      if(this.NODE_ENV !== "development"){
        let iframeBox=document.getElementById("loginFrom");
        iframeBox.onload= async ()=>{
          let _obj=iframeBox.contentWindow || iframeBox.contentDocument;
          if(_obj.location.href){
            self.loading = true
            
            let systemId = keycloakInfo.client_id
            await this.$store.dispatch('operation/ssrlogin', {
              code:_obj.location.href.split('code=')[1],
              redirect_uri:_obj.location.href.split('?')[0],
              systemId:systemId
            }).then(res=>{
              self.loading =false
              this.$router.push({path:'/'})
            })
            // let notSystem = false;
            // await this.$systemApi['findclient']('client').then(async res=>{
            //   res.data.forEach(item => {
            //     if(item.client_name == _obj.location.host.split('.')[0]){
            //       systemId = item.client_id;
            //       notSystem = true
            //     }
            //   });
            //   if(notSystem){
            //     await this.$store.dispatch('operation/ssrlogin', {
            //       code:_obj.location.href.split('code=')[1],
            //       redirect_uri:_obj.location.href.split('?')[0],
            //       systemId:systemId
            //     }).then(res=>{
            //       self.loading =false
            //       this.$router.push({path:'/'})
            //     })
            //   }else{
            //     Cookies.remove('Token')
            //     Cookies.remove('refresh_token')
            //     Cookies.remove('systemId')
            //     Cookies.remove('roles')
            //     location.href = this.keycloakInfo.logout
            //   }
            // })
          }
        }
      }else{
        // this.$systemApi['findclient']('client').then(res=>{
        //   this.options = res.data
        //   if(res.data.length > 0){
        //     this.ruleForm.system = res.data[0].client_name
        //     this.ruleForm.systemId = res.data[0].client_id
        //   }
        // })
        // this.ruleForm.system = keycloakInfo.client_name
        // this.ruleForm.systemId = keycloakInfo.client_id
      }
    })
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  methods: {
    // 密码加密sha256方法
    setSha(password){
      let sha256 = require("js-sha256").sha256//这里用的是require方法，所以没用import
      let pw = sha256(password)//要加密的密码
      // console.log(this.pw)//这就是加密之后的密码
      return pw
    },
    getSystemInfo(){
      // @wodelu:TODO
      for(let i=0;i<this.options.length;i++){
        if(this.options[i].client_name == this.ruleForm.system){
          this.ruleForm.systemId = this.options[i].client_id
        }
      }
    },
    openChangePasswordPage(){
      const h = this.$createElement;
      this.$msgbox({
        title: '联系商务',
        message: h('p', null, [
          h('span', { style: 'color: #5A5E72;fontSize: 14px' }, '请联系亮道商务！')
        ]),
        showCancelButton: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            done();
          } else {
            done();
          }
        }
      })
      // let routeUrl = this.$router.resolve({
      //   path: '/forget/emil'
      // })
      // window.open(routeUrl.href, '_blank')
    },
    // 登陆按钮
    async submitForm(formName) {
      let ruleForm = {
        // email:this.ruleForm.email,
        // password: this.setSha(this.ruleForm.password),
				email:'peng.qian@hejoy.ai',
        password: this.setSha('Abcde196125'),
        // department:this.ruleForm.system,
        // systemId:this.ruleForm.systemId
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain",
          }
          axios.get(`${this.http}login?email=${ruleForm.email}&password=${ruleForm.password}`, { headers }).then((res) => {
            if (res.status === 200) {
              // 存uid
              this.uid = res.data.uid
              this.getAuthorization()
            }
          }).catch(err => {
            this.loading = false
            console.log(err,"======errrrrrr");
          })
          // this.$store.dispatch('operation/login', ruleForm)
          //   .then(async () => {
          //     // this.$router.push({ path: '/' })
          //     // this.loading = false
          //   })
          //   .catch((err) => {
          //     this.loading = false
          //     // if(err.error_message == 'not allowed to enter the system'){
          //     //   this.$message({
          //     //     message:'该系统未注册此账号，请切换系统尝试',
          //     //     type: 'warning'
          //     //   });
          //     // }else if(err.error_message == 'account error or password error'){
          //     //   this.$message({
          //     //     message:'账户名或密码错误',
          //     //     type: 'warning'
          //     //   });
          //     // }else{
          //     //   this.$message({
          //     //     message:'登录失败',
          //     //     type: 'warning'
          //     //   });
          //     // }
          //   })
        } else {
          return false;
        }
      });
    },
    // 获取Authorization
    async getAuthorization() {
      const headers = {
        "Content-Type": "application/vnd.api+json",
        "Accept": "application/json, */*",
      }
      let params = {
        response_type: "code",
        client_id: this.client_id,
        user_id: this.uid,
        redirect_uri: this.redirect_uri,
        state: "state"
      }
      axios.get(`${this.http}authorization?response_type=${params.response_type}&client_id=${params.client_id}&user_id=${params.user_id}&redirect_uri=${params.redirect_uri}&state=${params.state}`, { headers }).then((res) => {
        if (res.status === 200) {
          // 跳转
          const redirectUri = res.data.redirectUri
          // 根据?分开 取出code
          const codeState = redirectUri.split("?")[1]
          const code = codeState.split("&")[0]
          this.getToken(code)
        }
      }).catch(err => {
        this.loading = false
      })
    },
    // 获取token
    async getToken(code) {
      // let Base64 = require('js-base64').Base64
      // let body = code + "&grant_type=authorization_code&redirect_uri=" + this.redirect_uri
      // const headers = {
      //   "Content-Type": "application/x-www-form-urlencoded",
      //   "Accept": "application/x-www-form-urlencoded",
      //   "authorization": "Basic " + Base64.encode(this.client_id + ":961ed4ad842147a5c9a1cbc633693438e1f4a8ebb71050d9d9f7c43dbadf9b72")
      // }
      // axios.post('https://8qo3qi8vid.execute-api.cn-northwest-1.amazonaws.com.cn/v0/hjoauth/token', { headers }, { data: body }).then((res) => {
      //   if (res.status === 200) {
      //     console.log(res, "====tokenres=====");
      //   }
      // }).catch(err => {
      //   this.loading = false
      // })


      let data = [
        code,
        "grant_type=authorization_code",
        "redirect_uri=http%3A%2F%2Flocalhost:1024%2Foauth-callback",
        "clientId=XwgxtaFThqfJ4lru-a-",
        "clientSecret=70328c7d0c0a6a543f4c159b910a571e736c7db280c21afbe0e2efccf0a7a12f"
      ].join("&");

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://8qo3qi8vid.execute-api.cn-northwest-1.amazonaws.com.cn/v0/hjoauth/token',
        headers: { 
          'Accept': 'application/x-www-form-urlencoded', 
          'Content-Type': 'application/x-www-form-urlencoded', 
          // 'Authorization': 'Basic WHdneHRhRlRocWZKNGxydS1hLTo5NjFlZDRhZDg0MjE0N2E1YzlhMWNiYzYzMzY5MzQzOGUxZjRhOGViYjcxMDUwZDlkOWY3YzQzZGJhZGY5Yjcy'
        },
        withCredentials: true,
        data: data
      };

      axios.request(config)
      .then((response) => {

        Cookies.set('access_token', response.data.access_token)
        Cookies.set('Token', response.data.access_token)
        Cookies.set('roles', 'admin')
        Cookies.set('expiresIn', response.data.expiresIn)
        Cookies.set('refresh_token', response.data.refresh_token)
        Cookies.set('scope', response.data.scope)
        Cookies.set('token_type', response.data.token_type)
        Cookies.set('user', response.data.user)

        let routeUrl = this.$router.resolve({
          path: '/forget/emil'
        })
        // window.open(routeUrl.href, '_blank')
				debugger
				this.$router.push({ path: '/' })
      })
      .catch((error) => {
        console.log(error);
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getIframUrl(){
      var url = parent.document.getElementById("loginFrom").contentWindow.location.href;
      return url;
    }
  }
}
</script>

<style lang="scss">
.el-message-box{
  width: 480px;
  // height: 192px;
  font-size: 14px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px!important;
  .el-message-box__title{
    font-family: 'Noto Sans SC';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    color: #313235;
  }
  .el-message-box__btns{
    padding-top: 16px;
    .el-button--primary{
      background-color: #FF7900!important;
      border-color: #FF7900!important;
      color: #ffffff!important;
    }
    .el-button{
      background: #F3F4F7;
      color: #2D2F39;
    }
    .el-button:hover{
      color: #2D2F39;
      border-color: #DCDFE6;
    }
    .el-button--primary:hover{
      color: #ffffff;
    }
  }
}
#common{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: rgba($color: rgb(2, 0, 15), $alpha: .8);
  .login-container{
    width: 440px;
    height: 370px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
    position: absolute;
    left: 50%;
    top: 45%;
    margin-left: -220px;
    margin-top: -200px;
    .logo-title-container{
      padding: 10px;
      border-bottom: 1px solid rgba(0,0,0,.4);
      position: relative;
      .logo-title-rows{
        padding-left: 15px;
        display: flex;
        align-items: center;
        .logo-title-rows-span{
          flex: 1;
          margin-left: 15px;
          color: #f47a20;
        }
      }
      .logo-image{
        width: 115px;
      }
      .language-box{
        position: absolute;
        right: 10px;
        top: 20px;
      }
    }
    .login-from-container{
      width: 100%;
      padding: 30px 20px;
      display: flex;
      position: relative;
      #loginFrom{
        width: 100%;
        height: 250px;
        overflow: hidden;
      }
      .el-form{
        width: 80%;
      }

      .changePasswordPage{
        position: absolute;
        bottom: 30px;
        right: 30px;
      }
    }
  }
  
}
</style>
