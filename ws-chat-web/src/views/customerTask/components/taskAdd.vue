<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="700px"
    @close="close"
  >
    <el-form ref="form" :model="formdata" :rules="rules" label-width="140px">
      <el-form-item label="群发任务名称" prop="title">
        <el-input
          v-model="formdata.title"
          placeholder="请输入任务名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分配的手机号" prop="phone_number_id">
        <el-select
          v-model="formdata.phone_number_id"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in PhoneNumberOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送模板" prop="template_id">
        <el-select
          v-model="formdata.template_id"
          placeholder="请选择模板"
          style="width: 100%"
        >
          <el-option
            v-for="item in templateOptions"
            :key="item.id"
            :label="item.message"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板占位符" prop="template_field">
        <el-input
          v-model="formdata.template_field"
          placeholder="模板占位符替换字段 多个以 | 分隔 例 a|b|c"
        ></el-input>
      </el-form-item>
      <el-form-item label="点击上传excel文件" prop="file_path">
        <el-upload
          :limit="1"
          accept=".xlsx"
          action="https://wschat.micome.vip/api/customer/task/uploadExcel"
          :headers="header"
          :on-success="handleSuccess"
          :file-list="fileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="save()">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { taskAdd, getTemplate } from '@/api/customerTask.js'
  import { getList } from '@/api/phoneNumber.js'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        loading: false,
        header: {
          Authorization: 'Bearer ' + localStorage.getItem('mobileToken'),
        },
        title: '',
        dialogFormVisible: false,
        list: null,
        form: '',
        //创建群发任务
        formdata: {
          title: '',
          phone_number_id: null,
          template_id: '',
          template_field: '',
          file_path: '',
        },
        //获取模板请求
        templatedata: {
          phone_number_id: 1,
          page: 1,
          limit: 10,
          sort: 'created_at',
          order: 'desc',
        },
        //手机号码下拉框
        PhoneNumberOptions: [],
        //模板下拉框
        templateOptions: [],
        //上传文件列表
        fileList: [],
        importUrl: '/api/customer/task/uploadExcel',
        rules: {
          title: [
            { required: true, trigger: 'blur', message: '请输入群发任务名称' },
          ],
          phone_number_id: [
            { required: true, trigger: 'blur', message: '请选择分配的手机号' },
          ],
          template_id: [
            {
              required: true,
              trigger: 'blur',
              message: '请选择模板',
            },
          ],
          file_path: [
            { required: true, trigger: 'blur', message: '请选择excel文件' },
          ],
        },
      }
    },
    created() {},
    methods: {
      // 文件超出个数限制时的钩子
      exceedFile(files, fileList) {
        this.$message.warning(
          `只能选择 ${this.limitNum} 个文件，当前共选择了 ${
            files.length + fileList.length
          } 个`
        )
      },
      // 文件上传成功时的钩子
      handleSuccess(res, file, fileList) {
        this.$message.success('文件上传成功')
        this.formdata.file_path = res.data.url
      },
      UploadUrl: function () {
        // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
        return ''
      },
      //获取手机号下拉列表
      async getPhoneNumberList() {
        const { data } = await getList()
        this.PhoneNumberOptions = data.list
      },
      //获取模板列表
      async getTemplateList() {
        this.templatedata.phone_number_id = localStorage.getItem('phone_id')
        const { data } = await getTemplate(this.templatedata)
        this.templateOptions = data.list
      },
      showAdd() {
        this.title = '创建群发任务'
        //手机号码
        this.getPhoneNumberList()
        //获取模板列表
        this.getTemplateList()

        // this.$emit('fetch-new-data')
        this.dialogFormVisible = true
      },
      save() {
        //创建发送任务
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.loading = true
            taskAdd(this.formdata).then((res) => {
              this.$emit('fetch-new-data')
              this.close()
            })
          }
        })
      },
      close() {
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.loading = false
      },
    },
  }
</script>
