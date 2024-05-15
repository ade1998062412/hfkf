<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="60%"
    @close="close"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="网页内嵌" name="first">
        <div class="line-box">
          <p class="title">使用简介</p>
          <p class="text-i">
            网页内快速接入客服,让网页拥有客服窗口,请把一下代码复制到网页最底部。
          </p>
        </div>
        <div class="line-text">
          <textarea
            id=""
            ref="textarea1"
            v-model="textareaText"
            name=""
            rows="18"
            class="textarea-s"
          ></textarea>
          <div class="bth-box">
            <el-button type="primary" @click="experience(textareaText2)">
              点击体验
            </el-button>
            <el-button type="primary" @click="copyText('textarea1')">
              复制代码
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="超链接" name="second">
        <div class="line-box">
          <p class="title">使用简介</p>
          <p class="text-i">
            A链接可以在网页中或内容中添加A链接使用,可以在自己站点使用,也可以发布的外站使用,或者自己生成链接二维码使用;
          </p>
        </div>
        <div class="line-box">
          <p class="title">超链接参数说明</p>
          <ul>
            <li>uid：用户ID</li>
            <li>phone：手机号或邮箱等其他联系方式</li>
            <li>uuid：应用唯一标识符</li>
            <li>name：用户名称</li>
            <li>lang：语言zh-CN,en-US,ru-RU,pt-PT,sp-AN,vi-VN,ko-KR</li>
            <li>support_id: 客服的id，用于指定聊天的客服，默认为调取在线的客服</li>
          </ul>
          <div class="line-text">
            <textarea
              id=""
              ref="textarea2"
              v-model="textareaText2"
              name=""
              rows="4"
              class="textarea-s2"
            ></textarea>
            <div class="bth-box">
              <el-button type="primary" @click="experience(textareaText2)">
                点击体验
              </el-button>
              <el-button type="primary" @click="copyText('textarea2')">
                复制代码
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  // import { getDetail } from '@/api/customerTask.js'
  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        title: '',
        dialogFormVisible: false,
        activeName: 'first',
        textareaText: '',
        textareaText2: '',
      }
    },
    created() {},
    methods: {
      handleClick(tab, event) {},
      showDetail(row) {
        this.title = '详情'
        this.dialogFormVisible = true
        this.textareaText = ` (function () {
            var _s = document.createElement('script');
            _s.src = 'https://wschat.micome.vip/customerServer.js'
            _s.onload = function () {
                var option = {
                    authInit:true,
                    openUrl: '${location.origin}/customer/index.html#',
                    uuid: '${row.uuid}',
                    name: 'ceshi', //用户名称
                    uid: '100', //用户id
                    phone: '18888888888', //手机号或邮箱等其他联系方式
                    lang: '', //语言zh-CN,en-US,ru-RU,pt-PT,sp-AN,vi-VN,ko-KR
                    isShowTip: true, // 初始化成功后，界面右下角会自动创建 “联系客服按钮”， 如无需默认展示，则填写false即可,默认为true
                    support_id: '', //指定聊天的客服id，默认调取在线的客服
                };
                var canCustomerServer = new initCustomerServer(option);
                canCustomerServer.init();
            }
            document.head.appendChild(_s)
        })();`
        this.textareaText2 = `${location.origin}/customer/index.html#/chat/index?uuid=${row.uuid}&uid=100&name=ceshi&phone=18888888888&support_id=`
        this.$emit('fetch-data')
      },
      save() {
        this.close()
      },
      experience(url) {
        window.open(url)
      },
      copyText(id) {
        let content = this.copyToClipboard(this.$refs[id])
        // console.log(content);
      },
      copyToClipboard(elem) {
        // create hidden text element, if it doesn't already exist
        var targetId = '_hiddenCopyText_'
        var isInput = elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA'
        var origSelectionStart, origSelectionEnd
        if (isInput) {
          // can just use the original source element for the selection and copy
          target = elem
          origSelectionStart = elem.selectionStart
          origSelectionEnd = elem.selectionEnd
        } else {
          // must use a temporary form element for the selection and copy
          target = document.getElementById(targetId)
          if (!target) {
            var target = document.createElement('textarea')
            target.style.position = 'absolute'
            target.style.left = '-9999px'
            target.style.top = '0'
            target.id = targetId
            document.body.appendChild(target)
          }
          target.textContent = elem.textContent
        }
        // select the content
        var currentFocus = document.activeElement
        target.focus()
        target.setSelectionRange(0, target.value.length)

        // copy the selection
        var succeed
        try {
          succeed = document.execCommand('copy')
        } catch (e) {
          succeed = false
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === 'function') {
          currentFocus.focus()
        }

        if (isInput) {
          // restore prior selection
          elem.setSelectionRange(origSelectionStart, origSelectionEnd)
        } else {
          // clear temporary content
          target.textContent = ''
        }

        this.$message.success('已成功复制到粘贴板')

        return succeed
      },
      close() {
        this.dialogFormVisible = false
      },
    },
  }
</script>

<style>
  .line-box {
    margin: 10px;
    padding: 12px 0;
    border-bottom: 1px solid #dcdfe6;
    /* box-shadow: 0 2px 4px rgba(0,0,0, .1), 0 0 6px rgba(0,0,0, .04); */
  }

  .title {
    font-weight: 700;
  }

  .text-i {
    text-indent: 2em;
  }
  .line-text {
    max-height: 440px;
    position: relative;
  }
  .textarea-s {
    white-space: pre;
    width: 100%;
    outline: 0;
    resize: none;
    background-color: #f8f8f8;
    border: none;
    color: #323437;
    line-height: 24px;
    text-align: left;
    padding: 12px;
    box-sizing: border-box;
  }
  .textarea-s2 {
    width: 100%;
    outline: 0;
    padding: 12px;
    box-sizing: border-box;
    resize: none;
    background-color: #f8f8f8;
    border: none;
    color: #323437;
    line-height: 24px;
    text-align: left;
  }
  .bth-box {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
</style>
