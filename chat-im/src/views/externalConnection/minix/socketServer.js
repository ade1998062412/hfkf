import { mobileScoket } from "@/utils/socket";
import {
  userRecord,
  serviceUpload,
  serviceAdv,
  userStatistics,
  getInfo,
  getHistory,
} from "@/api/kefu";
import { setLoc, getLoc, getGuid } from "@/utils/util";
import { mapState } from "vuex";
var mp3 = require("@/assets/video/notice.wav");
export default {
  data() {
    return {
      userAgentType: 0,
      mp3: new Audio(mp3),
      inputConType: 1,
      userMessage: "",
      chatServerData: {
        avatar: "",
        nickname: "",
        site_name: "",
        user_id: "",
        to_user_avatar: "",
        to_user_id: "",
        to_user_nickname: "",
        uid: "",
        serviceList: [], // 聊天记录
      },
      chatStatus: false,
      toChat: false,
      upperStrataData: {},
      upperData: {}, // 外部链接携带进来的参数
      unreadMessages: "",
      userKey: "",
      productMessage: {},
      isShowProductModel: false, // 是否显示携带商品
      copyFile: "", // 粘贴在输入框中的file文件
      unReadMesage: 0, // 未读消息数
      advertisement: "", // 广告
      ws: "",
      historyPage: {
        uuid: "", //应用uuid
        uid: "", //用户uid
        support_id:'',
        page: 1,
        limit: 20,
        pages: 10,
        sort: "created_at",
        order: "desc",
      },
      zongHeight: 0,
      dangqianHeight: 0,
      lishibth: false,
    };
  },
  computed: {
    ...mapState("media", ["isMobile"]),
  },
  // 指令粘贴指令定义
  directives: {
    paste: {
      bind(el, binding, vnode) {
        el.addEventListener("paste", function (event) {
          //这里直接监听元素的粘贴事件
          binding.value(event);
        });
      },
    },
  },
  created() {
    this.$Message.config({
      top: 400,
      duration: 3
    });

    this.initFun();
    this.zongHeight = window.screen.availHeight || window.clientHeight;
    this.redirect();
    // this.loadJS();
    // 获取url参数
    this.upperData = this.$route.query;
    this.chatServerData.to_user_nickname = this.$t("kefuName");
    // 将url参数存入缓存
    Object.keys(this.upperData).forEach((item) => {
      if (this.upperData[item]) {
        setLoc(item, this.upperData[item]);
        if (item == "uid") {
          this.chatServerData.user_id = this.upperData[item];
        }
      }
    });
    this.getInfoFun(); // 用户信息
    this.connentServer('init'); // 建立socket连接
    const isIphpone = this.IsIA();
    if (isIphpone === 1) {
      window.addEventListener("resize", this.onResize);
    } else if (isIphpone === 2) {
      window.addEventListener("focusin", this.textareaInput);
      window.addEventListener("focusout", this.textareaInputBlur);
    }
  },
  watch: {
    productMessage: {
      handler(val, oldVal) {
        if (JSON.stringify(val) != JSON.stringify(oldVal)) {
          this.isShowProductModel = true;
          // this.goPageBottom(); // 滑动到页面底部
        }
      },
      deep: true,
    },
    isMobile(n) {
      this.redirect();
    },
  },
  methods: {
    getHistoryFun(){
      this.isLoad = true;
      this.historyPage.uuid = this.upperData.uuid;
      this.historyPage.support_id = this.upperData.support_id;
      this.historyPage.uid = this.chatServerData.user_id;
      getHistory(this.historyPage).then((res) => {
          this.lishibth = true;
          console.log('-----000000000')
          console.log(res.errno)
          if (res.errno === 0) {
            this.historyPage.pages = res.data.last_page;
            res.data.data.map((i) => {
               // 发送已读状态到服务端(历史消息)
              if(i.status == "send"){
                this.ws.send({
                  cmd:'upmessread',
                  data: {"messages_id":i.id},
                  type: "read",
                });
              };
              let chat = null;
              let guid = getGuid();
              let isText = i.type === "text";
              let msn = isText
                ? i.body
                : "https://wschat.micome.vip/" + i.file.file_path;
              let type = isText ? 1 : 3;
              if (i.from_support_id) {
                chat = this.messageDispose(i, guid);
              } else {
                chat = this.chatOptinos(guid, msn, type);
              };
              chat.add_time = i.last_send_at / 1000;
              this.unshiftMessageToList(chat);
            });
            this.goPageBottom(); // 滑动到页面底部
          }
          this.isLoad = false;
        })
        .catch((err) => {
          this.lishibth = true;
        });
    },
    IsIA() {
      const userAgent =
        typeof window === "object" ? window.navigator.userAgent : "";
      if (/android/i.test(userAgent)) {
        return 1;
      } else if (/iPhone|iPod|iPad/i.test(userAgent)) {
        return 2;
      }
    },
    initFun() {
      document.addEventListener("gesturestart", function (e) {
        e.preventDefault();
      });

      // 在单个元素上单击两次 ===  dblclick
      document.addEventListener("dblclick", function (e) {
        e.preventDefault();
      });

      // 一个手指放在屏幕上时，会触发 touchstart 事件
      document.addEventListener("touchstart", function (event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      });

      // 如果一个或两个手指在屏幕上滑动，将会触发 gesturechange 事件。
      // 但只要有一个手指移开， 就会触发 gestureend 事件，紧接着又会触发基于该手指的 touchend 事件。
      var lastTouchEnd = 0;
      document.addEventListener(
        "touchend",
        function (event) {
          var now = new Date().getTime();
          // 如果在300ms内触发两次touchend，就阻止默认事件
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    },
    getRecord() {
      this.isLoad = true;
      this.historyPage.uuid = this.upperData.uuid;
      this.historyPage.uid = this.chatServerData.user_id;
      getHistory(this.historyPage)
        .then((res) => {
          this.lishibth = true;
          if (res.errno === 0) {
            this.historyPage.pages = res.data.last_page;
            res.data.data.map((i) => {

               // 发送已读状态到服务端(历史消息)
              if(i.status == "send"){
                this.ws.send({
                  cmd:'upmessread',
                  data: {"messages_id":i.id},
                  type: "read",
                });
              };

              let chat = null;
              let guid = getGuid();

              let isText = i.type === "text";
              let msn = isText
                ? i.body
                : "https://wschat.micome.vip/" + i.file.file_path;
              let type = isText ? 1 : 3;
              if (i.from_support_id) {
                chat = this.messageDispose(i, guid);
              } else {
                chat = this.chatOptinos(guid, msn, type);
              }
              chat.add_time = i.last_send_at / 1000;
              this.unshiftMessageToList(chat);
            });
            // this.goPageBottom(); // 滑动到页面底部
          }
          this.isLoad = false;
        })
        .catch((err) => {
          this.lishibth = true;
        });
    },
    getInfoFun() {
      getInfo({ uuid: this.upperData.uuid,support_id:this.upperData.support_id })
        .then((res) => {
          if (res.errno === 0) {
            let online_time = res.data.online_time.split("-");
            if (online_time.length !== 2) {
              online_time = ["00:00", "00:00"];
            }
            let isCustomer = res.data.online_count === 0;
            if (isCustomer) {
              let chat = null;
              let guid = getGuid();
              let current_lang = getLoc('lang');
              let i="";
              if(current_lang == 'ko-KR'){
                i = {
                  type: "text",
                  id: -1,
                  body:
                  `안녕하세요.현재 서비스센터 오프라인 상태입니다.업무시간에 문의 해주시기 바랍니다, 업무시간은 ${online_time[0]} ~ ${online_time[1]}까지 입니다`
                };
              }else{
                i = {
                  type: "text",
                  id: -1,
                  body:
                    this.$t("offlineTips") +
                    this.$t("dateTime") +
                    ":" +
                    online_time[0] +
                    " ~ " +
                    online_time[1],
                };
              }
              chat = this.messageDispose(i, guid);
              chat.add_time = Date.parse(new Date()) / 1000;
              this.pushMessageToList(chat);
              // this.$router.replace({
              //   name: "customerOutLine",
              //   query: this.$route.query,
              //   params: { online_time },
              // });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    judgeTime(startTime, endTime) {
      // 获取当前时间
      const date = new Date();
      // 获取当前时间的年月日
      const dataStr = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} `;
      // 获取开始时间、结束时间、现在时间的时间戳
      let startDate = new Date(dataStr + startTime).getTime();
      let endDate = new Date(dataStr + endTime).getTime();
      let nowDate = date.getTime();

      const s = startDate > endDate; // 判断开始时间否大于结束时间

      if (s) [startDate, endDate] = [endDate, startDate]; // 若开始时间否大于结束时间则交换值
      // 判断现在的时间是否在开始时间和结束时间之间，若s为true则结果取反
      if (nowDate > startDate && nowDate < endDate) {
        return s ? false : true;
      } else {
        return s ? true : false;
      }
    },
    loadJS() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("AlipayClient") > -1) {
        this.userAgentType = 1;
        // 支付宝小程序的 JS-SDK 防止 404 需要动态加载，如果不需要兼容支付宝小程序，则无需引用此 JS 文件。
        document.writeln(
          '<script src="https://appx/web-view.min.js"' +
            ">" +
            "<" +
            "/" +
            "script>"
        );
      } else if (/QQ/i.test(userAgent) && /miniProgram/i.test(userAgent)) {
        this.userAgentType = 2;
        // QQ 小程序
        document.write(
          '<script type="text/javascript" src="https://qqq.gtimg.cn/miniprogram/webview_jssdk/qqjssdk-1.0.0.js"></script>'
        );
      } else if (
        /miniProgram/i.test(userAgent) &&
        /micromessenger/i.test(userAgent)
      ) {
        this.userAgentType = 3;
        // 微信小程序 JS-SDK 如果不需要兼容微信小程序，则无需引用此 JS 文件。
        document.write(
          '<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>'
        );
      } else if (/toutiaomicroapp/i.test(userAgent)) {
        this.userAgentType = 4;
        // 头条小程序 JS-SDK 如果不需要兼容头条小程序，则无需引用此 JS 文件。
        document.write(
          '<script type="text/javascript" src="https://s3.pstatp.com/toutiao/tmajssdk/jssdk-1.0.1.js"></script>'
        );
      } else if (/swan/i.test(userAgent)) {
        this.userAgentType = 5;
        // 百度小程序 JS-SDK 如果不需要兼容百度小程序，则无需引用此 JS 文件。
        document.write(
          '<script type="text/javascript" src="https://b.bdstatic.com/searchbox/icms/searchbox/js/swan-2.0.18.js"></script>'
        );
      } else if (/quickapp/i.test(userAgent)) {
        this.userAgentType = 6;
        // quickapp
        document.write(
          '<script type="text/javascript" src="https://quickapp/jssdk.webview.min.js"></script>'
        );
      }
    },
    userStatistics() {
      let ua = window.navigator.userAgent;
      let browser = "";
      if (
        ua.indexOf("MSIE") != -1 &&
        (!!window.ActiveXObject || "ActiveXObject" in window)
      ) {
        browser = "IE";
      } else if (ua.indexOf("Firefox") != -1) {
        browser = "Firefox";
      } else if (ua.indexOf("Chrome") != -1) {
        browser = "Chrome";
      } else if (ua.indexOf("Opera") != -1) {
        browser = "Opera";
      } else if (ua.indexOf("Safari") != -1) {
        browser = "Safari";
      } else if (ua.indexOf("Netscape") != -1) {
        browser = "Netscape";
      }
      userStatistics({
        ip: window.returnCitySN ? window.returnCitySN.cip : "",
        path: window.location.href,
        source: window.parent.location.href,
        browser: browser,
      })
        .then((res) => {})
        .catch((err) => {});
    },
    redirect() {
      if (this.isMobile && this.deviceType == "mobile") {
      } else if (this.isMobile && this.deviceType == "pc") {
        this.$router.push({
          name: "customerServerMobile",
          query: this.$route.query,
        });
      } else if (!this.isMobile && this.deviceType == "pc") {
      } else if (!this.isMobile && this.deviceType == "mobile") {
        this.$router.push({
          name: "customerServerPc",
          query: this.$route.query,
        });
      }
    },
    // 获取客服广告
    getServiceAdv() {
      serviceAdv()
        .then((res) => {
          if (res.status == 200) {
            this.advertisement = res.data.content;
          }
        })
        .catch((err) => {});
    },

    imageLoad() {
      // this.goPageBottom(); // 滑动到页面底部
    },
    onResize() {
      //键盘弹起与隐藏都会引起窗口的高度发生变化
      setTimeout(() => {
        const resizeHeight = window.innerHeight;
        this.dangqianHeight = this.zongHeight - resizeHeight;
        if (this.dangqianHeight > 180) {
          document.querySelector("#kongbai").style.height =
            this.dangqianHeight - 120 + "px";
          this.goPageBottom(2);
        } else {
          document.querySelector("#kongbai").style.height = 0 + "px";
          this.goPageBottom(2);
        }
      }, 100);
    },
    textareaInputBlur() {
      setTimeout(() => {
        document.querySelector(".pc_customerServer_container_content").style[
          "max-height"
        ] = "none";
        document.querySelector(".happy-scroll-container").style["height"] =
          window.innerHeight - 100 + "px";
        document.querySelector(".pc_customerServer_container").style[
          "justify-content"
        ] = "space-between";
        window.scroll(10, 0);
        this.goPageBottom(2);
      }, 300);
    },
    // 建立连接
    connentServer(t) {
      if(t== 'init'){
        this.isLoad = true;
        this.lishibth = true;
      }
      let token = "";
      let formTerminal = this.upperData.deviceType == "Mobile" ? "h5" : "pc";
      this.bus.pageWs = mobileScoket(true, token, formTerminal);
      this.bus.pageWs.then((ws) => {
        this.ws = ws;
        this.chatStatus = true;
        let to_user_id =
          this.upperData.isShowTip && this.upperData.isShowTip != "undefined"
            ? 0
            : this.chatServerData.to_user_id;
        ws.send({
          cmd: "init",
          type: "user",
          data: {
            uid: this.chatServerData.user_id,
            support_id:this.upperData.support_id,
            name: this.chatServerData.name,
            lang: this.chatServerData.lang,
            phone: this.userMessage.phone
              ? this.userMessage.phone
              : this.chatServerData.phone,
            uuid: this.upperData.uuid,
            type: this.upperData.deviceType == "Mobile" ? "3" : "0", // 0 = pc , 1 = 微信 ，2 = 小程序 ，3 = H5, 4 = APP
          },
        });
        if(t == 'init'){
          this.getHistoryFun(); // 历史消息
        };
        console.log('connent success')
        if (!to_user_id) {
          if (!this.toChat && this.chatServerData.to_user_id) {
            ws.send({
              data: {
                id: this.chatServerData.to_user_id,
                test: 1,
              },
              type: "to_chat",
            });
            this.toChat = true;
          }
        }
        // parent.postMessage({ type: "onMessageSuccess", data: {} }, "*");
        ws.$on("close", () => {
          this.toChat = false;
          this.chatStatus = false;
        });

        // 接受消息监听函数
        ws.$on(["message"], (data) => {
          if (data.code == 200) {
            if (data.data) {
              let guid = getGuid();
              let chat = null;
              chat = this.messageDispose(data.data, guid);
              chat.add_time = Date.parse(new Date()) / 1000;
              // console.log()
              this.pushMessageToList(chat,data);
              this.goPageBottom(); // 滑动到页面底部
              this.chatServerData.to_user_id = data.data.contact.id;


            }
          } else if (data.code == 100) {
            this.spliceMessageToList(data.data);
          } else if (data.code == -1) {
            this.$Message.error(data.msg);
          }
        });
      });
    },

    // 前往页面底部，用于接收到聊天记录后查看到最新消息
    goPageBottom(type) {
      this.scrollTop = 122;
      if (type === 2) {
        this.$nextTick(() => {
          this.scrollTop =
            document.querySelector("#chat_scroll").offsetHeight + 500;
        });
      } else {
        this.$nextTick(() => {
          this.scrollTop = document.querySelector("#chat_scroll").offsetHeight;
        });
      }
    },

    //微信截图上传图片时触发
    handleParse(e) {
      let file = null;
      if (
        e.clipboardData &&
        e.clipboardData.items[0] &&
        e.clipboardData.items[0].type &&
        e.clipboardData.items[0].type.indexOf("image") > -1
      ) {
        //这里就是判断是否有粘贴进来的文件且文件为图片格式
        file = e.clipboardData.items[0].getAsFile();
      } else {
        this.$message({
          type: "warning",
          message: this.$t("uploadErrorImageTips"),
        });
        return;
      }
      this.update(file);
    },
    update(e) {
      // 上传照片
      let file = e;
      let param = new FormData(); // 创建form对象
      param.append("filename", "file"); // 通过append向form对象添加数据进去
      param.append("file", file); // 通过append向form对象添加数据进去
      // 添加请求头
      serviceUpload(param)
        .then((res) => {
          this.sendMsg(res.data.file, 3);
          this.$refs["inputDiv"].innerText = "";
        })
        .catch((err) => {});
    },
    // 选择表情
    select(item) {
      if (this.$route.query.deviceType == "Mobile" || !this.$refs["inputDiv"]) {
        this.userMessage += `[${item}]`;
      } else {
        this.inputConType = 1;
        this.$refs["inputDiv"].innerText += `[${item}]`;
      }
    },
    // 时间戳转换日期
    formatDate(value) {
      var date = new Date(value);
      var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (i < 10) {
        i = "0" + i;
      }
      if (s < 10) {
        s = "0" + s;
      }
      var t = y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;
      return t;
    },
    // 文本发送
    sendText() {
      let sendMessage;
      if (!this.$refs["inputDiv"]) {
        sendMessage = this.userMessage.replace(/[\r\n]/g, "");
      } else {
        sendMessage = this.$refs["inputDiv"].innerText.replace(/[\r\n]/g, "");
      }

      if (sendMessage) {
        this.sendMsg(sendMessage, 1);
        this.$refs["inputDiv"]
          ? (this.$refs["inputDiv"].innerText = "")
          : (this.userMessage = "");
      } else {
        this.$Message.error(this.$t("inputErrorTips"));
        this.$refs["inputDiv"]
          ? (this.$refs["inputDiv"].innerText = "")
          : (this.userMessage = "");
      }
    },
    // type: 1 普通文本 2 图片
    sendMsg(msn, type, id) {
      if (!this.chatStatus) {
        // return this.$Message.error(this.$t("connectTips"));
        this.connentServer('send');
        return this.$Message.error({
          render: h=>{
            return h('p',{style:{fontSize:'22px'}},[this.$t("connectTips")])
          }
        })
      }
      let guid = getGuid();
      let chat = null;
      let data = {};
      if (type <= 2) {
        data = {
          cmd: "send",
          data: {
            type: "text",
            body: msn,
            file_id: undefined,
            support_id:this.upperData.support_id,
          },
        };
        chat = this.chatOptinos(guid, msn, type);
      } else if (type == 3) {
        data = {
          cmd: "send",
          data: {
            type: "image",
            body: undefined,
            file_id: msn.id,
            support_id:this.upperData.support_id,
          },
        };
        chat = this.chatOptinos(
          guid,
          "https://wschat.micome.vip/" + msn.file_path,
          type
        );
      }
      this.ws.send(data);
      chat.add_time = Date.parse(new Date()) / 1000;
      this.pushMessageToList(chat);
      this.goPageBottom();
    },
    pushMessageToList(data,dataObj=null) {
      console.log(dataObj,'FF44F');
      this.chatServerData.serviceList.push(data);
      // 发送已读状态到服务端
      if(dataObj && dataObj.data.status == "send"){
        this.ws.send({
          cmd:'upmessread',
          data: {"messages_id":dataObj.data.id},
          type: "read",
        });
      }
    },
    unshiftMessageToList(data) {
      this.chatServerData.serviceList.unshift(data);
    },
    spliceMessageToList(data) {
      for (const i in this.chatServerData.serviceList) {
        if (this.chatServerData.serviceList[i].messageId == data.message_id) {
          this.chatServerData.serviceList.splice(i, 1);
        }
      }
    },
    chatOptinos(guid, msn, type, other) {
      return {
        msn,
        msn_type: type,
        to_user_id: this.chatServerData.to_user_id,
        is_send: 0,
        is_tourist: 0,
        avatar: this.chatServerData.avatar,
        user_id: this.chatServerData.user_id,
        appid: this.chatServerData.appid,
        other: other || {},
        type: 0,
        guid: guid,
      };
    },
    messageDispose(data, guid, other) {
      let msn =
        data.type == "image"
          ? "https://wschat.micome.vip/" + data.file.file_path
          : data.body;
      let type = data.type == "image" ? 3 : 1;
      return {
        msn,
        msn_type: type,
        to_user_id: this.chatServerData.user_id,
        is_send: 0,
        is_tourist: 0,
        messageId: data.id,
        avatar: this.chatServerData.avatar,
        user_id: this.chatServerData.to_user_id,
        appid: this.chatServerData.appid,
        other: other || {},
        type: 0,
        guid: guid,
      };
    },
    // 滑动到顶部
    scrollHandler(e) {
      if (this.lishibth) {
        this.isLoad = true;
        if (this.historyPage.page < this.historyPage.pages) {
          this.historyPage.page++;
          this.getRecord();
        } else {
          this.$Message.success(this.$t("allLoaded"));
          this.isLoad = false;
        }
      }
    },
    closeIframe() {
      // 通知外部容器，收起iframe
      parent.postMessage({ type: "closeWindow" }, "*");
      // 通知服务器，客户收起了聊天框
      this.bus.pageWs.then((ws) => {
        ws.send({ type: "to_chat", data: { id: 0 } });
        this.toChat = true;
      });
    },
    // 聊天输入框获取焦点
    textareaInput() {
      this.inputConType = 1;
      setTimeout(() => {
        document.querySelector(".pc_customerServer_container_content").style[
          "max-height"
        ] = window.innerHeight - 100 + "px";
        document.querySelector(".happy-scroll-container").style["height"] =
          window.innerHeight - 100 + "px";

        document.querySelector(".pc_customerServer_container_content").style[
          "overflow"
        ] = "auto";
        document.querySelector(".pc_customerServer_container").style[
          "justify-content"
        ] = "unset";
        window.scroll(10, 0);
        this.goPageBottom(2);
      }, 350);
    },

    dataURLtoFile(dataurl, f) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], f.name, { type: mime });
    },
    compressImg(file) {
      var src;
      var files;
      var fileSize = parseFloat(parseInt(file["size"]) / 1024 / 1024).toFixed(
        2
      );
      var read = new FileReader();
      let that = this;
      read.readAsDataURL(file);
      return new Promise((resolve, reject) => {
        read.onload = function (e) {
          var img = new Image();
          img.src = e.target.result;
          img.onload = function () {
            //默认按比例压缩
            var w = this.width,
              h = this.height;
            //生成canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var base64;
            // 创建属性节点
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
            ctx.drawImage(this, 0, 0, w, h);

            if (fileSize < 1) {
              //如果图片小于一兆 那么不执行压缩操作
              base64 = canvas.toDataURL(file["type"], 1);
            } else if (fileSize > 1 && fileSize < 2) {
              //如果图片大于1M并且小于2M 那么压缩0.5
              base64 = canvas.toDataURL(file["type"], 0.5);
            } else {
              //如果图片超过2m 那么压缩0.2
              base64 = canvas.toDataURL(file["type"], 0.2);
            }
            // 回调函数返回file的值（将base64编码转成file）
            files = that.dataURLtoFile(base64, file); //如果后台接收类型为base64的话这一步可以省略

            resolve(files);
          };
        };
      });
    },
    // 上传图片
    uploadFile(e) {
      this.compressImg(e.target.files[0]).then((file) => {
        let formData = new FormData();
        formData.append("filename", "file");
        formData.append("file", file);
        serviceUpload(formData)
          .then((res) => {
            this.sendMsg(res.data.file, 3);
          })
          .catch((rej) => {
            this.$Message.error(rej.errmsg);
          });
      });
    },

    // 使用 window.opener 更改session
    setSession(name, value) {
      if (
        window.opener &&
        Object.getOwnPropertyNames(window.opener).length > 0
      ) {
        window.opener.sessionStorage.setItem(name, value);
      } else {
        sessionStorage.setItem(name, value);
      }
    },
    getSession(name) {
      if (
        window.opener &&
        Object.getOwnPropertyNames(window.opener).length > 0
      ) {
        return window.opener.sessionStorage.getItem(name);
      } else {
        return sessionStorage.getItem(name);
      }
    },
    tolink() {
      // window.open("http://github.crmeb.net/u/CRMChat");
    },
  },
};
