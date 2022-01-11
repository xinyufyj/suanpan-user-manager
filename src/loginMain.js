import { createApp } from 'vue'
import Antd from 'ant-design-vue';

import 'ant-design-vue/dist/antd.css';
import './assets/css/index.less';

import App from './loginApp.vue'

const app = createApp(App)

app.use(Antd)

app.mount('#app')
