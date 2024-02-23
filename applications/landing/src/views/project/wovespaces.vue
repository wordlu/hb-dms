<template>
  <div id="space_home">
    <!-- 项目列表 -->
    <div class="project-list">
      <!-- 左边部分 表头+列表 -->
      <div class="project-list-left">
        <!-- 表头 -->
        <div class="list-header">
          <div class="left">
            <svg-icon icon-class="projectList" class="projectListSvg" />
            <span class="list-header-title">{{$t(`wovespaces['数据编织空间列表']`)}}</span>
          </div>
          <!-- 操作按钮 -->
          <div class="right">
            <!-- <svg-icon icon-class="projectHomeSet" class="projectListSvg" @click="getList" /> -->
            <el-button
              type="text"
              @click="getList('refresh')"
            >
              {{$t(`common['刷新']`)}}
            </el-button>
          </div>
        </div>
        <!-- 列表 -->
        <div class="list-container">
          <div v-for="(item, index) in projectList" class="project-item" :key="index">
            <!-- 背景 -->
            <svg-icon icon-class="projectHomeCard" style="width:282px;height:140px" />
            <!-- 项目详情 -->
            <div class="project-item-info" @click="toProjectInfo(item)">
              <!-- name -->
              <el-tooltip
                :disabled="disabled"
                :content="item.attributes.alias"
                placement="top"
                effect="light"
              >
                <div class="project-item-info-name">
                  {{ item.attributes.alias }}
                </div>
              </el-tooltip>
              
              <!-- 时间 -->
              <div class="project-item-info-date">
                {{ formatter(item.attributes.created, "yyyy-MM-dd hh:mm:ss") }}
              </div>
              <!-- 所有者 -->
              <div class="project-item-info-owner">
                <svg-icon icon-class="projectHomeOwner" style="width:20px;height:20px;margin-right: 4px;" />
                {{ item.attributes.owner }}
              </div>
            </div>
            <!-- 操作按钮 -->
            <!-- <svg-icon icon-class="projectHomeMore" class="projectHomeMore" style="width:18px;height:3.5px" /> -->
            <div class="projectHomeMore">
              <el-icon><Delete @click="deleteProject(item)"/></el-icon>
              <!-- <el-icon><Edit @click="editProject(item)"/></el-icon> -->
            </div>
          </div>

          <div class="add-project-item" @click="addProject">
            <svg-icon icon-class="projectHomeAdd" style="width:46.67px;height:46.67px" />
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" class="add-space-dialog" :title="$t(`wovespaces['创建空间']`)" :width="700">
      <el-form :model="form" ref="formRef" :label-width="formLabelWidth" :rules="rules">
        <el-form-item :label="$t(`wovespaces['空间名称']`)" prop="deployment_name">
          <el-input v-model="form.deployment_name" autocomplete="off" :placeholder="$t(`dataprojects['名称需以小写字母开头']`)" />
        </el-form-item>
        <el-form-item :label="$t(`dataprojects['中文名称']`)" prop="alias">
          <el-input v-model="form.alias" :disabled="isEdit" autocomplete="off" :placeholder="$t(`dataprojects['请填写中文名称']`)" />
        </el-form-item>
        <el-form-item :label="$t(`dataprojects['模板名称']`)" prop="template_name">
          <el-select v-model="form.template_name" :placeholder="$t(`common['请选择']`)">
            <el-option label="space-template-label" value="space-template-label" />
            <el-option label="space-template-base" value="space-template-base" />
            <el-option label="space-template-kpi" value="space-template-kpi" />
            <el-option label="space-template-scene" value="space-template-scene" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t(`common['描述']`)" prop="description">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t(`dataprojects['失效时间']`)" prop="expiration_time">
          <el-date-picker v-model="form.expiration_time" type="datetime" :placeholder="$t(`common['请选择']`)" format="YYYY-MM-DD HH:mm:ss"
            date-format="MMM DD, YYYY" time-format="HH:mm" />
        </el-form-item>
        <el-form-item :label="$t(`dataprojects['环境变量']`)" prop="env">
          <el-input
            type="textarea"
            :rows="3"
            :placeholder="$t(`dataprojects['请输入json字符串']`)"
            v-model="form.env">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitForm(formRef)">
            {{$t(`common['确认']`)}}
          </el-button>
          <el-button @click="cancel(formRef)">{{$t(`common['取消']`)}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getCurrentInstance, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Promotion , Delete , Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchComponentsAction, autoDeployment, autoDeploymentDelete } from '@/api/flow'
