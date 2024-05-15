<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="客服名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model.trim="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="save()">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doUpdate } from '@/api/customerService.js'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          name: '',
          username: '', //客服手机号
          password: '', //登录密码(非必填，可空)
          status: 1, //1开启 0禁用
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入客服手机号' },
          ],
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          status: [{ required: true, trigger: 'blur' }],
        },
        title: '',
        dialogFormVisible: false,
        loading: false,
      }
    },
    created() {},
    methods: {
      showEdit() {
        this.title = '申请新的手机号'
        this.dialogFormVisible = true
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.loading = true
            this.form.status ? (this.form.status = 1) : (this.form.status = 0)
            const { errmsg } = await doUpdate(this.form)
            this.$baseMessage(errmsg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.loading = false
      },
    },
  }
</script>
