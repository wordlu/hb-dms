<template>
  <div class="editor-container"
    element-loading-background="rgba(255, 255, 255, 0.4)"
    v-loading="loading">
    <div class="panel">
      <div class="title-panel">
        <div class="info">
          <div class="info-detail">
            <b>{{ title }}</b>
          </div>
          <div class="info-btn-group" v-if="!props.hideButton">
            <el-button type="primary" class="info-btn"
              @click="$emit('onsave', editorInstance.outContent(), currentNode)">{{$t(`common['保存']`)}}</el-button>
            <el-button type="primary" class="info-btn" :icon="Upload" @click="dialogVisible = true">{{$t(`algorithm['上传zip文件']`)}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="file-tree">
        <el-tree 
          :data="treeData"  accordion 
          :load="loadNode" :lazy="true" 
          @node-click="fileTreeNodeClick"
          icon-class="none">
            <template  #default="{ node, data }">
              <Folder style="width: 1em; height: 1em; margin-right: 8px" v-if="data.type === 'dir'" />
              <Document style="width: 1em; height: 1em; margin-right: 8px" v-if="data.type === 'file'" />
              <span>{{ node.label }}</span>
            </template>
        </el-tree>
      </div>
      <div class="ace" :style="style">
        <div ref="editorRef" class="editor"></div>
      </div>
    </div>
    <el-dialog 
      v-model="dialogVisible" 
      :title="$t(`algorithm['上传zip文件']`)" width="30%" 
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div>
        <el-upload ref="upload" class="upload-area" 
          :limit="1" accept=".zip" :on-error="upError"
          :http-request="handleUploadFile" 
          :on-success="handleAvatarSuccess"
          :auto-upload="false">
          <template #trigger>
            <el-button type="primary" class="upload-btn" plain :icon="Upload">{{ $t(`algorithm['上传']`) }}</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip text-red">
              {{ $t(`algorithm['当您上传新的zip文件包时,它会覆盖现有代码']`) }}
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="upload-cancel" @click="dialogVisible = false">{{$t(`common['取消']`)}}</el-button>
          <el-button class="upload-submit" type="primary" @click="submitUpload">{{$t(`common['确认']`)}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Upload } from "@element-plus/icons-vue"
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue"
import type { UploadProps, UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
// import fileTree from './fileTree.vue'
import PhCodeEditorHandler from '../../lib/codeeditorhandler'
// @ts-ignore 
import { Folder, Document } from "@element-plus/icons-vue" // eslint-disable-line
import { ElTree } from 'element-plus'
import { funcUploadCode, funcPathContent } from '@/api/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = ref(false)
// @ts-ignore 
const props = defineProps({     // eslint-disable-line
  title: String,
  content: String,
  height: Number,
  theme: String,
  language: String,
  disable: Boolean,
  zipUrl: String,
  hideButton: Boolean,
})
// @ts-ignore 
const emit = defineEmits(['onsave', 'onchange']) // eslint-disable-line
const upload = ref<UploadInstance>()
const dialogVisible = ref(false)
const currentNode = ref({})
let style = computed(() => {
  return "height: " + props.height + "px;"
})

const submitUpload = () => {
  upload.value!.submit()
}

const upError = (res) => {
  ElMessage({
    message: t(`algorithm['上传文件失败']`),
    type: 'error',
  })
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  dialogVisible.value = false
  getFileRootTree()
}

// 处理上传文件
const handleUploadFile = async (param: any) => {
  let formData = new FormData()
  formData.append('file', param.file)
  loading.value = true
  funcUploadCode(formData, props.zipUrl).then(res => {
    ElMessage({
      message: res.data.data.message,
      type: 'success',
    })
    loading.value = false
    getFileRootTree()
    editorInstance.resetValue('')
    upload.value!.clearFiles()
  }).catch(err => {
    let msg = t(`algorithm['上传失败']`)
    const {response:{data:{errors}}} = err
    if(errors && errors[0]) {
      msg = errors[0]['detail']
    }
    ElMessage({
      message: msg,
      type: 'error',
    })
    upload.value!.clearFiles()
    loading.value = false
  })
}
const handleClose = (done: () => void) => {
  done()
}

let editorInstance: any = null
onMounted(() => {
  // editorInstance = new PhCodeEditorHandler(editorRef.value, "dracula", "json", 1000)
  editorInstance = new PhCodeEditorHandler(editorRef.value, props.theme, props.language, 26)
  editorInstance.setEditorOptions({
    value: props.content,
    fontSize: 14,
    tabSize: 4,
    readOnly: false,
    selectionStyle: "text",
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    wrap: true,
    autoScrollEditorIntoView: true,
    setShowPrintMargin: false,
    highlightGutterLine:true,
    animatedScroll:true,
    showFoldWidgets:true,
    highlightSelectedWord:true,
    highlightActiveLine:true,
    showLineNumbers: true, // 显示行号
    // wrap: true, // 用户输入的sql语句，自动换行
    // enableSnippets: true, // 启用代码段
    // enableLiveAutocompletion: true, // 启用实时自动完成功能 （比如：智能代码提示）
    // enableBasicAutocompletion: true, // 启用基本自动完成功能
    // scrollPastEnd: true, // 滚动位置
    // highlightActiveLine: true, // 高亮当前行
    // selectionStyle: "text",
    // autoScrollEditorIntoView: true,
    // setShowPrintMargin: false
  })
  if (props.disable) {
    editorInstance.setReadOnly()
  }
})

onBeforeUnmount(() => {
  editorInstance.destroy()
})

const editorRef = ref()

// 初始化树数据
const treeData = ref([])

const fileTreeNodeClick = async(node, resolve) => {
  currentNode.value = node
  if(node.type === 'file') {
    await getEditorCode(node)
  }
}

async function loadNode(node, resolve) {
  if (node.data.type === 'dir') {
    const data = await getTreeNodeData(node.data)
    resolve(data)
  } else {
    resolve([])
  }
}

const getEditorCode = (node) => {
  funcPathContent(`${node.path}`).then(res => {
    const codeContent = res.data.data.content
    editorInstance.resetValue(codeContent)
  }).catch(err => {
    let msg = t(`algorithm['获取文件内容失败']`)
    const {response:{data:{errors}}} = err
    if(errors && errors[0]) {
      msg = errors[0]['detail']
    }
    ElMessage({
      message: msg,
      type: 'error',
    })
  })
}

const getTreeNodeData = async (node) => {
  if (!node.path) return;
  const res = await funcPathContent(`${node.path}`)
  const fileList = res.data.data.file_list.map((it,index) => {
    const item = {
      id: `${node.id}-${index+1}`,
      name: it.name,
      path: it.path,
      type: it.type,
      label: it.name,
      isLeaf: true
    }
    if (it.type === 'dir') {
      item.isLeaf = false
      item.children = []
    }
    return item
  })
  return fileList
}

const getFileRootTree = () => {
  funcPathContent(`${props.zipUrl}`).then(res => {
    const rootFileList = res.data.data.file_list.map((it,index) => {
      return {
        id: index+1,
        name: it.name,
        path: it.path,
        type: it.type,
        label: it.name,
        isLeaf: false,
        children: []
      }
    })
    treeData.value = rootFileList
  }).catch(err => {
    let msg = "error"
    const {response:{data:{errors}}} = err
    if(errors && errors[0]) {
      msg = errors[0]['detail']
    }
    // ElMessage({
    //   message: msg,
    //   type: 'error',
    // })
  })
}

watch(
  () => props.zipUrl,
  (newVal, oldVal) => {
    getFileRootTree()
  }
)

</script>

<style lang="scss" scoped>

.upload-btn, .upload-btn:hover, .upload-btn:active, .upload-btn:focus {
  color: #FF7900;
  background: rgba(255,121,0,0.1);
  border-color: #FF7900;
}
.upload-submit, .upload-submit:hover, .upload-submit:active, .upload-submit:focus {
  color: #FFF;
  background: #FF7900;
  border-color: #FF7900;
}
.upload-cancel:hover {
  color: var(--el-button-text-color);
  background-color: var(--el-button-bg-color);
  border: var(--el-border);
  border-color: var(--el-button-border-color);
  padding: 8px 15px;
  font-size: var(--el-font-size-base);
  border-radius: var(--el-border-radius-base);
}
.editor-container {
  display: flex;
  flex-direction: column;

  :deep(.el-tree-node__expand-icon) {
    display: none;
  }

  // margin: 0 30px;
  :deep(.el-dialog) {
    text-align: left;
  }

  .content {
    display: flex;
    flex-grow: 1;

    .file-tree {
      margin-top: 10px;
      width: 200px;
      overflow: auto;
      display: flex;
      height: 490px;
      .el-tree {
        width: 100%;
      }
    }
  }

  .panel {
    margin-top: 15px;
    flex-grow: 0;
    // border: 1px solid transparent;
  }

  .title-panel {
    // background-color: white;
    display: flex;
    flex-direction: row;

    .info {
      // padding: 10px;
      width: 100%;
      display: flex;
      flex-direction: row;

      .el-button--primary {
        background: #FF7900;
        border: none;
      }

      .info-detail {
        display: flex;
        flex-direction: column;

        b {
          display: flex;
        }

        p {
          font-weight: 400;
          margin-top: 2px;
        }
      }

      .info-btn-group {
        flex-grow: 1;
        width: 100px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;

        .info-btn {
          margin: 5px;
        }
      }
    }
  }

  .ace {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    // .editor {
    //   flex-grow: 1;
    //   margin: 10px 0;
    //   border: 1px solid #c6e2ff;
    // }
    .editor {
      // position: absolute;
      inset: 0 0;
      min-height: 100%;
    }
  }
}
</style>