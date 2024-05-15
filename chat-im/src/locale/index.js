import Vue from "vue";
import VueI18n from "vue-i18n";
import { localRead,localSave } from "@/utils/util";
import customZhCn from "./lang/zh-CN";//中文
import customEnUs from "./lang/en-US";//英语
import customRuRu from "./lang/ru-RU";//俄罗斯语
import customPtPt from "./lang/pt-PT"; //葡萄牙语
import customSpAn from "./lang/sp-AN"; //西班牙语
import customViVn from "./lang/vi-VN"; //越南语
import customKoKr from "./lang/ko-KR"; //越南语
import zhCnLocale from "iview/src/locale/lang/zh-CN";
import enUsLocale from "iview/src/locale/lang/en-US";
import ruRuLocale from "iview/src/locale/lang/ru-RU";
import ptPtLocale from "iview/src/locale/lang/pt-PT";
import svSeLocale from "iview/src/locale/lang/sv-SE";
import viVnLocale from "iview/src/locale/lang/vi-VN";
import koKrLocale from "iview/src/locale/lang/ko-KR";

Vue.use(VueI18n);
let url = "";
if (location.hash.indexOf("?") != -1) {
  url = location.hash.split("?")[1];
}
let item = new URLSearchParams(url);
for (let p of item) {
  if(p[0]=='lang'){
    localSave('lang',p[1])
  }
}
// 自动根据浏览器系统语言设置语言
const navLang = navigator.language;
const localLang = navLang === "zh-CN" || navLang === "en-US" ? navLang : false;
let lang = localRead("lang") || localLang || "en-US";

Vue.config.lang = lang;

// vue-i18n 6.x+写法
Vue.locale = () => {};
const messages = {
  "zh-CN": Object.assign(zhCnLocale, customZhCn),
  "en-US": Object.assign(enUsLocale, customEnUs),
  "ru-RU": Object.assign(ruRuLocale, customRuRu),
  "pt-PT": Object.assign(ptPtLocale, customPtPt),
  "sp-AN": Object.assign(svSeLocale, customSpAn),
  "vi-VN": Object.assign(viVnLocale, customViVn),
  "ko-KR": Object.assign(koKrLocale, customKoKr),
};
const i18n = new VueI18n({
  locale: lang,
  messages,
});

export default i18n;

// vue-i18n 5.x写法
// Vue.locale('zh-CN', Object.assign(zhCnLocale, customZhCn))
// Vue.locale('en-US', Object.assign(zhTwLocale, customZhTw))
// Vue.locale('zh-TW', Object.assign(enUsLocale, customEnUs))
