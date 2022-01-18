<template>
<a-config-provider :locale="locale">
  <div>
    <router-view />
  </div>
</a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default {
  name: 'App',
  data() {
    return {
      locale: zhCN,
    };
  },
}
</script>
