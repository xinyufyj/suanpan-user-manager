<template>
  <div>
    <a-page-header class="user-page-header" title="账号登录历史记录" />
    <div>
      <div class="common-search-box">
        <div class="common-search-item mr20">
          <span class="mr20">账号</span
          ><a-input type="text" class="w200" allowClear />
        </div>
        <div class="common-search-item mr20">
          <span class="mr20">日期和时间</span>
          <a-range-picker
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('11:59:59', 'HH:mm:ss'),
              ],
            }"
            format="YYYY-MM-DD HH:mm:ss"
            @change="dateChange"
          />
        </div>
        <div><a-button type="primary">查询</a-button></div>
      </div>
      <a-divider />
      <a-table :columns="columns" :data-source="data" class="mb20" />
      <a-pagination
        v-model="current"
        :total="50"
        show-less-items
        show-quick-jumper
      />
    </div>
  </div>
</template>
<script>
import moment from "moment";
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "登录账号",
    dataIndex: "account",
    key: "account",
  },
  {
    title: "登录时间",
    dataIndex: "login_time",
    key: "login_time",
  },
];
export default {
  data() {
    return {
      columns,
      data: [],
      current: 1,
    };
  },
  methods:{
    moment,
    dateChange(dates,dateString){
      
    },
  }
};
</script>
<style lang="less" scoped>
</style>