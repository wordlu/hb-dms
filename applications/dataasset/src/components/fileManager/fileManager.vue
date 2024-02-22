<template>
  <div>
    <el-dialog
      id="fileManager"
      title="文件管理器"
      :visible.sync="fileManagerProps.dialogVisible"
      width="1000px"
      v-dialogDrag
      :before-close="handleClose"
      append-to-body>
      <span class="fileManager-container">
        <div class="file-top">
          <div class="file-path">
            <span class="el-icon-share" style="margin-right: 4px;font-size: 12px;margin-right: 8px;"></span>
            <el-input 
              v-model="filePath" 
              style="width: 100%;" 
              @change="changeFilePath"
              @focus="getCursor"
              @blur="inputBlur"
              size="small"></el-input>
            <span class="file-path-prefix" v-if="!inputfocus">
              <span class="file-path-prefix-item" v-for="(item,index) in filePath.split('/')" :key="index" @click="backPath(item,index)">
                {{ item !== ''?item:index==0?'/':'' }}
                <svg-icon icon-class="dataSetlistRight" class="dataSetlistRight" style="width:10px;height:10px;margin-left:8px;" v-if="index !== filePath.split('/').length-1"/>
              </span>
            </span>
          </div>

          <div class="file-search">
            <el-input
              size="small"
              :placeholder="`在${filePath.length == 0?'根':filePath.split('/')[filePath.split('/').length-1]}目录搜索`"
              prefix-icon="el-icon-search"
              @change="searchFile"
              v-model="input2">
            </el-input>
          </div>
        </div>
        <div class="file-container">
          <div class="file-list-title">
            <div class="name">
              名称
            </div>
            <div class="type">
              类型
            </div>
          </div>
          <ul class="file-list infinite-list-wrapper"
            v-infinite-scroll="load">
            <div class="nullList-icon" v-if="fileList.length == 0 && !loading">
              <svg-icon icon-class="nullList" class="nullList" style="width:96px;height:96px"/>
              <span>
                数据为空
              </span>
            </div>
            <li class="file-list-item" v-for="(item,index) in fileList" :key="index">
              <el-radio v-model="selectPath" :label="item.path"></el-radio>
              <span class="container" @click="toDir(item)">
                <img style="width: 15px;height: 15px;" :src="require('@/assets/dir.png')" alt="" v-if="item.type == 'dir'">
                <img style="width: 15px;height: 15px;" :src="require('@/assets/file.png')" alt="" v-else>
                <div class="name">
                  {{ item.name }}
                </div>
                <div class="type">
                  {{ item.type_name }}
                </div>
              </span>
            </li>

            <!-- <p v-if="listLoading">加载中...</p>
            <p v-if="noMore">没有更多了</p> -->
          </ul>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="fileManagerProps.dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="selectSure">确 认 选 择</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { func_file_tree } from '@/api/dataset';
export default {
  props:{
    fileManagerProps:{
      type:Object
    }
  },
  data() {
    return {
      fileList:[],
      fileInfo:{},
      input2:'',
      filePath:'',
      inputfocus:false,
      loading:false,
      selectPath:'',
      count: 100,
      listLoading: false,
      submitFrom:{
        search:'',
        dir_path:'',
        connector:this.fileManagerProps.connector,
        next_token:''
      },
      next_token:'',
      noMore:true
    };
  },
  computed: {
    // noMore () {
    //   return this.count >= 1000
    // },
    // disabled () {
    //   return this.listLoading || this.noMore
    // }
  },
  created(){
    this.getfileInfo()

    console.log(this.submitFrom,'submitFrom')
  },
  methods: {
    load () {
      console.log(this.noMore,'this.noMore')
      this.loading = true
      if(!this.noMore){
        this.searchFile()
      }
      
      // setTimeout(() => {
      //   this.count += 100

      //   this.loading = false
      // }, 2000)
    },
    getFileTree(options){
      func_file_tree(options).then(res=>{
        if(!res.data.next_token){
          this.noMore = true
        }else{
          this.noMore = false
          this.next_token = res.data.next_token
        }

        for(let i=0;i<res.data.children.length;i++){
          this.fileList.push(res.data.children[i])
        }
        this.fileInfo = res.data;
        this.filePath = res.data.path == ''?"/":res.data.path;
      })
    },
    searchFile(){
      let options = {
        search:this.input2,
        dir_path:this.filePath,
        connector:this.fileManagerProps.connector,
        next_token:this.next_token
      }
      this.getFileTree(options)
    },
    selectSure(){
      if(this.selectPath == '' || this.selectPath == null){
        this.$alert('请选择路径', '提示', {
          confirmButtonText: '确定'
        });
      }else{
        this.$emit('setPath',this.selectPath);
        this.fileManagerProps.dialogVisible = false;
      }
    },
    getCursor(){
      this.inputfocus = true
    },
    inputBlur(){
      this.inputfocus = false
    },
    toDir(item){
      if(item.type == 'dir'){
        this.fileList = []
        this.input2 = ''
        let options = {
          dir_path:item.path,
          connector:this.fileManagerProps.connector
        }
        this.getFileTree(options)
      }
    },
    backPath(path,index){
      let clcikPath = '';
      for(let i=0;i<=index;i++){
        if(i==0){
          clcikPath = '/'
        }else{
          if(i == index){
            clcikPath += this.filePath.split('/')[i]
          }else{
            clcikPath += this.filePath.split('/')[i]+'/'
          }
        }
      }

      if(clcikPath !== this.filePath){
        this.fileList = []
        this.input2 = ''
        let options = {
          dir_path:clcikPath,
          connector:this.fileManagerProps.connector
        }
        this.getFileTree(options)
      }
      
    },
    changeFilePath(){
      this.fileList = []
      this.input2 = ''
      let options = {
        dir_path:this.filePath,
        connector:this.fileManagerProps.connector
      }
      this.getFileTree(options)
    },
    async getfileInfo(){
      this.loading = true;
      this.submitFrom.dir_path = !this.fileManagerProps.path?'/':this.fileManagerProps.path;

      await this.getFileTree(this.submitFrom)
      this.loading = false;
    },
    handleClose(){
      this.fileManagerProps.dialogVisible = false
    },
    byteToTB(e){
      let byte = e
      if(byte > 0){
          let kb = byte / 1024
          if(kb >= 1024){
              let mb = kb / 1024
              if(mb >= 1024){
                  let gb = mb / 1024
                  if(gb >= 1024){
                    let tb = gb / 1024
                    return tb.toFixed(1) + 'TB'
                  }else{
                    return gb = gb.toFixed(1)+'GB'
                  }
              }else{
                  return mb = mb.toFixed(1)+'MB'
              }
          }else{
              return kb = kb.toFixed(1)+'KB'
          }
      }else{
          return '0KB'
      }
    }
  }
}
</script>

