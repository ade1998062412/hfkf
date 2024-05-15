<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <el-table border :data="list">
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="任务名"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="mobile"
        label="电话号码"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="template_name"
        label="模板"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="status_text"
        label="发送状态"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="updated_at"
        label="发送时间"
      ></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getDetail } from '@/api/customerTask.js'
  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        title: '',
        dialogFormVisible: false,
        list: null,
        formdata: {
          id: '',
          page: 1,
          limit: 10,
          sort: 'created_at',
          order: 'desc',
        },
        form: null,
      }
    },
    created() {},
    methods: {
      showDetail(row) {
        this.title = '详情'
        this.form = Object.assign({}, row)
        this.formdata.id = this.form.id
        getDetail(this.formdata).then((res) => {
          this.list = res.data.list
        })
        this.dialogFormVisible = true
        this.$emit('fetch-data')
      },
      save() {
        this.close()
      },
      close() {
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
    },
  }
</script>
