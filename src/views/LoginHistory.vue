<template>
  <div>
    <a-page-header class="user-page-header" title="账号登录历史记录" />
    <div>
      <div class="common-search-box">
        <div class="common-search-item mr20">
          <span class="mr20">账号</span
          ><a-input type="text" class="w200" allowClear v-model="account" />
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
        <div><a-button type="primary" @click="getList()">查询</a-button></div>
      </div>
      <a-divider />
      <a-table :columns="columns" :data-source="data" class="mb20" />
      <a-pagination
        v-model="current"
        :total="total"
        show-less-items
        show-quick-jumper
        @change="changePage"
      />
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { getLoginInfo } from "../service/user";
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
      account: "",
      current: 1,
      total: 0,
      startTime: undefined,
      endTime: undefined,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    moment,
    dateChange(dates, dateString) {
    console.log(dateString)
      this.startTime =
        dateString[0] === "" ? undefined : new Date(dateString[0]).getTime();
      this.endTime = dateString[1] === "" ? undefined : new Date(dateString[1]).getTime();
    },
    getList() {
      let params = {
        account: this.account,
        page: this.current,
      };
      if (this.startTime !== undefined) params.startTime = this.startTime;
      if (this.endTime !== undefined) params.endTime = this.endTime;
      getLoginInfo(params).then((r) => {
        this.data = r.data.data.list;
        this.total = r.data.data.totalProperty;
      });
    },
    changePage() {
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
</style>