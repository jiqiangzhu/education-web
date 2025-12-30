<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">7</div>
        <span class="logo-text">数据管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#fff"
        text-color="#333"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/home">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </el-menu-item>
        <el-submenu index="user">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/student">
            <i class="el-icon-user-solid"></i>
            <span>学生管理</span>
          </el-menu-item>
          <el-menu-item index="/instructor">
            <i class="el-icon-s-custom"></i>
            <span>讲师管理</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="course">
          <template slot="title">
            <i class="el-icon-notebook-2"></i>
            <span>课程管理</span>
          </template>
          <el-menu-item index="/course/video">
            <span>视频课程</span>
          </el-menu-item>
          <el-menu-item index="/course/live">
            <span>直播课程</span>
          </el-menu-item>
          <el-menu-item index="/course/audio">
            <span>音频课程</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/marketing">
          <i class="el-icon-s-promotion"></i>
          <span>营销管理</span>
        </el-menu-item>
        <el-menu-item index="/class">
          <i class="el-icon-s-grid"></i>
          <span>班级管理</span>
        </el-menu-item>
        <el-menu-item index="/message">
          <i class="el-icon-message"></i>
          <span>消息管理</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部栏 -->
      <header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入关键词"
            prefix-icon="el-icon-search"
            class="search-input"
            clearable
          />
          <el-tooltip content="全屏" placement="bottom">
            <i class="el-icon-full-screen header-icon" @click="toggleFullscreen"></i>
          </el-tooltip>
          <el-badge :value="3" class="header-badge">
            <el-tooltip content="消息通知" placement="bottom">
              <i class="el-icon-bell header-icon"></i>
            </el-tooltip>
          </el-badge>
          <div class="user-info" @click="handleUserMenu">
            <el-avatar :size="36" :src="userAvatar" class="user-avatar"></el-avatar>
            <span class="username">曲艺</span>
            <span class="user-role">管理员</span>
            <i class="el-icon-arrow-down user-arrow"></i>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      searchKeyword: '',
      userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    currentPageTitle() {
      return this.$route.meta?.title || '工作台'
    }
  },
  methods: {
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    },
    handleUserMenu() {
      // 可以添加用户菜单下拉功能
      this.$message.info('用户菜单功能')
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #e8eaed;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e8eaed;
  transition: all 0.3s;
}

.logo:hover {
  background-color: #fafafa;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

.logo:hover .logo-icon {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  flex: 1;
  border: none;
  padding: 8px 0;
}

.sidebar-menu ::v-deep .el-menu-item,
.sidebar-menu ::v-deep .el-submenu__title {
  height: 48px;
  line-height: 48px;
  margin: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.sidebar-menu ::v-deep .el-menu-item i,
.sidebar-menu ::v-deep .el-submenu__title i {
  margin-right: 8px;
  font-size: 18px;
  width: 18px;
  text-align: center;
}

.sidebar-menu ::v-deep .el-menu-item:hover {
  background-color: #f0f7ff;
  color: #409EFF;
}

.sidebar-menu ::v-deep .el-menu-item.is-active {
  background-color: #e6f4ff;
  color: #409EFF;
  font-weight: 500;
}

.sidebar-menu ::v-deep .el-submenu__title:hover {
  background-color: #f0f7ff;
  color: #409EFF;
}

.sidebar-menu ::v-deep .el-submenu .el-menu-item {
  height: 44px;
  line-height: 44px;
  padding-left: 48px !important;
  margin: 2px 12px;
}

.sidebar-menu ::v-deep .el-submenu .el-menu-item i {
  font-size: 16px;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

.header {
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #e8eaed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-input {
  width: 240px;
}

.search-input ::v-deep .el-input__inner {
  border-radius: 20px;
  border-color: #e0e0e0;
  transition: all 0.3s;
}

.search-input ::v-deep .el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.header-icon {
  font-size: 20px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  padding: 6px;
  border-radius: 4px;
}

.header-icon:hover {
  color: #409EFF;
  background-color: #f0f7ff;
}

.header-badge {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.user-info:hover .user-avatar {
  border-color: #409EFF;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.user-role {
  font-size: 12px;
  color: #909399;
  padding: 2px 8px;
  background-color: #f0f2f5;
  border-radius: 10px;
}

.user-arrow {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s;
}

.user-info:hover .user-arrow {
  transform: rotate(180deg);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #f5f7fa;
}

/* 滚动条样式优化 */
.content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

