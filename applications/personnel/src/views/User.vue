<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div class="header">
      <span>用户管理</span>
      <el-button class="add" size="small" :icon="Plus">人员录入</el-button>
    </div>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column prop="code" label="账号" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column
        prop="role"
        label="角色"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag v-for="item in scope.row.role">{{ item }}</el-tag>
          <!-- <el-tag>{{ scope.row.role }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" width="120">
        <template #default>
          <!-- <el-button type="primary" size="small" ref="buttonRef" v-hover-outside="onClickOutside">...</el-button> -->
          <el-popover
            placement="top-start"
            title="Title"
            :width="200"
            trigger="hover"
            content="this is content, this is content, this is content"
          >
            <template #reference>
              <el-button class="m-2">...</el-button>
            </template>
          </el-popover>
        </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" >
import { defineComponent } from 'vue';
import { ClickOutside as vClickOutside } from 'element-plus'
// import { Search, Plus, Delete } from "@element-plus/icons-vue"
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { ref, unref } from 'vue'
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const tableData = [
  {
    code: '2016-05-03',
    name: 'Tom',
    email: '123@163com',
    role: ['管理员','管理员2'],
    phone: '1234567890',
  }
]


export default defineComponent({
  name: 'User',
  components: {},
  data(){
    return {
      tableData: tableData
    }
  },
  methods: {}
});
</script>

<style lang="scss" scoped>
.home {
  .header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: flex-end;

    span {
      font-family: PingFang SC;
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
      letter-spacing: 0em;
      text-align: left;
      color: balck;
      line-height: 32px;
    }

    .add {
      width: 102px;
      height: 32px;
      top: 116px;
      left: 1314px;
      padding: 5px, 12px, 5px, 10px;
      border-radius: 4px;
      gap: 4px;
      background: rgba(4, 163, 255, 1);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: center;
      color: white;
    }
  }

  .el-table {
    border: 1px solid rgba(225, 227, 235, 1);
    margin-top:20px;
    border-radius: 8px;

    thead {
      background-color: #f3f4f7;
    }
  }

  .el-tag {
    background: rgba(141, 145, 165, 1);
    color: white;
  }
  .el-tag--primary .el-tag--light {
    background: rgba(141, 145, 165, 1)!important;
  }

  .m-2 {
    border: none;
    background-color: none;
    width: 32px;
    height: 32px;
  }

  .m-2:hover {
    background-color: #5b5e70;
  }
}
</style>
