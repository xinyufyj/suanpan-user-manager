<template>
  <a-modal 
    v-model:visible="modalVisible" 
    title="编辑"
    :maskClosable="false"
    :footer="null"
    :afterClose="afterCloseHandler">
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
      <a-form-item label="密码" name="password" :rules="passwordRules">
        <a-input v-if="passwordReset" style="width: 200px" v-model:value="modelState.password" autocomplete="off" />
        <a-button 
          :style="{marginLeft: passwordReset ? '10px' : '0'}" 
          type="primary" 
          @click="passwordReset=!passwordReset"
        > 
          {{ passwordReset ? '取消重置' : '重置' }}
        </a-button>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="default" @click="cancel">取消</a-button>
        <a-button style="margin-left: 10px" type="primary" :loading="loading" @click="updateUser">确定</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { updateUser, updateUserPassword } from "../service/user";
import { encrypt } from '../utils'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    user: {
      required: true
    }
  },
  emits: ['update:visible', 'confirm'],
  data() {
    let checkUsername = async (rule, value) => {
      if(value === '') {
        return Promise.resolve(); 
      }
      if(!/^[0-9a-zA-Z_]+$/.test(value)) {
        return Promise.reject('只能是字母, 数字, 下划线');
      }
      if((value.length < 4) || (value.length > 16)) {
        return Promise.reject('长度为4-16位');
      }
      return Promise.resolve(); 
    };
    let checkPhone = async (rule, value) => {
      if(value === '') {
        return Promise.resolve();
      }
      if(!/^[0-9]{1,13}$/.test(value)) {
        return Promise.reject('请输入正确的手机号');
      }
      return Promise.resolve(); 
    }
    return {
      modalVisible: this.visible,
      modelState: {
        username: this.user.username,
        phone: this.user.phone,
        email: this.user.email,
        password: ''
      },
      rules: {
        username: [
          { required: true, message:'请输入用户名', trigger: 'change' },
          { validator: checkUsername, trigger: 'change' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'change' }
        ],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      passwordReset: false,
      loading: false
    }
  },
  computed: {
    passwordRules() {
      let checkPassword = async (rule, value) => {
      if(value === '') {
        return Promise.resolve(); 
      }
      if(/(?=.*[\u0100-\uffff])/.test(value)) {
        return Promise.reject('必须且只包含大小写字母、数字、英文特称字符');
      }
      if(!/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[`~!@#$%^&*()-_=+{}[\]\|;:'"<>,.?/ ])/.test(value)) {
        return Promise.reject('必须且只包含大小写字母、数字、英文特称字符');
      }
      if((value.length < 8) || (value.length > 20)) {
        return Promise.reject('长度为8-20位');
      }
      return Promise.resolve(); 
    };
      return this.passwordReset ? [
          { required: true, message:'请输入初始密码', trigger: 'change' },
          { validator: checkPassword, trigger: 'change' }
        ] : []
    }
  },
  watch: {
    visible() {
      this.modalVisible = this.visible
    }
  },
  methods: {
    afterCloseHandler() {
      this.$emit('update:visible', false)
    },
    cancel() {
      this.modalVisible = false
    },
    updateUser() {
      this.$refs.model.validate().then(() => {
        this.loading = true
        let userParam = {
          id: this.user.id,
          username: this.modelState.username,
          phone: this.modelState.phone,
          email: this.modelState.email
        }

        if(!this.passwordReset) {
          updateUser(userParam).then(res => {
            if(res.data.code == 1) {
              this.$emit('success', false)
            }else {
              throw new Error(res.data.message)
            }
          }).catch(err => {
            console.error('update user error:', err)
            message.error(`修改失败，${err.message}`)
          }).finally(() => {
            this.loading = false
          })
        }else {
          let passwordParam = {
            userId: this.user.id,
            password: encrypt(this.modelState.password, 'adminkeysuanpan9')
          }
          Promise.all([
            updateUser(userParam),
            updateUserPassword(passwordParam)
          ]).then(res => {
            if((res[0].data.code == 1) && (res[1].data.code == 1)) {
              this.$emit('success', true, {username: this.modelState.username, password: this.modelState.password})
              this.modalVisible = false
            }else {
              let errorMsgs = []
              if(res[0].data.code != '1') {
                errorMsgs.push(res[0].data.message)
              }
              if(res[1].data.code != '1') {
                errorMsgs.push(res[1].data.message)
              }
              throw new Error(errorMsgs.join(','))
            }
          }).catch(err => {
            console.error('update user error:', err)
            message.error(`修改失败，${err.message}`)
          }).finally(() => {
            this.loading = false
          })
        }
      }).catch(() => {})
    }
  }
}
</script>

<style>

</style>