import { findAll, updateItem, deleteItem } from '@/api/jsonApi'
import { useI18n } from 'vue-i18n'

const { proxy } = getCurrentInstance()

const router = useRouter()
const { t } = useI18n()

const dialogVisible = ref(false)
const formLabelWidth = '120px'
const projectList = ref([])

const form = reactive({
  deployment_name: '',
  alias: '',
  env: '{}',
  template_name: '',
  description: '',
  expiration_time: null,
})
const formRef = ref()

// const rules = reactive({
//   deployment_name: [
//     { required: true, message:  t(`dataprojects['请输入空间名称']`), trigger: 'blur' },
//     {
//       required: true,
//       pattern: /^[a-z]([-a-z0-9]{0,30})$/,
//       message: t(`dataprojects['名称需以小写字母开头']`),
//       trigger: 'blur'
//     }
//   ],
//   template_name: [
//     { required: true, message: t(`dataprojects['请选择模板']`), trigger: 'change' },
//   ],
//   description: [
//     { required: false, message: t(`dataprojects['请输入描述']`), trigger: 'blur' },
//   ],
//   expiration_time: [
//     { required: true, message: t(`dataprojects['请选择失效时间']`), trigger: 'blur' },
//   ],
//   env: [
//     { 
//       required: false,
//       validator: (rule, value, callback) => {
//         return isJsonString(value)
//       },
//       message: t(`dataprojects['请输入JSON字符串']`),
//       trigger: ['blur', 'change']
//     }
//   ],
// })

const rules = computed(() => {
  return {
    deployment_name: [
      { required: true, message:  t(`dataprojects['请填写空间名称']`), trigger: 'blur' },
      {
        required: true,
        pattern: /^[a-z]([-a-z0-9]{0,30})$/,
        message: t(`dataprojects['名称需以小写字母开头']`),
        trigger: 'blur'
      }
    ],
    template_name: [
      { required: true, message: t(`dataprojects['请选择模板']`), trigger: 'change' },
    ],
    description: [
      { required: false, message: t(`dataprojects['请输入描述']`), trigger: 'blur' },
    ],
    expiration_time: [
      { required: true, message: t(`dataprojects['请选择失效时间']`), trigger: 'blur' },
    ],
    env: [
      { 
        required: false,
        validator: (rule, value, callback) => {
          return isJsonString(value)
        },
        message: t(`dataprojects['请输入json字符串']`),
        trigger: ['blur', 'change']
      }
    ],
  }
})

function isJsonString(str) {
  try {
    JSON.parse(str)
    return true
  } catch (err) {
    return false
  }
}

const cancel = (formEl) => {
  dialogVisible.value = false
  if (!formEl) return
  formEl.resetFields()
}

async function getComponentsAction(name) {
  const data = {
    LDProject: encodeURI(name)
  }
  const res = await fetchComponentsAction(data)
  return res.frontend
}

const addProject = () => {
  dialogVisible.value = true
}

const deleteProject = (data) => {
  ElMessageBox.alert(t(`dataprojects['是否要删除空间']`),  t(`common['系统提示']`), { 
    showCancelButton: true,
    confirmButtonText: t(`common['确认']`),
    cancelButtonText: t(`common['取消']`),
  }).then(() => {
    deleteProjectSubmit(data)
  })
  .catch((err) => {
    console.log(err)
  })
}

