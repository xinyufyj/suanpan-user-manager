<template>
<div class="app-container clearfix">
  <div class="nav-container pull-left" :style="{ width: `${menuWidth}px` }">
    <div class="logo-container">
      <div class="log-container-inner">
        <img class="logo-img" :src="require('@/assets/img/logo.png')" alt="雪浪云">
        <h1 v-if="!menuCollapsed" class="logo-label">雪浪算盘管理系统</h1>
      </div>
    </div>
    <div class="menu-container">
      <a-menu
        :inline-collapsed="menuCollapsed"
        mode="inline"
        theme="light"
        v-model:selectedKeys="selectedKeys"
      >
        <a-menu-item key="user">
          <template #icon>
            <UserOutlined />
          </template>
          用户管理
        </a-menu-item>
      </a-menu>
    </div>
  </div>
  <div class="app-content-wrap pull-left" :style="{ width: `calc(100% - ${menuWidth}px)` }">
    <div class="app-content-head">
      <a-button type="default" @click="toggleCollapsed">
        <MenuUnfoldOutlined v-if="menuCollapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
      <a-popover placement="bottom" trigger="hover">
        <template #content>
          <ul class="user-popover">
            <li class="user-popover-item" @click="logout">
              退出登录
            </li>
          </ul>
        </template>
        <div class="login-user-wrap">
          <UserOutlined class="login-user-icon" />
          <span class="login-user-label">管理员</span>
        </div>
      </a-popover>
    </div>
    <div class="app-content">
      <router-view />
    </div>
  </div>
</div>
</template>

<script>
import { logout as logoutService } from '../service/login'
import { message } from 'ant-design-vue';

export default {
  name: 'App',
  data() {
    return {
      menuCollapsed: false,
      selectedKeys: ['user'],
    }
  },
  computed: {
    menuWidth() {
      return this.menuCollapsed ? 81 : 256
    }
  },
  methods: {
    toggleCollapsed() {
      this.menuCollapsed = !this.menuCollapsed
    },
    logout() {
      logoutService().then(res => {
        if(res.data.code == '1') {
          let origin = location.origin
          let pathname = location.pathname
          let arr = pathname.split('/')
          if(arr.length > 0) {
            arr[arr.length - 1] = 'login.html';
          }
          location.href = `${origin}${arr.join('/')}`
        }else {
          throw new Error(res.data.message)
        }
      }).catch(err => {
        console.error('logout error:', err)
        message.error('登出失败')
      })
    }
  }
}
</script>

<style lang="less">
.ant-menu-inline {
  border-right: 0;
}
</style>

<style lang="less">
.app-container {
  width: 100%;
  height: 100vh;
}
.nav-container {
  width: 256px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #f0f0f0;
}
.app-content-wrap {
  width: calc(100% - 256px);
  height: 100%;
  background: rgb(245,245,245);
}
.menu-container {
  width: 100%;
}
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 64px;
  .log-container-inner {
    display: flex;
    align-items: center;
  }
  .logo-img {
    width: 22px;
  }
  .logo-label {
    font-size: 22px;
    margin: 0 0 0 16px;
    color: #333;
    font-weight: bold;
  }
}
.app-content-head {
  height: 64px;
  display: flex;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  // box-shadow: 0 2px 6px #00000016;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}
.login-user-wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
  .login-user-label {
    margin-left: 8px;
  }
}
.app-content {
  width: 100%;
  height: calc(100% - 64px);
  padding: 20px;
  overflow: auto;
  background: #fff;
}
.user-popover {
  list-style: none;
  padding: 0;
  margin: 0;
  .user-popover-item {
    cursor: pointer;
    line-height: 1.5;
    &:hover {
      color: #1890ff;
    }
  }
}
</style>
