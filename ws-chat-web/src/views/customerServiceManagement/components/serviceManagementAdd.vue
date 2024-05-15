<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <!-- <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item> -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model.trim="form.password"></el-input>
      </el-form-item>
      <el-form-item label="分配的手机号" prop="phone_number_id">
        <el-select
          v-model="form.phone_number_id"
          placeholder="请选择"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配的应用id" prop="app_id">
        <el-select
          v-model="form.app_id"
          placeholder="请选择"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in webappList"
            :key="item.id"
            :label="item.uuid"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model.trim="form.status"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doUpdate } from '@/api/customerService.js'
  import { getList } from '@/api/phoneNumber.js'
  import { getWebAppList } from '@/api/customerTask.js'
  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          username: '',
          password: '', //登录密码(非必填，可空)
          phone_number_id: null, //分配的手机号id
          status: null, //1开启 0禁用
          app_id: '',
        },
        rules: {
          // name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          username: [
            { required: true, trigger: 'blur', message: '请输入客服姓名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          status: [],
        },
        title: '',
        dialogFormVisible: false,
        options: [],
        webappList: [],
        id: '',
        loading: false,
      }
    },
    created() {
      this.getOptionsList()
    },
    methods: {
      async getOptionsList() {
        const { data } = await getList()
        let data2 = await getWebAppList()
        this.options = data.list
        this.webappList = data2.data.list
      },
      showAdd() {
        this.title = '添加'
        this.dialogFormVisible = true
      },
      async save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.loading = true
            this.form.status ? (this.form.status = 1) : (this.form.status = 0)
            const { errmsg } = await doUpdate(this.form)
            this.$baseMessage(errmsg, 'success')
            this.$emit('fetch-new-data')
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