const deleteProjectSubmit = (data) => {
  const params = {
    "deployment_name": data.id,
    "category": "workspace"
  }
  autoDeploymentDelete(params).then(res=>{
    ElMessage({
      message: t(`dataprojects['删除成功']`),
      type: 'success',
    })
    getList()
  }).catch((err) => {
    console.log(err)
  })
}

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      creation()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const creation = () => {
  try {
    const params = {
      "category": "workspace",
      "alias": form.alias,
      "deployment_name": form.deployment_name,
      "template_name": form.template_name,
      "description": form.description,
      "expiration_time": formatter(form.expiration_time, "yyyy-MM-dd hh:mm:ss"),
      "avatar": "cexun.ico",
      "env": JSON.parse(form.env),
    }
    autoDeployment(params).then((res) => {
      ElMessage({
        message:  t(`dataprojects['创建成功']`),
        type: 'success',
      })
      getList()
      cancel(formRef.value)
    }).catch(err => {
      console.log(err)
      // ElMessage({
      //   message: '添加失败',
      //   type: 'error',
      // })
    })
  } catch (error) {
    console.log(error)
  }
}

const getList = (type) => {
  findAll('spaces', {
    'release': false
  }).then((res) => {
    projectList.value = res.data
    if (type === 'refresh') {
      ElMessage({
        message: t(`common['刷新成功']`),
        type: 'success',
      })
    }
  }).catch(error => {
    console.log(error)
  })
}

async function toProjectInfo(rowdata) {
  await getList()
  const row = projectList.value.filter(it => it.id === rowdata.id)[0]
  if (!row) return;

  if (row.attributes.status !== 'deployed') {
    if(row.attributes.status !== 'deploying'){
      ElMessage({
        message: t(`common['创建失败，请联系开发人员']`),
        type: 'error',
      })
    }else{
      ElMessage({
        message: t(`dataprojects['正在创建中，请稍后查看']`),
        type: 'info',
      })
    }
    
    return;
  }
  const frontendArray = await getComponentsAction(row.name)
  const options = {
    domain: window.server.domain,
    path: "/",
  }
  jsCookie.set('projectName', row.name);
  jsCookie.set('projectId', row.id);
  jsCookie.set('frontendArray', frontendArray.toString());
  // jsCookie.set('projectName', row.name, options);
  // jsCookie.set('projectId', row.id, options);
  // jsCookie.set('frontendArray', frontendArray.toString(), options);
  proxy.$menuList = proxy.$menuList.filter(it => frontendArray.includes(it.meta.policy))
  if (row.type == 'navMenu') {
    // 左侧菜单
    window.history.pushState(null, '', `${proxy.$menuList[0].path}/${proxy.$menuList[0].children[0].name}`)
  } else {
    // 顶部导航菜单
    const hostprefixVal = row.hostprefix ? row.hostprefix + '.' : ''
    const hostprefix = window.location.hostname === 'localhost' ? '' : hostprefixVal
    const url = `${window.location.protocol}//${hostprefix}${window.location.host}/project/projectInfo/${row.id}`
    console.log(url)
    window.open(`${window.location.protocol}//${row.attributes.ingress}/project/projectInfo/${row.id}`)
  }
}

function formatter(thistime, fmt) {
  if (!thistime) return '--';
  const isUTC = String(thistime).indexOf('Z') > -1 ? 'UTC' : '';
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
}

getList()
</script>
<script>
import { h, ref } from 'vue'
import jsCookie from 'js-cookie';
import { contactMessageBox } from "@/utils/messageBox"
export default {
  data() {
    return {
      projectList: []
    }
  },
  created() {
  },
  methods: {
    // clickProjectHomeSet() {
    //   contactMessageBox((err) => { console.log(err) })
    // },

  }
}
</script>

<style lang="scss">
// UI 设计图比例 1440px 900px
$sizeToPc: 12px;

