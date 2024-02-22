// import { h } from 'vue'
import ElementUI from "element-ui";//这里是引入 element 
import jsonData from '@/assets/pageConfig'

export const contactMessageBox = function (h, callback) {
  const content = h('div', null, [
    h('div', { style: 'color: #5A5E72;fontSize: 14px; margin: 0px 0px 16px 10px;' }, `邮箱:  ${jsonData.email}`),
    h('div', { style: 'color: #5A5E72;fontSize: 14px; margin-left: 10px;' }, `电话:  ${jsonData.phone}`),
  ])
  ElementUI.MessageBox.confirm(content, {
      title: `${jsonData.title}`,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: false,
    }).then(() => {
    callback()
  })
  .catch(() => {});
};
