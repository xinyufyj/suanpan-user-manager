<template>
  <div class="login-bg">
    <a-row>
      <a-col
        :span="14"
        :lg="{ span: 14 }"
        :md="{ span: 12 }"
        :sm="{ span: 0 }"
        :xs="{ span: 0 }"
      >
        <div class="logo-wrap">
          <img
            class="logo-container"
            :src="require('@/assets/image/logo-title.png')"
          />
          <h2 class="logo-title">从制造业中来 到制造业中去</h2>
          <div class="copyright">
            Copyright © {{ new Date().getFullYear() }} 雪浪云 All rights
            reserved 苏ICP备 18034176号-1
          </div>
        </div>
      </a-col>
      <a-col
        :span="10"
        :lg="{ span: 10 }"
        :md="{ span: 12 }"
        :sm="{ span: 24 }"
        :xs="{ span: 24 }"
      >
        <div class="login-wrap">
          <div class="login-container">
            <div>
              <h1 class="login-title">雪浪算盘用户管理</h1>
            </div>
            <a-form
              name="custom-validation"
              ref="formRef"
              :model="formState"
              :rules="rules"
              v-bind="layout"
            >
              <a-form-item label="用户名" name="username">
                <a-input
                  v-model:value="formState.username"
                  placeholder="请输入用户名"
                />
              </a-form-item>
              <a-form-item label="密码" name="password">
                <a-input-password
                  v-model:value="formState.password"
                  placeholder="请输入登录密码"
                  autocomplete="off"
                  @keyup.enter="login"
                />
              </a-form-item>
              <img :src="getAuthCode()" alt="" v-if='isEnableCheckCode'/>
              <a-form-item label="校验码" name="verCode" v-if='isEnableCheckCode'>
                <a-input
                  v-model:value="formState.verCode"
                  placeholder="请输入答案"
                />
              </a-form-item>
              <a-form-item style="padding-top: 16px">
                <div v-show="errorShow" class="login-message">
                  {{errorInfo}}
                </div>
                <a-button class="login-btn" type="primary" @click="login"
                  >登录</a-button
                >
              </a-form-item>
            </a-form>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { login as loginService , isEnableCheckCode} from "./service/login";
import { getAuthCode } from "./service/user";
import { encrypt } from "./utils";

export default {
  name: "loginApp",
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
      if (/(?=.*[\u4e00-\u9fa5])/.test(value)) {
        return Promise.reject("必须且只包含大小写字母、数字、特称字符");
      }
      if (
        !/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9\u4e00-\u9fa5])/.test(
          value
        )
      ) {
        return Promise.reject("必须且只包含大小写字母、数字、特称字符");
      }
      if (value.length < 8 || value.length > 20) {
        return Promise.reject("长度为8-20位");
      }
      return Promise.resolve();
    };
    return {
      formState: {
        username: "",
        password: "",
        verCode: "",
      },
      layout: {
        layout: "vertical",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
          { validator: checkUsername, trigger: "change" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "change" },
          // { validator: checkPassword, trigger: 'change' }
        ],
        verCode: [
          { required: true, message: "请输入校验码", trigger: "change" },
        ]
      },
      loading: false,
      errorShow: false,
      errorInfo:'',
      codeImg: "",
      isEnableCheckCode:true,
    };
  },
  watch: {
    "formState.username": {
      handler() {
        this.errorShow = false;
      },
    },
    "formState.password": {
      handler() {
        this.errorShow = false;
      },
    },
  },
  mounted() {
    isEnableCheckCode()
  },
  methods: {
    getAuthCode,
    login() {
      // 判断登录错误次数
      const loginErrorTime = +localStorage.getItem("loginErrorTime") || 0;
      const loginErrorCount = +localStorage.getItem("loginErrorCount") || 0;
      if (
        new Date().getTime() - loginErrorTime <= 5 * 60 * 1000 &&
        loginErrorCount >= 5
      ) {
        this.$message.error("已登录失败5次，请在5分钟后再次尝试登录");
        return;
      }
      this.errorShow = false;
      this.$refs.formRef
        .validate()
        .then(() => {
          let param = Object.assign({}, this.formState);
          param.password = encrypt(param.password, "adminkeysuanpan9");
          loginService(param)
            .then((res) => {
              if (res.data && res.data.code == 1) {
                let origin = location.origin;
                let pathname = location.pathname;
                let arr = pathname.split("/");
                if (arr.length > 0) {
                  arr[arr.length - 1] = "index.html";
                }
                this.clearLoginErrorCount();
                location.href = `${origin}${arr.join("/")}`;
              } else {
                this.handleLoginError();
                this.errorShow = true;
                this.errorInfo = res.data.message;
              }
            })
            .catch((err) => {
              console.error("login error", err);
              this.$message.error("网络错误,请检查您的网络");
            });
        })
        .catch(() => {});
    },
    handleLoginError() {
      let loginErrorCount = localStorage.getItem("loginErrorCount") || 0;
      loginErrorCount = parseInt(loginErrorCount);
      if (loginErrorCount < 5) {
        loginErrorCount++;
        // 如果已经五次错误 记录一下时间
        if (loginErrorCount === 5) {
          localStorage.setItem("loginErrorTime", new Date().getTime());
        }
        // 更新错误次数
        localStorage.setItem("loginErrorCount", loginErrorCount);
      }
    },
    clearLoginErrorCount() {
      localStorage.setItem("loginErrorCount", "0");
    },
  },
};
</script>

<style lang="less">
.login-bg {
  width: 100vw;
  height: 100vh;
  background-image: url("~@/assets/image/login-bg.png");
  background-position: center;
  background-size: cover;
}
.logo-wrap {
  width: 100%;
  height: 100vh;
  position: relative;
}
.logo-container {
  position: absolute;
  user-select: none;
  left: 10%;
  top: 10%;
}
.logo-title {
  position: absolute;
  left: 10%;
  top: 40%;
  color: #fff;
  font-weight: bold;
  font-size: 40px;
  user-select: none;
}
.copyright {
  position: absolute;
  left: 10%;
  bottom: 10%;
  color: #eee;
  user-select: none;
}
.login-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-container {
  width: 400px;
  padding: 36px 40px 36px 40px;
  background: #fff;
  border-radius: 4px;
}
.login-title {
  font-size: 22px;
  text-align: center;
  padding-bottom: 20px;
}
.login-message {
  position: absolute;
  left: 0;
  top: 42px;
  color: #ff4d4f;
}
.login-btn {
  width: 100%;
}
</style>