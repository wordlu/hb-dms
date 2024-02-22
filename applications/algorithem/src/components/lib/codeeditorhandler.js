// 引入全局实例
import ace from 'ace-builds'
// 主题风格，引入主题后还需要在 options 中指定主题才会生效
import 'ace-builds/src-min-noconflict/theme-monokai'
import 'ace-builds/src-min-noconflict/theme-dracula'
import 'ace-builds/src-min-noconflict/theme-github'
// 支持代码格式， 需要引入具体的语法高亮库才会有对应的语法高亮效果
import 'ace-builds/src-min-noconflict/mode-javascript'
import 'ace-builds/src-min-noconflict/mode-python'
import 'ace-builds/src-min-noconflict/mode-dockerfile'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/mode-css'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import jsWorkerUrl from 'file-loader!ace-builds/src-noconflict/worker-javascript'
import jsonWorkerUrl from 'file-loader!ace-builds/src-noconflict/worker-json'
import cssWorkerUrl from 'file-loader!ace-builds/src-noconflict/worker-css'
// import javascriptWorkUrl from 'file-loader!ace-builds/src-noconflict/snippets/javascript.js'
// import cssSniWorkUrl from 'file-loader!ace-builds/src-noconflict/snippets/javascript.js'

export default class PhCodeEditorHandler {
  constructor(ref, theme, language, maxLines) {
    ace.config.setModuleUrl('ace/mode/javascript_worker', jsWorkerUrl)
    ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl)
    ace.config.setModuleUrl('ace/mode/css_worker', cssWorkerUrl)
    ace.config.setModuleUrl(
      'ace/snippets/javascript',
      require('file-loader!ace-builds/src-noconflict/snippets/javascript.js')
    )
    ace.config.setModuleUrl('ace/snippets/css',
      require('file-loader!ace-builds/src-noconflict/snippets/css.js'))

    this.editor = ace.edit(ref, {
      mode: `ace/mode/${language}`,
      theme: `ace/theme/${theme}`,
      maxLines: maxLines
    })
  }

  resetValue(value) {
    this.editor.setValue(value)
  }

  // 设置属性等，具体需要可根据官方参数自行设置
  setEditorOptions(options) {
    this.editor.setOptions(options)
  }

  // 获取编辑器内容
  outContent() {
    return this.editor.getValue()
  }

  gotoLine(lineNumber) {
    this.editor.gotoLine(lineNumber)
  }

  setReadOnly() {
    this.editor.setReadOnly(true)
  }

  destroy() {
    this.editor.destroy()
  }

}