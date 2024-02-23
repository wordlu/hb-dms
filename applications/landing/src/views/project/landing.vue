<template>
  <div id="landing_home">
    <!-- header 信息 -->
    <div class="Home-page-details">
      <b class="welcome">
        {{$t(`dataprojects['开发中，敬请期待']`)}}...
      </b>
    </div>
  </div>
</template>
<script setup>
</script>

<style lang="scss">
// UI 设计图比例 1440px 900px

$sizeToPc:12px;

#landing_home{
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
    padding: 40px 120px 15px 96px;
    display: flex;
    
    .project-list-left{
      width: 75%;
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
          // width: 80px;
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

    .project-list-right{
      padding: 24px;
      width: calc(25% - 24px);
      background: #F9F9FB;
      border-radius: 12px;
      margin-left: 24px;
      color: #5A5E72;
      font-family: Roboto;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
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
  #landing_home{
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