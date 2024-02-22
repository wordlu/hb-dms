<template>
  <div class="search-filter">
    <div class="filter-btn" @click.stop="openFilterContent">
      <svg-icon icon-class="dataSetListFilter" class="dataSetListFilter" style="width:15px;height:15px"/>
      <span>
        {{ $t('common["筛选"]') }}
      </span>
      <svg-icon icon-class="dataSetlistRight" class="dataSetlistRight" style="width:12px;height:12px"/>
    </div>
    <div class="filter-btn-content" ref="filterContent" v-show="showFilterContent">
      <div class="filter-bar">
        <el-autocomplete
          :placeholder="$t(`common['搜索标签']`)"
          prefix-icon="el-icon-search"
          style="height:32px;width:208px"
          :fetch-suggestions="querySearchAsync"
          clearable
          @select="handleSelect"
          @clear="showAllTags"
          v-model="input">
        </el-autocomplete>

        <button class="refilter-btn" type='button' @click="reFilter">
          {{ $t('common["重置筛选"]') }}
        </button>
      </div>

      <div class="filter-icons">
        <el-tooltip class="item" v-for="(item,index) in restaurants" :key="index" effect="dark" :content="item.name" placement="bottom">
          <el-badge :value="item.hasItem?'已选':''" class="item" type="primary">
            <span @click="seticons(item)" :key="index" class="icon-item"  :style="{'background':item.color}">
              <img v-if="item.sub != 'custom'" :src="'/'+item.pattern" alt="" style="width:32px;height:32px">
              <span class="icon-item-custom" v-if="item.sub == 'custom'">
                {{ item.name }}
              </span>
            </span>
          </el-badge>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    showFilterContent:Boolean,
    icons:Array,
    oneClearTag:Object,
    categoryStr:String,
    iconName:{
      type: String,
      default: () =>  ''
    },
    reAllTags:Number
  },
  data(){
    return{
      input:'',
      restaurants: [],
      icons_all:[],
    }
  }, 
  watch:{
    icons:{
      handler(newVal){
        for(let i=0;i<this.restaurants.length;i++){
          for(let j=0;j<newVal.length;j++){
            if(this.restaurants[i].name == newVal[j].name){
              this.$set(this.restaurants[i],'hasItem',true)
            }
          }
        }

        for(let i=0;i<this.icons_all.length;i++){
          for(let j=0;j<newVal.length;j++){
            if(this.icons_all[i].name == newVal[j].name){
              this.$set(this.icons_all[i],'hasItem',true)
            }
          }
        }
      },
      deep: true
    },
    reAllTags(newVal){
      this.getIcons()
    },
    oneClearTag:{
      handler(newVal){
        for(let i=0;i<this.restaurants.length;i++){
          if(newVal.name == this.restaurants[i].name){
            this.$set(this.restaurants[i],'hasItem',null)
          }
        }

        for(let i=0;i<this.icons_all.length;i++){
          if(newVal.name == this.icons_all[i].name){
            delete this.icons_all[i].hasItem
          }
        }
      },
      deep: true
    }
  },
  created(){
    this.getIcons()
  },
  mounted(){
    document.addEventListener('click', this.hideFilterContent);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideFilterContent);
  },
  methods:{
    hideFilterContent(e) {
      // 判断是否点击需隐藏的 div 及其内部元素
      if (this.showFilterContent && !this.$refs.filterContent.contains(e.target)) {
        this.$emit('setShowFilterContent',false)
      }
    },
    getIcons(){
      this.$dataassetApi['findAll']('tags',{}).then(res=>{
        this.icons_all = res.data
        this.$emit('setAllTags',this.icons_all)
        this.setIconsAllStatus()
        this.restaurants = JSON.parse(JSON.stringify(this.icons_all))
      })
    },
    setIconsAllStatus(){
      let arr = this.icons.filter((item)=>{
        return item.hasItem == true
      })
      for(let i=0;i<arr.length;i++){
        for(let j=0;j<this.icons_all.length;j++){
          if(arr[i].hasItem && this.icons_all[j].name == arr[i].name ){
            this.$set(this.icons_all[j],'hasItem',true)
          }
        }
      }
    },
    reFilter(){
      this.input=''
      this.$emit('reFilter')
      for(let j=0;j<this.icons_all.length;j++){
        if(this.icons_all[j].hasItem){
          this.$set(this.icons_all[j],'hasItem',false)
        }
      }
      this.restaurants = JSON.parse(JSON.stringify(this.icons_all))
    },
    showAllTags(){
      let icons_all = JSON.parse(JSON.stringify(this.icons_all))
      this.restaurants = []

      for(let i=0;i<icons_all.length;i++){
        let hasItem = false;
        for(let j=0;j<this.icons.length;j++){
          if(icons_all[i].name == this.icons[j].name && this.icons[j].hasItem){
            hasItem = true
            this.restaurants.push(JSON.parse(JSON.stringify(this.icons[j])))
          }
        }

        if(!hasItem){
          this.restaurants.push(icons_all[i])
        }
      }
    },
    seticons(item){
      let c_item = JSON.parse(JSON.stringify(item))
      let arr = this.icons.filter((i)=>{
        return i.name == c_item.name
      })
      
      if(arr.length == 0 ){
        this.$set(c_item,'hasItem',true)
        this.icons.push(c_item)

        for(let i=0;i<this.restaurants.length;i++){
          if(this.restaurants[i].name == c_item.name){
            this.$set(this.restaurants[i],'hasItem',true)
          }
        }
      }
    },
    openFilterContent(){
      if(this.showFilterContent){
        this.$emit('setShowFilterContent',false)
      }else{
        this.$emit('setShowFilterContent',true)
      }
    },
    querySearchAsync(queryString, cb) {
      var restaurants = JSON.parse(JSON.stringify(this.icons_all));
      restaurants.forEach(item => {
        item.value = item.name
      });

      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      clearTimeout(this.timeout);
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelect(item) {
      let hasTag = false;
      for(let i=0;i<this.icons.length;i++){
        if(this.icons[i].name == item.name){
          hasTag = true
          this.restaurants = [JSON.parse(JSON.stringify(this.icons[i]))]
        }
      }
      if(!hasTag){
        this.restaurants = [JSON.parse(JSON.stringify(item))]
      }
    }
  }
}
</script>

