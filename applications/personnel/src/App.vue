/* eslint-disable */

<template>
  <router-view></router-view>

</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.el-popper, .is-light, .el-popover {
  min-width: 120px!important;
  padding: 0!important;

  .el-popper__arrow {
      display: none;
    }

  .popover-list {

    .el-button {
      height: 40px!important;
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: left;
    }
  }

  .el-button--danger {
    background: none;
    border: 0;
    color: red;
  }

  .el-button+.el-button {
    margin-left: 0px;
  }
}
</style>