<style lang="scss">
.el-message-box{
  width: 480px;
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
#fileManager{
  .el-dialog__body{
    .el-button--primary{
      color:#FF7900;
      border-color: #FF7900;
      background: #ffffff;
    }
    .el-button--primary:hover{
      background-color: rgba($color: #FF7900, $alpha: .1);
    }
  }
  .el-dialog__title{
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    color: #313235;
  }

  .el-dialog__footer{
    .el-button--primary{
      background-color:#FF7900;
      border-color: #FF7900;
    }
  }
  .el-dialog{
    border-radius: 12px;
  }
  .fileManager-container{
    width: 100%;
    .file-top{
      display: flex;
      .file-path{
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 8px;
        border: 1px solid rgba($color: #313235, $alpha: .3);
        //styleName: General/text-md/CN-Regular;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        border-radius: 8px;
        .el-input__inner {
          width: 100%;
          flex: 1;
          border: none;
        }
        .file-path-prefix{
          // width: 100%;
          height: 32px;
          display: flex;
          position: absolute;
          // padding: 0 8px;
          left: 40px;
          top: 0;
          background: #ffffff;
          .file-path-prefix-item{
            padding: 8px;
            display: flex;
            align-items: center;
            cursor: pointer;
          }

          .file-path-prefix-item:hover{
            background: rgba($color: #4e4e4d, $alpha: .1);
          }
        }
      }
      .file-search{
        margin-left: 15px;
        .el-input__inner {
          border: 1px solid rgba($color: #313235, $alpha: .3);
          border-radius: 8px!important;
        }
        .el-input__inner::placeholder{
          font-size: 12px;
          color: #606266;
        }
        .el-icon-search{
          color: #606266;
        }
      }
    }

    .file-container{
      width: 100%;
      
      padding: 8px;
      .el-radio__label{
        display: none;
      }
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #884DFF;
        background: #884DFF;
      }
      .file-list-title{
        display: flex;
        padding: 16px 0;
        font-weight: 800;
        font-size: 14px;
        .name{
          flex: 1;
        }
        .size{
          width: 150px;
        }
        .type{
          width: 150px;
        }
        .create-time{
          width: 250px;
        }
        div:not(.name){
          border-left: 1px solid rgba($color: #313235, $alpha: .3);
          padding-left: 8px;
        }
      }
      .nullList-icon{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        span{
          margin-top: 8px;
          font-family: 'PingFang SC';
          font-style: normal;
        }
      }
      .file-list{
        width: 100%;
        height: 400px;
        overflow: auto;
        
        .file-list-item{
          height: 30px;
          padding: 4px;
          display: flex;
          align-items: center;
          cursor: pointer;
          border-radius: 4px;
          .container{
            flex: 1;
            display: flex;

            img{
              margin-right: 8px;
            }
            .name{
              flex: 1;
            }
            .size{
              width: 150px;
            }
            .type{
              width: 150px;
            }
            .create-time{
              width: 250px;
            }
            div:not(.name){
              padding-left: 14px;
            }
          }
          
        }
        .file-list-item:hover{
          background: rgba($color: #313235, $alpha: .1);
        }
      }
    }
  }
}
</style>
