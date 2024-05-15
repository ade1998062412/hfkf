<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="推广商名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="关联手机号" prop="phone_number_ids">
        <el-select
          v-model="form.phone_number_ids"
          multiple
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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
  import { doUpdate } from '@/api/promoter.js'
  import { getList } from '@/api/phoneNumber.js'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          name: '',
          phone_number_ids: [], //分配的手机号id
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入推广商姓名' },
          ],
          phone_number_ids: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入分配的手机号',
            },
          ],
        },
        title: '',
        dialogFormVisible: false,
        options: [],
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
        this.options = data.list
        // console.log(data.list)
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
            // console.log(this.form.phone_number_id)

            // setTimeout(() => {
            const { errmsg } = await doUpdate(this.form)

            this.$baseMessage(errmsg, 'success')
            // }, 3000)
            //
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
