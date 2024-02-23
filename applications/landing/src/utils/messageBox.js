import { ElMessageBox } from 'element-plus'
import { h } from 'vue'
import jsonData from '@/assets/pageConfig'

export const contactMessageBox = function ( callback ) {
  ElMessageBox({
    title: `${jsonData.title}`,
    message: h('div', null, [
      h('div', { style: 'color: #5A5E72;fontSize: 14px; margin: 0px 0px 16px 10px;' }, `邮箱:  ${jsonData.email}`),
      h('div', { style: 'color: #5A5E72;fontSize: 14px; margin-left: 10px;' }, `电话:  ${jsonData.phone}`),
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    customStyle: 'height: 190px !important;',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        done();
      } else {
        done();
      }
    }
  }).then(action => {
    
  }).catch((err)=>{
    callback(err)
  })
};


