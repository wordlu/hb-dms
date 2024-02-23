<template>
  <div id="space_home">
    <!-- 项目列表 -->
    <div class="project-list">
      <!-- 左边部分 表头+列表 -->
      <div class="project-list-left">
        <!-- 表头 -->
        <div class="list-header">
          <div class="left">
            <svg-icon icon-class="projectList" class="projectListSvg"/>
            <span class="list-header-title">工作空间列表</span>
          </div>
          <!-- 操作按钮 -->
          <div class="right">
            <!-- <svg-icon icon-class="projectHomeSet" class="projectListSvg" @click="getList"/> -->
            <el-button
              @click="getList('refresh')"
              type="text"
            >
              刷新
            </el-button>
          </div>
        </div>
        <!-- 列表 -->
        <div class="list-container">
          <div v-for="(item,index) in projectList"  class="project-item" :key="index">
            <!-- 背景 -->
            <svg-icon icon-class="projectHomeCard" style="width:282px;height:140px"/>
            <!-- 项目详情 -->
            <div class="project-item-info" @click="toProjectInfo(item)">
              <!-- name -->
              <div class="project-item-info-name">
                {{ item.attributes.alias}}
              </div>
              <!-- 时间 -->
              <div class="project-item-info-date">
                {{ formatter(item.attributes.created,"yyyy-MM-dd hh:mm:ss") }}
              </div>
              <!-- 所有者 -->
              <div class="project-item-info-owner">
                <svg-icon icon-class="projectHomeOwner" style="width:20px;height:20px;margin-right: 4px;"/>
                {{ item.attributes.owner }}
              </div>
            </div>
            <!-- 操作按钮 -->
            <svg-icon icon-class="projectHomeMore" class="projectHomeMore" style="width:18px;height:3.5px"/>
          </div>

          <!-- <div class="add-project-item" @click="addProject">
            <svg-icon icon-class="projectHomeAdd" style="width:46.67px;height:46.67px"/>
          </div> -->
        </div>
        <el-empty v-if="projectList.length === 0" :image-size="200"></el-empty>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance } from 'vue'
import { useRouter , useRoute } from 'vue-router'
import { fetchComponentsAction } from '@/api/flow';

const { proxy } = getCurrentInstance()

const router = useRouter()
async function getComponentsAction(name) {
  const data = {
    LDProject: encodeURI(name)
  }
  const res = await fetchComponentsAction(data)
  return res.frontend
}

