<template>
  <div class="editor-container" :style="style">
    <div class="panel">
      <div class="title-panel">
        <div class="info">
          <div class="info-detail">
            <b>{{ title }}</b>
          </div>
          <div class="info-btn-group" v-if="!props.hideButton">
            <el-button type="primary" class="info-btn"
              @click="$emit('onsave', editorInstance.outContent())">{{$t(`common['保存']`)}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class=ace>
      <div ref="editorRef" class="editor"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Upload } from "@element-plus/icons-vue"
import { funcUploadCode } from '@/api/api'
import { onMounted, onBeforeUnmount, ref, computed, onUpdated, watch } from "vue"
import type { UploadProps, UploadInstance, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { genFileId } from 'element-plus'
import PhCodeEditorHandler from '../../lib/codeeditorhandler'
// @ts-ignore 
import { ArrowRight, Search, ArrowRightBold, ArrowLeftBold } from "@element-plus/icons-vue" // eslint-disable-line
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// @ts-ignore 
const props = defineProps({     // eslint-disable-line
  title: String,
  content: String,
  height: Number,
  theme: String,
  language: String,
  disable: Boolean,
  hideButton: Boolean,
})
// @ts-ignore 
const emit = defineEmits(['onsave', 'onchange']) // eslint-disable-line
const upload = ref<UploadInstance>()
const dialogVisible = ref(false)
let style = computed(() => {
  return "height: " + props.height + "px;"
})
let editorInstance: any = null
onMounted(() => {
  // editorInstance = new PhCodeEditorHandler(editorRef.value, "dracula", "json", 1000)
  editorInstance = new PhCodeEditorHandler(editorRef.value, props.theme, props.language, 1000)
  console.log("props.content", props.content)
  editorInstance.setEditorOptions({
    value: props.content,
    fontSize: 14,
    tabSize: 4,
    readOnly: false,
    wrap: true, // 用户输入的sql语句，自动换行
    enableSnippets: true, // 启用代码段
    showLineNumbers: true, // 显示行号
    enableLiveAutocompletion: true, // 启用实时自动完成功能 （比如：智能代码提示）
    enableBasicAutocompletion: true, // 启用基本自动完成功能
    scrollPastEnd: true, // 滚动位置
    highlightActiveLine: true, // 高亮当前行
    selectionStyle: "text",
    autoScrollEditorIntoView: true,
    setShowPrintMargin: false
  })
  if (props.disable) {
    editorInstance.setReadOnly()
  }
})

onBeforeUnmount(() => {
  editorInstance.destroy()
})

watch(
  () => props.content,
  (newVal, oldVal) => {
    editorInstance.resetValue(newVal)
  }
)


const editorRef = ref()
</script>

<style lang="scss" scoped>
.editor-container {
  display: flex;
  flex-direction: column;

  // margin: 0 30px;
  :deep(.el-dialog) {
    text-align: left;
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
      padding: 10px;
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

    .editor {
      flex-grow: 1;
      margin: 10px 0;
      border: 1px solid #c6e2ff;
    }
  }
}
</style>