<style lang="scss">
.search-filter{
  margin-left: 12px;
  display: flex;
  position: relative;

  .filter-btn{
    height: 40px;
    // width: 96px;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select:none;
    span{
      margin: 0px 6.5px;
    }

    /* 01 Netural/N000 */
    background: #FFFFFF;
    /* 01 Netural/N080 */

    border: 1px solid #E1E3EB;
    border-radius: 8px;
    
  }
  .filter-btn-content{
    width: 320px;
    height: 340px;
    position: absolute;
    bottom: -344px;
    left: 0px;
    /* 01 Netural/N000 */
    background: #FFFFFF;
    /* Light/Depth-Z300 */
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 16px 12px 0px 0px;
    z-index: 1;
    .filter-bar{
      display: flex;
      margin-left: 12px;
      .el-input__inner{
        height: 32px;
      }
      .el-input__icon{
        line-height: 32px!important;
      }
      .refilter-btn{
        // width: 85px;
        width: auto;
        height: 32px;
        padding: 5px 12px;
        margin-left: 8px;
        background: #F3F4F7;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        /* identical to box height, or 157% */
        text-align: center;
        /* 01 Netural/N500 */
        color: #5A5E72;
        /* Inside auto layout */
        flex: none;
        order: 0;
        flex-grow: 0;

        outline: none;
        border:none;
        cursor:pointer;
      }
    }
    .filter-icons{
      width: 100%;
      height: calc(340px - 64px);
      overflow: auto;
      // display: flex;
      flex-wrap: wrap;
      padding: 16px 0px 12px;
      .icon-item{
        min-width: 32px;
        height: 32px;
        border-radius: 8px;
        margin-left: 12px;
        // padding: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        margin-bottom: 12px;
        &-custom{
          min-width: 32px;
          height: 100%;
          display: flex;
          padding-left: 3px;
          padding-right: 3px;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
        }
      }
    }
  }
  .filter-btn:hover{
    cursor:pointer;
    border: 1px solid #FF7900;
  }
  .el-badge__content.is-fixed {
    right: 35px;
  }
}
</style>