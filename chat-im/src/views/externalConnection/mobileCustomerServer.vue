<template>
  <div class="pc_customerServer_container">
    <!-- 客服头部开始 -->
    <div class="pc_customerServer_container_header">
      <div class="pc_customerServer_container_header_title">
        <svg t="1689145468031" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2352" width="32" height="32">
          <path
            d="M927.616 465.6C923.328 236.704 745.888 51.808 528 51.808h-32c-217.888 0-395.328 184.896-399.616 413.76C58.112 487.744 32 528.672 32 576v64c0 70.592 57.408 128 128 128s128-57.408 128-128v-64a128.064 128.064 0 0 0-126.784-127.872C173.728 262.688 318.912 115.808 496 115.808h32c177.12 0 322.272 146.88 334.784 332.32A128.064 128.064 0 0 0 736 576v64c0 57.792 38.72 106.176 91.392 122.016a337.504 337.504 0 0 1-191.936 124.48A79.712 79.712 0 0 0 560 832a80 80 0 1 0 0 160 79.68 79.68 0 0 0 67.872-38.112 402.432 402.432 0 0 0 278.24-193.6C955.968 742.816 992 695.776 992 640v-64c0-47.328-26.112-88.256-64.384-110.4zM224 576v64c0 35.296-28.704 64-64 64s-64-28.704-64-64v-64c0-35.296 28.704-64 64-64s64 28.704 64 64z m704 64c0 34.304-27.2 62.176-61.12 63.712l-2.496-1.184c-0.224 0.512-0.576 0.928-0.8 1.408A64 64 0 0 1 800 640v-64c0-35.296 28.704-64 64-64s64 28.704 64 64v64z"
            p-id="2353" fill="#ffffff"></path>
        </svg>
        <span style="margin-left: 12px;">{{ chatServerData.to_user_nickname }}</span>
      </div>
      <div class="pc_customerServer_container_header_handle" @click="closeIframe">
        <span class="iconfont">&#xe6c5;</span>
      </div>
    </div>
    <!-- 客服头部结束 -->

    <!-- 聊天内容开始 -->
    <div class="pc_customerServer_container_content">
      <happy-scroll size="1" resize hide-horizontal :scroll-top="scrollTop" @vertical-start="scrollHandler">
        <div class="scroll_content" id="chat_scroll" :class="{ 'pt140': isShowProductModel }">
          <!-- 滑动到容器顶部时，动画加载 -->
          <Spin v-show="isLoad">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>{{ $t('loadingText') }}</div>
          </Spin>
          <!-- 动画结束 -->
          <div class="lishi" @click="getRecord" v-if="!lishibth">{{ $t('loadHistory') }}</div>
          <!-- 聊天内容列表 -->
          <div class="chart_list">
            <div class="chart_list_item" v-for="(item, index) in records" :key="index">
              <div class="chart_list_item_time" v-show="item.show">{{ item.time }}</div>
              <div class="chart_list_item_content" :class="{ 'right-box': item.user_id == chatServerData.user_id }">
                <div class="chart_list_item_avatar">
                  <svg t="1689148012722" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2651" width="32" height="32"
                    v-if="item.user_id != chatServerData.user_id">
                    <path
                      d="M517.6 877.7v-16c185.2 0 335.9-155.9 335.9-347.4v-96.6c0-191.6-150.7-347.4-335.9-347.4S181.7 226.1 181.7 417.7v96.6h-16v-96.6c0-48.8 9.3-96.3 27.7-141 17.8-43.2 43.2-82.1 75.5-115.5 32.4-33.5 70-59.7 111.9-78.1 43.4-19.1 89.4-28.7 136.8-28.7s93.4 9.7 136.8 28.7c41.9 18.4 79.5 44.7 111.9 78.1 32.4 33.4 57.8 72.3 75.5 115.5 18.4 44.8 27.7 92.2 27.7 141v96.6c0 48.8-9.3 96.3-27.7 141-17.8 43.2-43.2 82.1-75.5 115.5-32.4 33.5-70 59.7-111.9 78.1-43.5 19.1-89.5 28.8-136.8 28.8z"
                      p-id="2652" fill="#1296db"></path>
                    <path
                      d="M366.6 171.8c-1.3 0-2.6-0.6-3.3-1.8-1.2-1.8-0.7-4.3 1.1-5.5 45.8-30.6 98.7-46.7 153.2-46.7 54.2 0 107 16 152.7 46.4 1.8 1.2 2.3 3.7 1.1 5.5-1.2 1.8-3.7 2.3-5.5 1.1-44.4-29.5-95.6-45.1-148.3-45.1-52.8 0-104.3 15.7-148.7 45.4-0.7 0.5-1.5 0.7-2.3 0.7z"
                      p-id="2653" fill="#1296db"></path>
                    <path
                      d="M202.2 653.6h-71.9c-29.5 0-53.6-23.3-53.6-51.9V428.9c0-28.5 24.1-51.9 53.6-51.9h71.9c6.9 0 12.5 5.4 12.5 12.1v252.4c0 6.7-5.6 12.1-12.5 12.1z"
                      fill="#1296db" p-id="2654"></path>
                    <path
                      d="M202.2 661.6h-71.9c-33.9 0-61.6-26.9-61.6-59.9V428.9c0-33 27.6-59.9 61.6-59.9h71.9c11.3 0 20.5 9 20.5 20.1v252.4c0 11.1-9.2 20.1-20.5 20.1z m-71.9-276.5c-25.1 0-45.6 19.7-45.6 43.9v172.9c0 24.2 20.4 43.9 45.6 43.9h71.9c2.5 0 4.5-1.8 4.5-4.1V389.2c0-2.3-2-4.1-4.5-4.1h-71.9z"
                      p-id="2655" fill="#1296db"></path>
                    <path d="M153.1 620.5c-22.6 0-41.1-17.9-41.1-39.8" fill="#1296db" p-id="2656"></path>
                    <path
                      d="M153.1 624.5c-24.9 0-45.1-19.6-45.1-43.8 0-2.2 1.8-4 4-4s4 1.8 4 4c0 19.7 16.6 35.8 37.1 35.8 2.2 0 4 1.8 4 4s-1.8 4-4 4z"
                      p-id="2657" fill="#1296db"></path>
                    <path
                      d="M839.3 651.7h71.9c29.5 0 53.6-23.3 53.6-51.9V427c0-28.5-24.1-51.9-53.6-51.9h-71.9c-6.9 0-12.5 5.4-12.5 12.1v252.4c0 6.7 5.5 12.1 12.5 12.1z"
                      fill="#1296db" p-id="2658"></path>
                    <path
                      d="M911.1 659.7h-71.9c-11.3 0-20.5-9-20.5-20.1V387.3c0-11.1 9.2-20.1 20.5-20.1h71.9c33.9 0 61.6 26.9 61.6 59.9V600c0 32.9-27.6 59.7-61.6 59.7z m-71.8-276.5c-2.5 0-4.5 1.8-4.5 4.1v252.4c0 2.3 2 4.1 4.5 4.1h71.9c25.1 0 45.6-19.7 45.6-43.9V427c0-24.2-20.4-43.9-45.6-43.9h-71.9z"
                      p-id="2659" fill="#1296db"></path>
                    <path
                      d="M598.6 922.6h-162c-16.5 0-30-13.5-30-30v-50.7c0-16.5 13.5-30 30-30h162c16.5 0 30 13.5 30 30v50.7c0 16.5-13.5 30-30 30z"
                      fill="#1296db" p-id="2660"></path>
                    <path
                      d="M598.6 930.6h-162c-21 0-38-17-38-38v-50.7c0-21 17-38 38-38h162c21 0 38 17 38 38v50.7c0 20.9-17 38-38 38zM436.7 819.9c-12.1 0-22 9.9-22 22v50.7c0 12.1 9.9 22 22 22h162c12.1 0 22-9.9 22-22v-50.7c0-12.1-9.9-22-22-22h-162zM518.5 723.5c-34.5 0-68.2-9.2-97.7-26.7-8.7-5.2-17.1-11.1-25-17.6-3.4-2.8-3.9-7.9-1-11.3 2.8-3.4 7.9-3.9 11.3-1 7.2 6 14.9 11.4 22.9 16.2 27 16 58 24.5 89.6 24.5 41.5 0 81.8-14.8 113.5-41.5 3.4-2.9 8.4-2.4 11.3 0.9 2.9 3.4 2.4 8.4-0.9 11.3-34.7 29.1-78.7 45.2-124 45.2zM181.5 569.6h6.1c1.7 0 3 1.3 3 3v52.1c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-52.1c0-1.7 1.3-3 3-3z"
                      p-id="2661" fill="#1296db"></path>
                    <path
                      d="M540.7 894.3v-6.1c0-1.7 1.3-3 3-3h52.1c1.7 0 3 1.3 3 3v6.1c0 1.7-1.3 3-3 3h-52.1c-1.6 0-3-1.3-3-3zM569.8 866.7v-6.1c0-1.7 1.3-3 3-3h23.1c1.7 0 3 1.3 3 3v6.1c0 1.7-1.3 3-3 3h-23.1c-1.6 0-3-1.3-3-3zM181.5 525.7h6.1c1.7 0 3 1.3 3 3v23.4c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-23.4c0-1.6 1.3-3 3-3z"
                      p-id="2662" fill="#1296db"></path>
                    <path
                      d="M858.5 569.6h6.1c1.7 0 3 1.3 3 3v52.1c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-52.1c0-1.7 1.3-3 3-3z"
                      p-id="2663" fill="#1296db"></path>
                    <path
                      d="M858.5 525.7h6.1c1.7 0 3 1.3 3 3v23.4c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-23.4c0-1.6 1.3-3 3-3z"
                      p-id="2664" fill="#1296db"></path>
                    <path d="M889.3 620.5c22.6 0 41.1-17.9 41.1-39.8" fill="#1296db" p-id="2665"></path>
                    <path
                      d="M889.3 624.5c-2.2 0-4-1.8-4-4s1.8-4 4-4c20.4 0 37.1-16 37.1-35.8 0-2.2 1.8-4 4-4s4 1.8 4 4c0 24.2-20.2 43.8-45.1 43.8z"
                      p-id="2666" fill="#1296db"></path>
                    <path
                      d="M771.3 448.5c-0.3 0-0.6 0-0.9-0.1-41.2-4.7-73-49.4-92.5-86.2-14.6-27.7-25.4-56.6-31-76.9-22.8 36.5-52.9 65.4-89.8 86.3-34.2 19.4-74.2 31.8-118.8 37-75.6 8.7-137.7-6.2-140.3-6.9a8.1 8.1 0 0 1-5.9-9.7 8.1 8.1 0 0 1 9.7-5.9c0.6 0.2 62.3 15 135.1 6.5 96.6-11.3 166-56.1 206.4-133.3 1.7-3.2 5.3-4.9 8.8-4.1 3.5 0.8 6.1 3.8 6.3 7.4 0.7 11.2 12.8 52.7 33.7 92.2 24.9 47.1 53.4 74.7 80.1 77.7 4.4 0.5 7.5 4.5 7.1 8.8-0.5 4.2-4 7.2-8 7.2z"
                      p-id="2667" fill="#1296db"></path>
                  </svg>
                  <svg v-else t="1689148184083" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="4047" width="32" height="32">
                    <path
                      d="M513.536 628.6336c101.6832 0 280.8832 38.7072 310.8864 193.7408 77.5168-77.5168 124.928-185.9584 124.928-305.0496 0-241.152-194.6624-435.8144-435.8144-435.8144S77.7216 277.0944 77.7216 517.2224c0 119.0912 47.4112 227.6352 124.928 306.0736 30.0032-154.9312 209.2032-194.6624 310.8864-194.6624z m0-439.7056c112.3328 0 204.3904 91.0336 204.3904 204.3904 0 112.3328-91.0336 204.3904-204.3904 204.3904a203.776 203.776 0 0 1-204.3904-204.3904c0.1024-112.4352 92.0576-204.3904 204.3904-204.3904z m0 0"
                      fill="#1296db" p-id="4048"></path>
                    <path
                      d="M515.4816 1006.8992c-65.8432 0-129.8432-12.9024-189.952-38.4-58.1632-24.576-110.2848-59.8016-155.136-104.5504A485.56032 485.56032 0 0 1 65.8432 708.8128c-25.6-60.2112-38.5024-124.1088-38.5024-189.952 0-65.8432 12.9024-129.8432 38.4-189.952 24.576-58.1632 59.8016-110.2848 104.5504-155.136 44.8512-44.8512 96.9728-79.9744 155.136-104.5504C385.6384 43.6224 449.536 30.72 515.4816 30.72c65.8432 0 129.8432 12.9024 189.952 38.4 58.1632 24.576 110.2848 59.8016 155.136 104.5504 44.8512 44.8512 79.9744 96.9728 104.5504 155.136C990.6176 389.0176 1003.52 452.9152 1003.52 518.8608c0 65.8432-12.9024 129.8432-38.4 189.952-24.576 58.1632-59.8016 110.2848-104.5504 155.136a485.56032 485.56032 0 0 1-155.136 104.5504 484.39296 484.39296 0 0 1-189.952 38.4z m0-936.8576c-60.6208 0-119.3984 11.8784-174.6944 35.2256a447.76448 447.76448 0 0 0-142.6432 96.1536A444.42624 444.42624 0 0 0 101.9904 344.064a446.70976 446.70976 0 0 0-35.2256 174.6944c0 60.6208 11.8784 119.3984 35.2256 174.6944 22.6304 53.4528 54.9888 101.4784 96.1536 142.6432 41.1648 41.2672 89.1904 73.6256 142.6432 96.1536 55.296 23.3472 114.0736 35.2256 174.6944 35.2256 60.6208 0 119.3984-11.8784 174.6944-35.2256 53.4528-22.6304 101.4784-54.9888 142.6432-96.1536 41.2672-41.1648 73.6256-89.1904 96.1536-142.6432 23.3472-55.296 35.2256-114.0736 35.2256-174.6944 0-60.6208-11.8784-119.3984-35.2256-174.6944a447.76448 447.76448 0 0 0-96.1536-142.6432 444.42624 444.42624 0 0 0-142.6432-96.1536 447.44704 447.44704 0 0 0-174.6944-35.2256z m0 0"
                      fill="#1296db" p-id="4049"></path>
                  </svg>
                </div>
                <!-- 文字及表情信息 -->
                <div class="chart_list_item_text" v-if="item.msn_type <= 2">
                  <span v-html="replace_em(item.msn)"></span>
                </div>
                <!-- 图片信息 -->
                <div class="chart_list_item_img" v-if="item.msn_type == 3">
                  <img v-lazy="item.msn" @load="imageLoad" />
                </div>
                <!-- 已读标记 -->
                <!-- <img style="width:16px;height:15px;margin-left:10px;" v-if='!item.user_id' src="@/assets/images/customerServer/read.png" alt=""> -->
                <!-- 图文信息 -->
                <div class="chart_list_item_imgOrText" v-if="item.msn_type == 5">
                  <div class="order-wrapper">
                    <div class="img-box">
                      <img :src="item.other.image" alt="">
                    </div>
                    <div class="order-info">
                      <div class="price-box">
                        <div class="num">¥ {{ item.other.price }}</div>
                      </div>
                      <div class="name">{{ item.other.store_name }}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
          <div id="kongbai"></div>
          <!-- 聊天内容列表结束 -->
        </div>
      </happy-scroll>
    </div>
    <!-- 聊天内容结束 -->

    <!-- 内容输入开始 -->

    <div class="footer_customerServer_container">
      <div class="mobel_customerServer_container_footer">
        <div class="mobel_customerServer_container_footer_uploag_image">
          <span class="iconfont">&#xe6ca;</span>
          <input type="file" class="file_input" @change="uploadFile">
        </div>
        <div class="mobel_customerServer_container_footer_input">
          <div class="mobel_customerServer_container_footer_input_con" style="word-break:break-all">
            <textarea @keyup.enter="sendText" class="font"
              @input="textareaChange($event)" v-model='userMessage' :placeholder="$t('inputPlaceholder')"></textarea>
            <p class="font" v-html='pCont'></p>
          </div>
        </div>
        <!-- 发送消息 -->
        <div class="sendMessage" :class="{ 'sendMessage-primary': userMessage }">
          <div @click="sendText">{{ $t('send') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { HappyScroll } from 'vue-happy-scroll'
import socketServer from './minix/socketServer';
import '@/assets/js/uniapp.js';
export default {
  components: {
    HappyScroll
  },
  mixins: [socketServer],
  data() {
    return {
      isLoad: false,
      scrollTop: 0,
      pCont: '',
      deviceType: 'mobile',
    }
  },
  mounted() {
    if (this.userAgentType !== 0) {
      window.addEventListener('popstate', this.handlePopstate)
    }
  },
  beforeDestroy() {
    if (this.userAgentType !== 0) {
      window.removeEventListener('popstate', this.handlePopstate)
    }
  },
  computed: {
    
    records() {
      return this.chatServerData.serviceList.map((item, index) => {
        item.time = this.formatDate(item.add_time * 1000);
        if (index) {
          if (
            item.add_time -
            this.chatServerData.serviceList[index - 1].add_time >=
            300
          ) {
            item.show = true;
          } else {
            item.show = false;
          }
        } else {
          item.show = true;
        }
        return item;
      });
    }
  },
  methods: {
    onBackPress() {
      alert(uniWeb)
      uniWeb.webView.navigateBack({
        delta: history.length,
        fail(err) {
          alert(err)
        },
      });
    },
    handlePopstate() {
      alert(history.length);
      uniWeb.webView.navigateBack({
        delta: history.length,
      });
      history.pushState(null, null, document.URL);
    },
    textareaChange(e) {
      let strCont = e.target.value.replace(/\n\s(\s)*/gi, '\n') // 将多个回车换行合并为 1个
      strCont = strCont.replace(/^\s*/gi, '') // 清除首行的 空格与换行

      let strHtml = strCont.replace(/</gi, '&lt;')  // 将所有的 < 转义为 &lt; 防止html标签被转义
      strHtml = strCont.replace(/\n(\n)*/gi, '<br>')  // 回车换行替换为 <br>
      strHtml = strHtml.replace(/\s+/gi, '&nbsp;')  // 一个或过个空格 替换为 &nbsp;

      strCont = strHtml.replace(/&nbsp;/gi, ' ')  // 逆向处理
      strCont = strCont.replace(/<br>/gi, '\n')   // 逆向处理
      strCont = strCont.replace(/&lt;/gi, '<')

      this.userMessage = strCont
      /** 如果 p 标签最后的字符为 <br> 并不会单独另起一行, 会导致与 textarea 的高度相差一行,
        * 所以在最后添加一个字符, 这样就能保证 P 标签的高度与 textarea 的高度一致
        */
      this.pCont = strHtml + '.'
    },
    getScrollTop() {
    },
    getScrollEnd() {
    },


    // 聊天表情转换
    replace_em(str) {
      str = str.replace(/\[em-([\s\S]*)\]/g, "<span class='em em-$1'/></span>");
      return str;
    },
  }
}
</script>
<style>
   
</style>
<style lang="less" scoped>
#kongbai {
  // background-color: red;
}

.pc_customerServer_container {
  max-width: 100vw;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f5f5f5;
  overflow: hidden;

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(270deg, #1890ff 0%, #3875ea 100%);
    padding: 7px 14px;
    font-size: 16px;
    color: #fff;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    &_title {
      display: flex;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }

    &_handle {
      cursor: pointer;
    }
  }

  &_content {
    flex: 1;
    overflow: hidden;
   margin-top: 46px;
    .scroll_content {
      width: 98%;
      height: 100%;
      overflow-y: auto;
      padding-bottom: 20px;
      box-sizing: border-box;

      .chart_list {
        position: relative;
        z-index: 2;

        &_item {
          &_content {
            display: flex;
            align-items: center;
            padding: 8px;
          }

          &_avatar {
            width: 33px;
            height: 33px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
            align-self: flex-start;

            img {
              width: 100%;
              height: 100%;
            }
          }

          &_text {
            max-width: 60%;
            word-wrap: break-word;
            background: #fff;
            padding: 9px 14px;
            font-size: 15px;
            border-radius: 6px;
          }

          &_img {
            max-width: 60%;

            img {
              width: 100%;
              height: auto;
            }
          }

          .chart_list_item_imgOrText {
            background: #fff;
            padding: 4px 10px;
            border-radius: 8px;
            width: 226px;
            box-sizing: border-box;

            .order-wrapper {
              .img-box {
                width: 100%;

                img {
                  width: 100%;
                  height: auto;
                }
              }

              .order-info {
                .price-box {
                  color: #ff0000;
                  font-size: 18px;
                }

                .name {
                  font-size: 14px;
                }
              }
            }
          }

          &_time {
            text-align: center;
            margin: 10px auto;
          }

          .right-box {
            flex-direction: row-reverse;

            .chart_list_item_avatar {
              margin-left: 10px;
            }

            .chart_list_item_text {
              text-align: right;
              background: #cde0ff;
              color: #000;
            }

            .chart_list_item_img {
              text-align: right;
              background: #fff;

              img {
                width: 100%;
                height: auto;
              }
            }

            .chart_list_item_imgOrText {
              background: #fff;
              padding: 10px;
              border-radius: 8px;
              width: 226px;
              box-sizing: border-box;

              .order-wrapper {
                .img-box {
                  width: 100%;

                  img {
                    width: 100%;
                    height: auto;
                  }
                }

                .order-info {
                  .price-box {
                    color: #ff0000;
                    font-size: 18px;
                  }

                  .name {
                    font-size: 14px;
                  }
                }
              }
            }
          }

          &_text {}
        }
      }
    }
  }

  .mobel_customerServer_container_footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ececec;
    padding: 8px 15px;
    box-sizing: border-box;
    position: relative;

    .crmchat_link {
      text-align: center;
      width: 98%;
      transition: 0.3s;
      z-index: 1;
      cursor: pointer;
      position: absolute;
      bottom: 60px;

      span {
        color: #ccc;
      }

      span:hover {
        color: #007aff;
      }
    }

    .iconfont {
      font-size: 24px;
    }

    .mobel_customerServer_container_footer_uploag_image {
      font-size: 24px;
      display: flex;
      align-items: center;
      position: relative;
    }

    .file_input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    &_input {
      flex: 1;
      margin: 0 9px;
      background: #fff;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      // line-height: 28px;

      &_con {
        flex: 1;
        position: relative;
        min-height: 32px;
        display: flex;
        align-items: center;

        .font {
          // font-size: 14px;
          padding: 4px 8px;
        }

        textarea {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          resize: none;
          outline: none;
          background: none;
          color: rgba(0, 0, 0, 0.7);
          border: none;
          width: 100%;
          height: 100%;
          font-size: 15px;
        }

        p {
          width: 100%;
          display: block;
          min-height: 20px;
          opacity: 0;
        }
      }

      &_send {
        align-self: flex-start;
        padding-right: 8px;
      }
    }

    &_emoji {
      display: flex;
      align-items: center;
      font-size: 24px;
    }

    .sendMessage {
      background: #ccc;
      padding: 4px 12px;
      border-radius: 4px;
      margin-left: 8px;
      color: #fff;
      font-size: 14px;
    }

    .sendMessage-primary {
      background: #3875ea;
    }

    &_emojiList {
      width: 100%;
      height: 0;
      // padding: 10px;
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      grid-row-gap: 20px;
      overflow-y: auto;
      background: #fff;
      transition: 0.3s;
    }
  }
}

.canSelectemoji {
  height: 165px !important;
  padding: 10px;
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.primary_color {
  color: #3875ea;
}

.productMessage_container {
  // height: 94px;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  justify-content: space-between;

  &_image {
    margin-right: 12px;

    img {
      width: 77px;
      height: 77px;
    }
  }

  &_content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &_title {
      font-size: 14px;
      color: #333;
      height: 42px;
      font-weight: 800;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-align: left !important;
    }

    &_priceOrHandle {
      display: flex;
      justify-content: space-between;

      >div:nth-child(1) {
        font-size: 18px;
        color: #e93323;
        text-align: left;
      }

      >div:nth-child(2) {
        width: 65px;
        height: 25px;
        background: #e83323;
        opacity: 1;
        border-radius: 62px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        line-height: 25px;
        cursor: pointer;
      }
    }
  }
}

.pt140 {
  padding-bottom: 140px !important;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/deep/ .happy-scroll-content {
  max-width: 100vw;
  width: 100%;
  box-sizing: border-box;
}

.lishi {
  text-align: center;
  margin: 10px;
  color: #1890ff;
  cursor: pointer;
}

.lishi:hover {
  color: #007aff;
}
</style>
