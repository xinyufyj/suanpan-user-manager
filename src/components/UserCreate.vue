<template>
  <a-modal
    v-model:visible="modalVisible"
    title="新增"
    :maskClosable="false"
    :afterClose="afterCloseHandler"
    :footer="null"
  >
    <a-form
      ref="model"
      :model="modelState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="modelState.username" />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="modelState.phone" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="modelState.email" />
      </a-form-item>
      <a-form-item label="初始密码" name="password">
        <a-input v-model:value="modelState.password" autocomplete="off" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="default" @click="cancel">取消</a-button>
        <a-button
          style="margin-left: 10px"
          type="primary"
          :loading="loading"
          @click="createUser"
          >确定</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from "ant-design-vue";
import { addUser } from "../service/user";
import { encrypt } from "../utils";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible", "success"],
  data() {
    let checkUsername = async (rule, value) => {
      if (value === "") {
        return Promise.resolve();
      }
      if (!/^[0-9a-zA-Z_]+$/.test(value)) {
        return Promise.reject("只能是字母, 数字, 下划线");
      }
      if (value.length < 4 || value.length > 16) {
        return Promise.reject("长度为4-16位");
      }
      return Promise.resolve();
    };
    let checkPassword = async (rule, value) => {
      if (value === "") {
        return Promise.resolve();
      }
      if (/(?=.*[\u0100-\uffff])/.test(value)) {
        return Promise.reject(
          "包含大小写英文字母、数字、特殊符号，且长度为8-20位"
        );
      }
      if (
        !/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[`~!@#$%^&*()-_=+{}[\]\|;:'"<>,.?/ ])/.test(
          value
        )
      ) {
        return Promise.reject(
          "包含大小写英文字母、数字、特殊符号，且长度为8-20位"
        );
      }
      if (value.length < 8 || value.length > 20) {
        return Promise.reject("长度为8-20位");
      }
      return Promise.resolve();
    };
    let checkPhone = async (rule, value) => {
      if (value === "") {
        return Promise.resolve();
      }
      if (!/^[0-9]{1,13}$/.test(value)) {
        return Promise.reject("请输入正确的手机号");
      }
      return Promise.resolve();
    };
    return {
      loading: false,
      modalVisible: this.visible,
      modelState: {
        username: "",
        phone: "",
        email: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
          { validator: checkUsername, trigger: "change" },
        ],
        password: [
          {
            required: true,
            message: "包含大小写英文字母、数字、特殊符号，且长度为8-20位",
            trigger: "change",
          },
          { validator: checkPassword, trigger: "change" },
        ],
        phone: [{ validator: checkPhone, trigger: "change" }],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
  },
  watch: {
    visible() {
      this.modalVisible = this.visible;
    },
  },
  methods: {
    afterCloseHandler() {
      this.$emit("update:visible", false);
    },
    createUser() {
      this.$refs.model
        .validate()
        .then(() => {
          this.loading = true;
          let param = Object.assign({}, this.modelState);
          param.password = encrypt(param.password, "adminkeysuanpan9");
          addUser(param)
            .then((res) => {
              if (res.data && res.data.code == 1) {
                this.$emit("success", {
                  username: param.username,
                  password: this.modelState.password,
                });
                this.modalVisible = false;
              } else {
                throw new Error(res.data.message);
              }
            })
            .catch((err) => {
              console.error("add user error:", err);
              message.error(`创建失败，${err.message}`);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    cancel() {
      this.modalVisible = false;
    },
  },
};
</script>

<style>
</style>