/*
 * @Author: your name
 * @Date: 2021-07-09 14:49:00
 * @LastEditTime: 2021-11-12 16:57:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-management-system\src\store\getters.js
 */
const getters = {
  obj_attr_active: state => state.globalStatus.obj_attr_active,
  allGroup: state => state.globalStatus.allGroup,
  view_setting: state => state.setting.view_setting,
  arrt_setting: state => state.setting.arrt_setting,
  frame_idx: state => state.videoStatus.frame_idx,
  countFrame: state => state.videoStatus.countFrame,
  csvRows: state => state.videoStatus.csvRows,
  imgUrl: state => state.videoStatus.imgUrl,
  frameList: state => state.videoStatus.frameList
}
export default getters

