<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleAddTask()">
          创建群发任务
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        show-overflow-tooltip
        prop="title"
        label="任务名"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="phone_number.name"
        label="分配的手机号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="status_text"
        label="导入状态"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="template.name"
        label="模板"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="file_path"
        label="excel文件路径"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row)">详情</el-button>
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
    <addTask ref="addTask" @fetch-new-data="fetchData"></addTask>
  </div>
</template>

<script>
  import { getList } from '@/api/customerTask.js'
  import Detail from './components/customerTaskDetail.vue'
  import AddTask from './components/taskAdd.vue'

  export default {
    name: 'UserManagement',
    components: { Detail, AddTask },
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
        loading: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleDetail(row) {
        this.$refs['detail'].showDetail(row)
      },
      handleAddTask() {
        this.$refs['addTask'].showAdd()
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
        const { data } = await getList(this.queryForm)
        this.list = data.list
        this.total = data.total
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      taskAdd() {},
    },
  }
</script>
