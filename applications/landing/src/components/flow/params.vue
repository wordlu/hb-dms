<template>
  <div class="params">
    <div class="params-content">
      <p class="params-title">参数</p>
      <div class="params-list">
        <!-- 参数列表 -->
        <div class="params-item" v-for="(val, key, index) in params" :key="key">
          <!-- 分割线 -->
          <p class="split-line" :class="{ 'hide': index === 0 }"></p>
          <!--参数下子标题  -->
          <p class="params-item-name">{{ val.title }}</p>
          <!-- 输入参数区域 -->
          <div v-for="(p_val, p_key, p_index) in val.params" :key="p_key" :class="{ 'pt-4': p_index !== 0 }">
            <p class="params-item-key">{{ p_val.title }}</p>
            <!-- 开关 -->
            <el-switch v-if="p_val.controltype == 'switch'" v-model="p_val.value" :active-value="'true'"
              :inactive-value="'false'"></el-switch>
            <!-- 多选 -->
            <el-select v-else-if="p_val.controltype == 'select'" class="params-item-key-val" v-model="p_val.value"
              @change="(value) => changeOptions(p_val, p_val.key, value)">
              <el-option v-if="p_val.options" v-for="item_selete in p_val.options" :label="item_selete.label"
                :value="item_selete.value"></el-option>
            </el-select>
            <!-- 原始input -->
            <el-input v-else class="params-item-key-val" v-model="p_val.value" />
          </div>
        </div>
      </div>
    </div>
    <el-button v-if="isRuning" type="danger" class="run-btn" @click="stopClick">
      <svg-icon icon-class="projectFlowPause" style="width:10px;height:16px" />
    </el-button>
    <el-button v-else type="primary" color="#FF7900" class="run-btn" @click="runClick">
      <svg-icon icon-class="projectFlowRun" style="width:10px;height:16px" />
    </el-button>
  </div>
</template>

<script>
import request from '@/utils/request' 
export default {
  props: {
    execParams: {
      type: Object,
      default: {}
    },
    isRuning: {
      type: Boolean,
      default: false
    },
    switchClick: Boolean
  },
  data() {
    return {
      params: [],
      paramsMap: {},
      subItemsMap: {} // Store subItems data by key
    }
  },
  created() {
    console.log(this.execParams)
  },
  methods: {
    createApi(newVal, key) {
      if (newVal.paramsMap) {
        console.log(newVal.paramsMap[key], key)
      }

    },
    changeOptions(item, key, value) {
      if (item.api) {
        item.api({ [key]: value })
      }
      // console.log(key, options)
    },
    runClick() {
      if (this.switchClick) {
        console.log('可以点击')
        this.$emit('run', this.params)
      } else {
        console.log('不可多次点击')
      }
    },
    stopClick() {
      this.$emit('stop')
    },
    toHistoryPage() {
      this.$router.push(`/project/projectFlowHistory/${this.$route.params.id}`)
    }
  },
  watch: {
    execParams(newVal) {
      Object.keys(newVal).forEach(key => {
        const item = newVal[key];
        const params = item.params || [];
        params.forEach((param, index) => {
          if (param.data && param.controltype === "select") {
            const hasDend = !!param?.data.params;
            if (!hasDend) {
              request({
                url: param.data.url,
                method: 'GET'
              }).then((response) => {
                param.options = response || [];
              })
            } else {
              if (!param.payload) {
                param.payload = param.data.params.reduce((obj, curr) => {
                  obj[curr.key] = undefined;

                  const api = (dep) => {
                    param.payload = {
                      ...param.payload,
                      ...dep
                    }
                    request({
                      url: param.data.url,
                      method: 'GET',
                      params: param.payload
                    }).then((response) => {
                      param.options = response || [];
                    })
                  }

                  params.forEach(p => {
                    if (p.key === curr.key) {
                      p.api = api
                    }
                  })

                  return obj;
                }, {})
              }


            }
          }
        })
      });
      this.params = newVal
      console.log(this.params, 'ppp');
    }
  }

}
</script>

<style scoped lang="scss">
.params {
  height: calc(100% - 32px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC';
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px 0;
  width: 320px;

  &-content {
    flex: 1;
    overflow: hidden;
  }

  &-title {
    padding: 0 16px;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #2D2F39;
  }

  &-list {
    height: calc(100% - 40px);
    overflow: auto;
    padding: 0 16px;
  }

  &-item {
    padding-top: 24px 0;

    &-name {
      margin-top: 24px;
      font-weight: 600;
      font-size: 12px;
      line-height: 20px;
      color: #2D2F39;
    }

    &-key {
      font-size: 14px;
      line-height: 22px;
      color: #5A5E72;
      margin: 12px 0 4px;

      &-val {
        box-sizing: border-box;
        height: 40px;
        border-radius: 4px;
        font-size: 14px;
        color: #C2C5D6;
      }
    }
  }

  .run-btn {
    margin: 0 16px;
    border-radius: 8px;
  }
}

.pt-4 {
  padding-top: 4px;
}

.split-line {
  margin-top: 24px;
  height: 1px;
  width: 200%;
  border-radius: 198px;
  background: rgba(11, 12, 14, 0.12);
  transform: scale(0.5) translateX(-50%);

  &.hide {
    display: none;
  }
}
</style>