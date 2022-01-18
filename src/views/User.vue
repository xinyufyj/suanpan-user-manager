<template>
  <div class="user-container">
    <a-page-header
      class="user-page-header"
      title="用户列表"
    >
      <template #extra>
        <a-button type="primary" @click="addUser">新增</a-button>
      </template>
    </a-page-header>
    <div class="user-table-wrap">
      <a-table 
        :columns="columns" 
        :data-source="userList" 
        :loading="loading"
        :pagination="false"
        @change="tableChanged"
      >
        <template #status="{ record }">
          <a-switch v-model:checked="record.status" @change="statusChanged(record)" />
        </template>
        <template #action="{ record }">
          <a-button type="text" @click="editUser(record)">
            <template #icon><EditOutlined :style="{color: '#1890ff'}" /></template>
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该用户吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteUser(record)"
          >
            <a-button type="text" danger>
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>  
      <a-pagination v-if="totalNum > 0" class="user-pagination" v-model:current="startNum" :defaultPageSize="pageSize" :total="totalNum" :showSizeChanger="false" />
    </div>
    <UserUpdate 
      v-if="userUpdateVisible" 
      v-model:visible="userUpdateVisible" 
      :user="userInfo"
      @success="userUpdateSuccess"
    >
    </UserUpdate>
    <UserCreate v-if="userCreateVisible" v-model:visible="userCreateVisible" @success="userCreateSuccess"></UserCreate>
    <UserPasswordCopy 
      v-if="userCopyVisible" 
      v-model:visible="userCopyVisible" 
      :user="userInfo" 
      :isEdit="userCopyEdit"
      @ok="copyUserInfo"
    >
    </UserPasswordCopy>
  </div>
</template>

<script>
import { getUserList, enableUser, disableUser, deleteUser } from "../service/user";
import UserUpdate from '../components/UserUpdate.vue';
import UserCreate from '../components/UserCreate.vue';
import UserPasswordCopy from '../components/UserPasswordCopy.vue';
import { message } from 'ant-design-vue'
import { copyTextToClipboard } from '../utils'

export default {
  name: "User",
  components: {
    UserUpdate,
    UserCreate,
    UserPasswordCopy
  },
  data() {
    return {
      userList: [],
      loading: false,
      createTimeSortDirection: 'descend',
      columns: [
        {
          title: "用户ID",
          dataIndex: "id",
          key: 'id',
        },
        {
          title: "用户名",
          dataIndex: "username",
          key: 'username',
        },
        {
          title: "手机号",
          dataIndex: "phone",
          key: "phone",
        },
        {
          title: "邮箱",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "注册时间",
          dataIndex: "createTime",
          key: "createTime",
          sorter: true,
          sortOrder: 'descend'
        },
        {
          title: "最后修改时间",
          dataIndex: "updateTime",
          key: "updateTime",
        },
        {
          title: "账号状态",
          dataIndex: "status",
          key: "status",
          slots: { customRender: "status" },
        },
        {
          title: "操作",
          key: "action",
          slots: { customRender: "action" },
        },
      ],
      userUpdateVisible: false,
      userCreateVisible: false,
      userCopyVisible: false,
      userCopyEdit: false,
      userInfo: null,
      startNum: 1,
      pageSize: 10,
      totalNum: 0
    };
  },
  computed: {
    orderBy() {
      if(this.createTimeSortDirection === 'descend') {
        return { create_time: 'desc' }
      }else if(this.createTimeSortDirection === 'ascend') {
        return { create_time: 'asc' }
      }else {
        return {}
      }
    }
  },
  watch: {
    startNum() {
      this.fetchUserList()
    }
  },
  mounted() {
    this.fetchUserList()
  },
  methods: {
    fetchUserList() {
      this.loading = true
      getUserList(this.startNum, this.pageSize, this.orderBy)
      .then((res) => {
        if(res.data.code == '1') {
          this.totalNum = res.data.data.totalProperty
          this.userList = this.formatUserList(res.data.data.list)
        }else {
          throw new Error(res.data.message)
        }
      })
      .catch((err) => {
        message.error('获取用户列表失败')
        console.error(err);
      })
      .finally(() => {
        this.loading = false
      })
    },
    formatUserList(datas) {
      datas.forEach(data => {
        data.status = data.status == 1 ? true : false;
      })
      return datas
    },
    statusChanged(userRecord) {
      if(userRecord.status) {
        enableUser(userRecord.id).then(res => {
          if(res.data.code == '1') {
            message.success('账号启用成功')
          }else {
            throw new Error(res.data.message)
          }
        }).catch(err => {
          message.error('账号启用失败')
          console.error()
        })
      }else {
        disableUser(userRecord.id).then(res => {
          if(res.data.code == '1') {
            message.success('账号停用成功')
          }else {
            throw new Error(res.data.message)
          }
        }).catch(err => {
          message.error('账号停用失败')
          console.error()
        })
      }
    },
    addUser() {
      this.userCreateVisible = true
    },
    editUser(userRecord) {
      this.userUpdateVisible = true
      this.userInfo = userRecord
    },
    deleteUser(userRecord) {
      deleteUser(userRecord.id).then(res => {
        if(res.data && res.data.code == '1'){
          message.success('删除成功')
          this.fetchUserList()
        }else {
          throw new Error(res.data.message)
        }
      }).catch(err => {
        console.error('user delete error', err)
        message.error('删除失败')
      })
    },
    userCreateSuccess(param) {
      this.userCopyVisible = true
      this.userInfo = param
      this.userCopyEdit = false
      this.fetchUserList()
    },
    userUpdateSuccess(isCopy, param) {
      if(!isCopy) {
        this.userUpdateVisible = false
        message.success('修改成功')
        this.fetchUserList()
      }else {
        this.userCopyVisible = true
        this.userCopyEdit = true
        this.userInfo = param
        this.fetchUserList()
      }
    },
    copyUserInfo() {
      this.userCopyVisible = false
      let text = `用户名：${this.userInfo.username} 密码：${this.userInfo.password}`
      copyTextToClipboard(text).then(() => {
        message.success('用户名密码拷贝成功')
      }).catch(err => {
        console.error('copy text error:', err)
      })
    },
    tableChanged(pagination, filters, sorter, { action }) {
      if(action !== 'sort') {
        return
      }
      if(this.columns[4].sortOrder === 'ascend') {
        this.columns[4].sortOrder = 'descend'
        this.createTimeSortDirection = 'descend'
      }else if(this.columns[4].sortOrder === 'descend') {
        this.columns[4].sortOrder = false
        this.createTimeSortDirection = false
      }else if(this.columns[4].sortOrder === false) {
        this.columns[4].sortOrder = 'ascend'
        this.createTimeSortDirection = 'ascend'
      }
      this.fetchUserList()
    },
  }
};
</script>

<style lang="less">
.user-container {
  // height: 1600px;
}
.user-page-header {
  padding-left: 0 !important;
  padding-top: 0 !important;
}
.user-table-wrap {
  position: relative;
}
.user-pagination {
  position: absolute;
  right: 0;
  padding-top: 20px !important;
}

</style>