#space_home {
  width: 100%;
  height: calc(100vh - 130px);
  min-width: 600px;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .add-space-dialog {

    // .el-input,
    // .el-select {
    //   width: 400px;
    // }
    .el-select {
      width: 100%;
    }

    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .Home-page-details {
    padding: 40px 120px 64px;
    background: #F3F4F7;

    .welcome {
      height: 48px;
      //styleName: Title/text-5xl/I-EL-Medium;
      font-family: Poppins;
      font-size: 40px;
      font-weight: 600;
      line-height: 48px;
      letter-spacing: 0em;
      text-align: left;
    }

    .welcome-list {
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

      .phone-number {
        color: #FF7900 !important;
      }
    }
  }

  .project-list {
    width: 100%;
    flex: 1;
    padding: 0 24px;
    display: flex;

    .project-list-left {
      width: 100%;

      .list-header {
        padding: 14px 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(11, 12, 14, 0.08);
        margin-left: 24px;

        .left {
          display: flex;
          align-items: center;
        }

        .right {
          cursor: pointer;
        }

        .projectListSvg {
          width: 24px;
          height: 24px;
          margin-right: 11px;
        }

        .list-header-title {
          // width: 160px;
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

      .list-container {
        padding: 24.5px 0;
        display: flex;
        flex-wrap: wrap;

        .project-item {
          width: 282px;
          height: 140px;
          background: linear-gradient(259.28deg, #FFC123 0%, #FF3232 100%);
          border-radius: 12px;
          margin-left: 24px;
          margin-bottom: 10px;
          position: relative;
          cursor: pointer;
          box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08);

          .project-item-info {
            position: absolute;
            width: 282px;
            height: 140px;
            left: 0;
            top: 0;
            padding: 16px;

            .project-item-info-name {
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

            .project-item-info-date {
              margin-top: 4px;
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              line-height: 22px;
              color: rgba(255, 255, 255, 0.75);
            }

            .project-item-info-owner {
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

          .projectHomeMore {
            position: absolute;
            right: 23px;
            top: 22px;
            /* 01 Netural/N000 */
            background: transparent;

            .el-icon {
              color: #fff;
              font-size: 20px;
              width: 20px;
              margin-left: 6px;
            }

            .el-icon:hover {
              box-shadow: 0px 0px 1px rgba(155, 153, 153, 0.884), 0px 8px 16px rgba(167, 163, 163, 0.979);
              border: none;
            }
          }
        }

        .project-item:hover {
          box-shadow: 0px 0px 1px rgba(155, 153, 153, 0.884), 0px 8px 16px rgba(167, 163, 163, 0.979);
        }

        .add-project-item {
          width: 282px;
          height: 140px;
          display: flex;
          justify-content: center;
          align-items: center;
          /* 01 Netural/N020 */
          background: #F9F9FB;
          margin-left: 18px;
          /* Light/Depth-Z300 */
          cursor: pointer;
          box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08);
          border-radius: 12px
        }

        .add-project-item:hover {
          background: #f1f1f3;
        }
      }
    }

  }
}

.el-message-box {
  width: 480px;
  // height: 200px;
  font-size: 14px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px !important;

  .el-message-box__title {
    font-family: 'Noto Sans SC';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    color: #313235;
  }

  .el-message-box__btns {
    padding-top: 16px;

    .el-button--primary {
      background-color: #FF7900 !important;
      border-color: #FF7900 !important;
      color: #ffffff !important;
    }

    .el-button {
      background: #F3F4F7;
      color: #2D2F39;
    }

    .el-button:hover {
      color: #2D2F39;
      border-color: #DCDFE6;
    }

    .el-button--primary:hover {
      color: #ffffff;
    }
  }
}

@media (max-width:1440px) {
  #space_home {
    .project-list-left {
      width: 100%;

      .list-container {
        display: flex;
        flex-wrap: wrap;

        .project-item {
          margin-bottom: 10px;
        }
      }
    }
  }
}</style>