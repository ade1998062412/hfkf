<template>
  <div class="userManagement-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="应用名称"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="uuid"
        label="UUID"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="status_text"
        width="150"
        label="状态"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="user_id"
        width="150"
        label="客服ID"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="updated_at"
        label="创建时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row)">详情</el-button>
          <el-button type="text" @click="reviseBtn(row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.page"
      :page-size="queryForm.limit"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <detail ref="detail" @fetch-data="fetchData"></detail>
    <el-dialog
      title="修改在线时间"
      :visible.sync="dialogFormVisible"
      @close="cancelDialog"
    >
      <el-form :model="updateOnlineTime">
        <el-form-item label="UUID" label-width="120px">
          <el-input
            v-model="updateOnlineTime.uuid"
            disabled
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="在线时间" label-width="120px">
          <el-time-picker
            v-model="startTime"
            style="width: 120px"
            placeholder="起始时间"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:59',
            }"
            format="HH:mm"
            value-format="HH:mm"
          ></el-time-picker>
          <span style="margin: 0 20px">-</span>
          <el-time-picker
            v-model="endTime"
            style="width: 120px"
            placeholder="结束时间"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:59',
            }"
            format="HH:mm"
            value-format="HH:mm"
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :loading="confirmBtn" @click="confirmDialog">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getWebAppList, updateOnlineTime } from '@/api/customerTask.js'
  import Detail from './components/customerTaskDetail.vue'

  export default {
    name: 'UserManagement',
    components: { Detail },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          page: 1, //页码
          limit: 10, //分页大小
          sort: 'created_at', //排序字段
          order: 'desc', //排序方式
          title: '', //任务名
        },
        updateOnlineTime: {
          uuid: '',
          online_time: '',
        },
        loading: false,
        dialogFormVisible: false,
        startTime: '',
        endTime: '',
        confirmBtn: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      cancelDialog() {
        this.startTime = ''
        this.endTime = ''
        this.updateOnlineTime = {
          uuid: '',
          online_time: '',
        }
        this.confirmBtn = false
        this.dialogFormVisible = false
      },
      confirmDialog() {
        if (!this.startTime || !this.endTime) {
          return this.$message.error('请选择在线时间')
        }
        this.updateOnlineTime.online_time = this.startTime + '-' + this.endTime
        this.confirmBtn = true
        updateOnlineTime(this.updateOnlineTime)
          .then((res) => {
            this.dialogFormVisible = false
            this.$message.success('修改成功')
          })
          .catch((err) => {
            this.dialogFormVisible = false
            this.$message.error('修改失败')
          })
      },
      reviseBtn(row) {
        this.updateOnlineTime.uuid = row.uuid
        this.dialogFormVisible = true
      },
      handleDetail(row) {
        this.$refs['detail'].showDetail(row)
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.page = val
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getWebAppList(this.queryForm)
        this.list = data.list.map((i) => {
          i.status_text = i.status ? '正常' : '禁用'
          return i
        })
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      taskAdd() {},
    },
  }
</script>
