<template>
  <div class="left-menu">
    <div class="logo">
      <span><img src="../images/logo-janus.png" alt=""/></span>
      <span>Janus网关</span>
    </div>
    <!-- <el-menu :default-active="onRoutes()" class="el-menu-vertical" @select="handleSelectMenu">
          <el-menu-item index="desktop">DeskTop</el-menu-item>
          <el-menu-item index="home">首页</el-menu-item>
          <el-menu-item index="route-manage-list">路由管理</el-menu-item>
          <el-menu-item index="group-manage-list">组件管理</el-menu-item>
          <el-menu-item index="gateway-monitor">网关监控</el-menu-item>
          <el-menu-item index="log-manage-list">日志管理</el-menu-item>
          <el-menu-item index="fuse-manage">熔断管理</el-menu-item>
          <el-menu-item index="gateway-eureka">注册中心管理</el-menu-item>
          <el-menu-item index="router-connecte-test">路由联通性测试</el-menu-item>
          <el-menu-item index="gateway-swagger">网关Swagger</el-menu-item>
          <el-menu-item index="system-black-name">系统黑名单</el-menu-item>
          <el-menu-item index="gateway-audit">网关审计</el-menu-item>
          <el-menu-item index="gateway-set-up">网关设置</el-menu-item>
      </el-menu> -->
    <el-menu
      class="el-menu-vertical"
      :default-active="activeMenu"
      :router="true"
      :collapse-transition="false"
      :collapse="false"
    >
      <template v-for="(item, index) in subMenus">
        <template v-if="item.subMenus && item.subMenus.length">
          <el-submenu :index="item.url || index" :key="index">
            <template slot="title">
              <i v-if="item.icon" :classX="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <!--<el-menu-item-group>-->
              <el-menu-item
                v-for="(child, i) in item.subMenus"
                :index="child.url"
                :key="i"
                >
                <!--<i v-if="child.icon" :class="child.icon"></i>-->
                <span slot="title">{{ child.name }}</span>
              </el-menu-item
              >
            <!--</el-menu-item-group>-->
            <!-- <el-menu-item-group>
              <el-menu-item
                v-for="(subMenu, i) in item.subMenus"
                :index="subMnu.url"
                :key="i"
                >
                <i v-if="subMenu.icon" :class="subMenu.icon"></i>
                <span slot="title">{{ subMenu.name }}</span>
              </el-menu-item
              >
            </el-menu-item-group> -->
          </el-submenu>
        </template>
        <el-menu-item v-else :index="item.url" :key="index">
          <i v-if="item.icon" :classX="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'LeftMenuTmpl',
  data() {
    return {
      subMenus: [],
    };
  },
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
  methods: {
  },
  created() {
    this.$http
      .get('/admin/menu/queryMenu')
      .then(res => {

        if (res && res[0] && Array.isArray(res[0].subMenus)) {
          this.subMenus = res[0].subMenus;
        }
      })
      .catch(err => {
        this.$message({
          message: this.$helper.handleLoginErrorMsg(err),
          type: 'error',
        });
      });
  },
};
</script>
<style lang="less">
@import '../styles/common/left-menu.tmpl.less';
</style>
<style lang="less" scoped>
@import '../styles/transition.less';
</style>
