<template>
  <div class="customerOutLine_server" :class="{ 'max_style': !isMobile }">
    <div class="customerOutLine_server_header">
      <span>{{$t('offline')}}</span>
      <div class="pc_customerServer_container_header_handle" @click="closeIframe">
        <span class="iconfont">&#xe6c6;</span>
      </div>
    </div>
    <div class="customerOutLine_server_content">
      <div class="customerOutLine_server_content_message">
        <div>{{$t('offlineTips')}}</div>
        <div class="customerOutLine_server_content_message_phone">
          <div>
            {{$t('dateTime')}}：{{online_time[0]}}～{{online_time[1]}}
          </div>
          <div>
          </div>
        </div>
      </div>

      <div class="customerOutLine_server_content_form">
        <div>
          <input v-model="feedData.rela_name" type="text" placeholder="请输入您的姓名">
        </div>
        <div>
          <input v-model="feedData.phone" type="number" placeholder="请输入您的联系电话">
        </div>
        <div>
          <textarea v-model="feedData.content" name="" id="" cols="30" rows="10" placeholder="请填写留言内容"></textarea>
        </div>
      </div>

      <div class="customerOutLine_server_content_handle">
        <div @click="postFeedMessage">
          <span>提交留言</span>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { serviceFeedback, serviceFeedbackPost,getInfo } from '@/api/kefu';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      feedback: '', // 广告内容
      feedData: {
        rela_name: '',
        phone: '',
        content: ''
      },
      online_time:['00:00','00:00'],
      query:{}
    }
  },
  computed: {
    ...mapState('media', ['isMobile']),
  },
  created() {
    console.log(this.$route);
    if(this.$route.params.online_time){
      this.online_time = this.$route.params.online_time
    }else{
      this.query = this.$route.query;
      this.getInfoFun()
    }
    // this.selectFeedBack();
    // parent.postMessage({ type: 'customerOutLine' }, "*"); // 通知客服已经离线
  },
  methods: {
    getInfoFun() {
      getInfo({ uuid: this.query.uuid })
        .then((res) => {
          if (res.errno === 0) {
            let online_time = res.data.online_time.split("-");
            let isCustomer = res.data.online_count === 0 
            if (isCustomer) {
              this.online_time = online_time
            }else{
              this.$router.replace({
                name: "customerServerRedirect",
                query: this.$route.query,
              });
            }
          }
        })
        .catch((err) => {});
    },
    // 查询广告
    selectFeedBack() {
      serviceFeedback().then(res => {
        if(res.status == 200) {
          this.feedback = res.data.feedback;
        }
      })
    },
    // 提交反馈信息
    postFeedMessage() {
      serviceFeedbackPost(this.feedData).then(res => {
        if(res.status == 200) {
          this.$Message.success(this.$t('submitTips'));
          this.$router.push({
            name: 'finishSubmitOutLine',
            query: this.$route.query
          })
        }
      }).catch(rej => {
        this.$Message.error(rej.errmsg);
      })
    },
    // 关闭弹框
    closeIframe() {
      parent.postMessage({ type: 'closeWindow' }, "*");
    }
  }
}
</script>
<style lang="less" scoped>
.customerOutLine_server {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 12px 0px rgba(0, 0, 0, 0.1);
  &_header {
    height: 50px;
    background: linear-gradient(270deg, #1890ff 0%, #3875ea 100%);
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    .pc_customerServer_container_header_handle {
      cursor: pointer;
    }
  }

  &_content {
    padding: 17px 18px;
    &_message {
      font-size: 13px;
      color: #333333;
      margin-bottom: 26px;
      &_phone {
        margin-top: 30px;
      }
    }
    &_form {
      > div {
        margin-bottom: 18px;
        input {
          border-radius: 3px;
          border: 1px solid #ececec;
          outline: none;
          font-size: 13px;
          padding-left: 14px;
          width: 100%;
          height: 40px;
        }
        textarea {
          width: 100%;
          border: 1px solid #ececec;
          outline: none;
          font-size: 13px;
          padding: 14px;
        }
      }
    }

    &_handle {
      margin-top: 13px;
      > div {
        height: 40px;
        background: #3875ea;
        border-radius: 3px;
        color: #fff;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.max_style {
  max-width: 375px;
  max-height: 668px;
}
</style>
