<template>
  <div class="tags">
    <el-tooltip class="item" v-for="(item,index) in icons" :key="index" effect="dark" :content="item.name" placement="top">
      <span :class="`icon-item ${item.id === selTagId ? 'icon-item-show' : ''}`" :style="{ 'background' : '#F56C6C' }">
        <span class="icon-item-Clearday" @click="clickTag(item.id)" >
          <img :src="'/' +item.pattern" alt="" style="width:32px;height:32px">
        </span>
        <div class="clearTag" v-if="item.id === selTagId" @click="clearTag(item.id)">
          <svg-icon icon-class="dataSetListClear" class="dataSetListClear" style="width:16px;height:16px"/>
        </div>
      </span>
    </el-tooltip>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  icons: {
    type: Array,
    default: []
  },
  clickDisable: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['clearTag'])

const selTagId = ref()

function clickTag(id) {
  if (props.clickDisable) return
  selTagId.value = id
}

function clearTag(id) {
  selTagId.value = ''
  emits('clearTag', id)
}
    
</script>

<style lang="scss">
.tags{
  display: flex;
  // justify-content: center;
  // align-items: center;
  flex-wrap: wrap;
  .icon-item{
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 4px;
    cursor:pointer;
    height: 32px;
    margin-bottom: 1.5px;
    .icon-item-Clearday{
      // padding: 0px 6px;
      height: 32px;
      display: flex;
      align-items: center;
    }
    .clearTag{
      width: 24px;
      position: relative;
      .dataSetListClear{
        position: absolute;
        right: 6px;
        top: 50%;
        margin-top: -8px;
      }
    }
  }
  .icon-item-show{
    border-radius: 8px 24px 24px 8px;
  }
}
</style>