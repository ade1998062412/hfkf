<template>
  <div class="userManagement-container">
    <el-table
      v-loading="listLoading"
      border
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        show-overflow-tooltip
        prop="type_text"
        label="类型"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="score"
        label="积分"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="after"
        label="当前积分"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="before"
        label="上次积分"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="updated_at"
        label="更新时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="note"
        label="备注"
      ></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="formdata.page"
      :page-size="formdata.limit"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
  import { getList } from '@/api/scoreLog.js'
  export default {
    name: 'Index',
    data() {
      return {
        listLoading: true,
        elementLoadingText: '正在加载...',
        formdata: {
          page: 1, //分页页码
          limit: 10, //分页大小
          sort: 'created_at', //排序字段
          order: 'desc', //排序顺序：asc/desc
          name: '',
        },
        total: null,
        list: null,
        user: {},
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleEdit() {
        this.$refs['edit'].showEdit()
      },
      fetchData() {
        this.listLoading = true
        this.formdata.name = localStorage.getItem('name')
        getList(this.formdata).then((res) => {
          this.list = res.list
          this.total = res.total
        })
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      handleSizeChange(val) {
        this.formdata.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.formdata.page = val
        this.fetchData()
      },
    },
  }
</script>
