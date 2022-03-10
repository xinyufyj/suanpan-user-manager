<template>
  <div>
    <a-page-header class="user-page-header" title="账号登录历史记录" />
    <div>
      <div class="common-search-box">
        <div class="common-search-item mr20">
          <span class="mr20">账号</span
          ><a-input
            type="text"
            class="w200"
            allowClear
            v-model:value="account"
          />
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
      <a-table :columns="columns" :data-source="data" class="mb20" :pagination="false"/>
      <a-pagination
        v-model="current"
        :total="total"
        :pageSize="15"
        show-less-items
        show-quick-jumper
        @change="changePage"
      />
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { getLoginInfo, getFirstLoginInfoList } from "../service/user";
const columns = [
  {
    title: "序号",
    dataIndex: "sn",
    key: "sn",
  },
  {
    title: "登录账号",
    dataIndex: "account",
    key: "account",
  },
  {
    title: "登录时间",
    dataIndex: "loginTime",
    key: "loginTime",
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
    getFirstLoginInfoList().then((r) => {
      this.data = r.data.data.list.map((item, index) => {
        item.sn = index + 1;
        return item;
      });
      this.total = r.data.data.totalProperty;
    });
  },
  methods: {
    moment,
    dateChange(dates, dateString) {
      this.startTime =
        dateString[0] === "" ? undefined : new Date(dateString[0]).getTime();
      this.endTime =
        dateString[1] === "" ? undefined : new Date(dateString[1]).getTime();
    },
    getList(page = 1) {
      let params = {
        account: this.account,
        pageNum: page,
      }
      if (this.startTime !== undefined) params.startTime = this.startTime;
      if (this.endTime !== undefined) params.endTime = this.endTime;
      getLoginInfo(params).then((r) => {
        this.data = r.data.data.list.map((item, index) => {
          item.sn = index + 1;
          return item;
        });
        this.total = r.data.data.totalProperty;
      });
    },
    changePage(index) {
      this.getList(index);
    },
  },
};
</script>
<style lang="less" scoped>
</style>