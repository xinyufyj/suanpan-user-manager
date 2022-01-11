<template>
  <a-modal 
    v-model:visible="modalVisible" 
    title="询问"
    :maskClosable="false"
    :afterClose="afterCloseHandler"
    cancelText="取消"
    okText="确定"
    >
      <a-alert :message="`用户 ${user.username} ${this.isEdit ? '修改': '创建'}成功，是否需要复制用户名和密码`" type="success" show-icon />
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    user: {
      required: true
    }
  },
  emits: ['update:visible', 'confirm'],
  data() {
    return {
      modalVisible: this.visible,
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
    onSubmit() {
      this.$refs.model.validate().then(() => {
        this.modalVisible = false
        this.$emit('confirm', this.modelState)
      }).catch(() => {})
    },
  }
}
</script>

<style>

</style>