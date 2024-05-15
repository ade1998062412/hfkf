<template>
  <div class="mt-10 contentbox">
    <el-form :inline="true" :model="form" label-width="100px">
      <el-form-item label="统计时间区间">
        <!-- <el-date-picker
          v-model="form.end"
          type="date"
          placeholder="选择日期"
        ></el-date-picker> -->
        <el-date-picker
          v-model="date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="pageData">
      <el-table-column
        show-overflow-tooltip
        prop="c"
        label="接待数量"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="phone_number.name"
        label="手机号"
      ></el-table-column>
    </el-table>
    <!-- <el-pagination
      style="margin-top: 12px; text-align: right"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination> -->
  </div>
</template>

<script>
  // import { promoter } from '@/api/promoter.js'
  import request from '@/utils/request'
  //推广商数据接口
  export function promoter(data, item) {
    return request({
      url: `/api/customer/promoter/index/${item}`,
      method: 'post',
      data,
    })
  }
  export default {
    name: 'Promoterdata',
    data() {
      return {
        list: null,
        options: [
          {
            id: 0,
            name: '全部',
          },
        ],
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
        date: [],
        form: {
          start: '',
          end: '',
          // page: 1, //分页页码
          // limit: 10, //分页大小
          // sort: 'created_at', //排序字段
          // order: 'desc', //排序顺序：asc/desc
        },
        key: '',
        pageData: null,
      }
    },
    created() {
      this.getOptionsList()
      this.fetchData()
    },
    methods: {
      async getOptionsList() {
        // const { data } = await getList()
        // this.options.push(...data.list)
        // console.log(this.options)
        //默认为最近一周
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        end.setTime(end.getTime())
        this.date = [start, end]
        this.key = this.$route.query.key
      },
      fetchData() {
        this.form.start = this.date[0]
        this.form.end = this.date[1]
        promoter(this.form, this.key).then((res) => {
          // this.list = res.data.list
          // console.log(this.list)
          // this.pageTotal = res.data.total //总条数
          // this.pageData = this.queryByPage()
          if (res.errno == 0) {
            this.pageData = res.data.list
          }
        })
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          let arr =
            this.list &&
            this.list.reduce((arr, a) => {
              return arr + a.c
            }, 0)
          sums[1] = arr
        })
        return sums
      },
      // 实现分页
      queryByPage() {
        // 起始位置 = (当前页 - 1) x 每页的大小
        const start = (this.currentPage - 1) * this.pageSize
        // 结束位置 = 当前页 x 每页的大小
        const end = this.currentPage * this.pageSize
        return this.list.slice(start, end)
      },
      onSubmit() {
        this.currentPage = 1
        this.pageSize = 10
        this.fetchData()
      },
      // 改变每页大小
      // handleSizeChange(val) {
      //   this.pageSize = val
      //   this.pageData = this.queryByPage()
      // },
      // 改变当前页
      // handleCurrentChange(val) {
      //   this.currentPage = val
      //   this.pageData = this.queryByPage()
      // },
    },
  }
</script>
<style>
  .mt-10 {
    margin: 10px;
  }
  .contentbox {
    padding: 30px;
  }
</style>