async function toProjectInfo(row){ 
  const frontendArray = await getComponentsAction(row.name)
  const options = {
    domain: window.server.domain,
    path: "/",
  }
  jsCookie.set('projectName',row.name);
  jsCookie.set('projectId',row.id);
  jsCookie.set('frontendArray', frontendArray.toString());
  // jsCookie.set('projectName',row.name, options);
  // jsCookie.set('projectId',row.id, options);
  // jsCookie.set('frontendArray', frontendArray.toString(), options);

  proxy.$menuList = proxy.$menuList.filter(it => frontendArray.includes(it.meta.policy))
  if(row.type == 'navMenu'){
    // 左侧菜单
    window.history.pushState(null,'',`${proxy.$menuList[0].path}/${proxy.$menuList[0].children[0].name}`)
  }else{
    // 顶部导航菜单
    const hostprefixVal = row.hostprefix ? row.hostprefix + '.' : ''
    const hostprefix = window.location.hostname === 'localhost' ? '' : hostprefixVal
    const url = `${window.location.protocol}//${hostprefix}${window.location.host}/project/projectInfo/${row.id}`
    console.log(url)
    window.open(`${window.location.protocol}//${row.attributes.ingress}/project/projectInfo/${row.id}`)
  }
}
</script>
<script>
import { h, ref } from 'vue'
import { ElMessageBox, ElSwitch } from 'element-plus'
import jsonData from '@/assets/pageConfig'
import jsCookie from 'js-cookie';
import { contactMessageBox } from "@/utils/messageBox"
import { findAll } from '../../api/jsonApi'
export default {
  data(){
    return{
      projectList:[]
    }
  },
  created(){
    this.getList()
  },
  methods:{
    clickProjectHomeSet() {
      contactMessageBox((err)=>{console.log(err)})
    },
    formatter(thistime, fmt) {
      if (!thistime) return '--';
      const isUTC = thistime.indexOf('Z') > -1 ? 'UTC' : '';
      let $this = new Date(thistime);
      let o = {
        'M+': $this[`get${isUTC}Month`]() + 1,
        'd+': $this[`get${isUTC}Date`](),
        'h+': $this[`get${isUTC}Hours`](),
        'm+': $this[`get${isUTC}Minutes`](),
        's+': $this[`get${isUTC}Seconds`](),
        'q+': Math.floor(($this[`get${isUTC}Month`]() + 3) / 3),
        'S': $this[`get${isUTC}Milliseconds`]()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this[`get${isUTC}FullYear`]() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt;
    },
    getList(type){
      findAll('spaces',{
        'release': true
      }).then((res)=>{
        this.projectList = res.data
        if (type === 'refresh') {
          ElMessage({
            message: '刷新成功',
            type: 'success',
          })
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    addProject(){
      contactMessageBox((err)=>{console.log(err)})
    }
  }
}
</script>

<style lang="scss">
// UI 设计图比例 1440px 900px
$sizeToPc:12px;

#space_home{
  width: 100%;
  height: calc(100vh - 130px);
  min-width: 600px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .Home-page-details{
    padding: 40px 120px 64px;
    background: #F3F4F7;
    .welcome{
      height: 48px;
      //styleName: Title/text-5xl/I-EL-Medium;
      font-family: Poppins;
      font-size: 40px;
      font-weight: 600;
      line-height: 48px;
      letter-spacing: 0em;
      text-align: left;
    }
    .welcome-list{
      height: auto;
      // width: 480px;
      border-radius: nullpx;
      display: block;
      margin-top: 12px;
      color: #5A5E72;
      
      //styleName: General/text-md/I-EL-Regular;
      font-family: Roboto;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;

      .phone-number{
        color: #FF7900!important;
      }
    }
  }

  .project-list{
    width: 100%;
    flex: 1;
    padding: 0 24px;
    display: flex;
    
    .project-list-left{
      width: 100%;
      .list-header{
        padding:  14px 0;
        display: flex;
        justify-content: space-between;
        border-bottom:1px solid rgba(11, 12, 14, 0.08);
        margin-left: 24px;
        .left{
          display: flex;
          align-items: center;
        }
        .right{
          cursor:pointer;
        }
        .projectListSvg{
          width: 24px;
          height: 24px;
          margin-right: 11px;
        }
        .list-header-title{
          // width: 120px;
          /* Header/text-xl/CN-Medium */
          font-family: 'Noto Sans SC';
          font-style: normal;
          font-weight: 600;
          font-size: 20px;
          line-height: 28px;
          /* identical to box height, or 140% */
          /* 01 Netural/N700 */
          color: #2D2F39;
        }
      }

      .list-container{
        padding: 24.5px 0;
        display: flex;
        flex-wrap: wrap;
        .project-item{
          width:282px;
          height:140px;
          background: linear-gradient(259.28deg, #FFC123 0%, #FF3232 100%);
          border-radius: 12px;
          margin-left: 24px;
          margin-bottom: 10px;
          position: relative;
          cursor:pointer;
          box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08);

          .project-item-info{
            position: absolute;
            width:282px;
            height:140px;
            left: 0;
            top: 0;
            padding: 16px;
            .project-item-info-name{
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 600;
              font-size: 18px;
              line-height: 28px;
              color: #FFFFFF;
              width: 160px;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              white-space: nowrap;
            }
            .project-item-info-date{
              margin-top: 4px;
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              line-height: 22px;
              color: rgba(255, 255, 255, 0.75);
            }
            .project-item-info-owner{
              display: flex;
              align-items: center;
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              line-height: 20px;
              margin-top: 38.42px;
              color: #FFFFFF;
            }
          }

          .projectHomeMore{
            position: absolute;
            right: 23px;
            top: 30.25px;
            /* 01 Netural/N000 */
            background: #FFFFFF;
          }
        }

        .project-item:hover{
          box-shadow: 0px 0px 1px rgba(155, 153, 153, 0.884), 0px 8px 16px rgba(167, 163, 163, 0.979);
        }

        .add-project-item{
          width:282px;
          height:140px;
          display: flex;
          justify-content: center;
          align-items: center;
          /* 01 Netural/N020 */
          background: #F9F9FB;
          margin-left: 18px;
          /* Light/Depth-Z300 */
          cursor:pointer;
          box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08);
          border-radius: 12px
        }

        .add-project-item:hover{
          background: #f1f1f3;
        }
      }
    }
    
  }
}

.el-message-box{
  width: 480px;
  // height: 200px;
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

@media (max-width:1440px) {
  #space_home{
    .project-list-left{
      width: 100%;
      .list-container{
        display: flex;
        flex-wrap: wrap;
        .project-item{
          margin-bottom: 10px;
        }
      }
    }
  }
}

</style>