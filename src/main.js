import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import router from './router'
import store from './store'

import 'ant-design-vue/dist/antd.css';
import './assets/css/index.less';
import './style/common.less';

import App from './App.vue'
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, 
  EditOutlined, DeleteOutlined, CaretUpOutlined,
  CaretDownOutlined } from '@ant-design/icons-vue';

const app = createApp(App)

app.use(store).use(router).use(Antd)
app.component('UserOutlined', UserOutlined)
  .component('MenuUnfoldOutlined', MenuUnfoldOutlined)
  .component('MenuFoldOutlined', MenuFoldOutlined)
  .component('EditOutlined', EditOutlined)
  .component('DeleteOutlined', DeleteOutlined)
  .component('CaretUpOutlined', CaretUpOutlined)
  .component('CaretDownOutlined', CaretDownOutlined)

app.mount('#app')
