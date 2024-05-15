<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          批量删除
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="list"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column
        width="100"
        show-overflow-tooltip
        prop="id"
        label="id"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="推广商名称"
      ></el-table-column>
      <el-table-column
        width="700"
        show-overflow-tooltip
        prop="router"
        label="推广商查看地址"
      >
        <template #default="{ row }">
          <a @click="routerFunction(row)">
            {{ row.router }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="updated_at"
        label="更新时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">修改</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
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
    <edit ref="edit" @fetch-data="fetchData"></edit>
    <add ref="add" @fetch-new-data="fetchData"></add>
  </div>
</template>

<script>
  import { getList, doDelete } from '@/api/promoter.js'
  import Edit from './components/promoterEdit.vue'
  import Add from './components/PromoterAdd.vue'

  export default {
    name: 'UserManagement',
    components: { Edit, Add },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        status: true,
        queryForm: {
          page: 1, //分页页码
          limit: 10, //分页大小
          sort: 'created_at', //排序字段
          order: 'desc', //排序顺序：asc/desc
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      routerFunction(row) {
        // let key = row.router.split('promoter/')[1]
        // this.$router.push({
        //   path: '/promoter/index',
        //   query: {
        //     key: key,
        //   },
        // })
        window.open(row.router, '_blank')
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['add'].showAdd()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { errmsg } = await doDelete({ ids: row.id })
            this.$baseMessage(errmsg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows
              .map((item) => item.id)
              .join()
              .split(',')
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { errmsg } = await doDelete({ ids })
              this.$baseMessage(errmsg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
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
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.page = val
        this.fetchData()
      },
    },
  }
</script>
