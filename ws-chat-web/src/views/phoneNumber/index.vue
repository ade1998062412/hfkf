<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
          申请新的手机号
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <template slot="empty">暂无数据...</template>
      <el-table-column
        show-overflow-tooltip
        prop="id"
        label="手机号ID"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="手机号"
      ></el-table-column>
      <el-table-column label="可用状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status ? '可用' : '禁用' }}
        </template>
      </el-table-column>
    </el-table>
    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
  import { getList } from '@/api/phoneNumber.js'
  import Edit from './components/phoneNumberEdit.vue'
  export default {
    name: 'UserManagement',
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleEdit() {
        this.$refs['edit'].showEdit()
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getList()
        this.list = data.list
        data.list.length > 0
          ? localStorage.setItem('phone_id', data.list[0].id)
          : ''
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
