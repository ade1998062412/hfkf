import { wss } from "@/utils/util";
import { netWorkPing } from "@/api/kefu";
import Setting from "@/setting";
import Cookies from "js-cookie";
import Vue from "vue";

let reconneTimer = {};
let reconneCount = {};
let connectGuid = {};
let NetWork = null;

class wsSocket {
  constructor(opt) {
    this.vm = new Vue();
    this.ws = null;
    this.opt = opt || {};
    this.networkStatus = true;
    this.reconneMax = 100;
    this.connectLing = false;
    reconneTimer[this.opt.key] = null;
    reconneCount[this.opt.key] = 0;
    this.init(opt);
    this.networkWath();
    this.defaultEvenv();
  }

  defaultEvenv() {
    this.vm.$on("timeout", this.timeoutEvent.bind(this));
  }

  timeoutEvent() {
    this.reconne();
  }

  guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  addHandler(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  }

  networkStatusFn(onlineFun, offlineFun) {
    this.addHandler(window, "online", () => {
      onlineFun();
    });
    this.addHandler(window, "offline", () => {
      offlineFun();
    });
  }

  networkStatusFnv2(onlineFun, offlineFun) {
    if (NetWork) {
      clearInterval(NetWork);
      NetWork = null;
    }
    let online = null,
      offline = null;
    NetWork = setInterval(() => {
      netWorkPing()
        .then((res) => {
          if (online === null) {
            onlineFun();
            online = true;
          }
          offline = null;
        })
        .catch(() => {
          if (offline === null) {
            offlineFun();
            offline = true;
          }
          online = null;
        });
    }, 1000);
  }

  networkWath() {
    this.networkStatusFn(
      () => {
        this.networkStatus = true;
        console.log("联网了");
        this.vm.$on("timeout", this.timeoutEvent);
      },
      () => {
        this.networkStatus = false;
        this.socketStatus = false;
        this.timer && clearInterval(this.timer);
        this.timer = null;
        this.ws.close();
        console.log("断网了");
      }
    );
  }

  reconne() {
    if (reconneCount[this.opt.key] > this.reconneMax) {
      //重连次数超过限制不再重连
      if (reconneTimer[this.opt.key]) {
        clearInterval(reconneTimer[this.opt.key]);
      }
      return;
    }
    if (reconneTimer[this.opt.key] || this.socketStatus) {
      return;
    }
    reconneTimer[this.opt.key] = setInterval(() => {
      //断线连接中发现状态为真就不用再连接
      if (this.socketStatus) {
        return;
      }
      //正在连接中也不需要在连接了
      if (!this.connectLing) {
        console.log("重新连接");
        this.init(this.opt);
        reconneCount[this.opt.key]++;
      }
    }, 2000);
  }

  onOpen(key = false) {
    //关闭断线重连定时器
    clearInterval(reconneTimer[this.opt.key]);
    reconneTimer[this.opt.key] = null;

    this.connectLing = false;
    this.opt.open && this.opt.open();
    reconneCount[this.opt.key] = 0;
    this.socketStatus = true;
    this.ping();
  }

  init(opt) {
    if (this.socketStatus) {
      return;
    }
    let wsUrl = ''
    // wss://wschat.micome.vip/ws?uuid=35cde606-1bc8-11ee-b861-0242ac120006&name=昵称&phone=手机号&uid=100
    // let hostUrl = wss(Setting.wsSocketUrl);
    let hostUrl = Setting.wsSocketUrl;

    wsUrl = hostUrl + "/ws?";
    if (opt.key == 1) {
      wsUrl = hostUrl + "?type=admin" + "&token=" + util.cookies.get("token");
    }
    if (opt.key == 2) {
      wsUrl =
        hostUrl + `?type=kefu` + "&token=" + `${Cookies.get("kefu_token")}`;
    }
    if (opt.key == 3) {
      let url = "";
      if (location.hash.indexOf("?") != -1) {
        url = location.hash.split("?")[1];
      }
      let item = new URLSearchParams(url);
      for (let p of item) {
        wsUrl += `&${p[0]}=${p[1]}`;
      }
    }
    if (wsUrl) {
      this.connectLing = true;
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onerror = this.onError.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
    }
  }

  ping() {
    var that = this;
    this.timer = setInterval(() => {
      let data = {
        cmd: "ping",
        data: "heartbeat",
        ext: { test: "123123" },
      };
      that.send(data);
    }, 30000);
  }

  send(data) {
    if (!this.socketStatus || this.ws.readyState === 0 || !this.networkStatus) {
      this.reconne();
    }
    return new Promise((resolve, reject) => {
      try {
        this.ws.send(JSON.stringify(data));
        resolve({ status: true });
      } catch (e) {
        reject({
          status: false,
          socketStatus: this.socketStatus,
          networkStatus: this.networkStatus,
        });
      }
    });
  }

  onMessage(res) {
    this.opt.message && this.opt.message(res);
  }

  onClose() {
    this.connectLing = false;
    this.timer && clearInterval(this.timer);
    this.timer = null;
    this.opt.close && this.opt.close();
    this.socketStatus = false;
    this.reconne();
  }

  onError(e) {
    this.connectLing = false;
    this.timer && clearInterval(this.timer);
    this.timer = null;
    this.opt.error && this.opt.error(e);
    this.socketStatus = false;
    this.reconne();
  }

  $on(...args) {
    this.vm.$on(...args);
  }

  $off(...args) {
    this.vm.$off(...args);
  }
}

let promises = {};

function createSocket(key, flag, token, tourist_uid, type, form) {
  if (flag) promises[key] = null;
  if (!promises[key])
    promises[key] = new Promise((resolve, reject) => {
      const ws = new wsSocket({
        key,
        token,
        tourist_uid,
        type,
        form,
        open() {
          resolve(ws);
        },
        error(e) {
          reject(e);
        },
        message(res) {
          let data = JSON.parse(res.data);
          ws.vm.$emit("message", data);
        },
        close(e) {
          ws.vm.$emit("close", e);
        },
      });
    });

  return promises[key];
}

export const adminSocket = (flag, token) => createSocket(1, flag, token);
export const Socket = (flag, token, tourist_uid, type) =>
  createSocket(2, flag, token, tourist_uid, type);
export const mobileScoket = (flag, token, form, tourist_uid, type) =>
  createSocket(3, flag, token, tourist_uid, type, form);
