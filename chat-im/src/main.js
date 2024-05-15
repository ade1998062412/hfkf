import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'view-design/dist/styles/iview.css'
import './index.less'
import './styles/index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfontYI/iconfontYI.css'
import 'vue-happy-scroll/docs/happy-scroll.css'
import i18n from '@/locale'
// 懒加载
import VueLazyload from 'vue-lazyload'
//日期
import moment from 'moment'
Vue.prototype.$moment = moment
moment.locale('zh-cn')
Vue.prototype.bus = new Vue();
Vue.config.productionTip = false
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/images/no.png'),
  loading: require('./assets/images/moren.jpg'),
  attempt: 1,
  listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
});
new Vue({
  router,
  store,
  i18n,
  render: function (h) { return h(App) }
}).$mount('#app')
