import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'
import LemonIMUI from 'lemon-imui'
import 'lemon-imui/dist/index.css'
import lemonMessageImage from '/src/components/UploadImage/image.vue'
import lemonMessageText from '/src/components/UploadImage/text.vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

/**
 * @author https://vue-admin-beautiful.com （不想保留author可删除）
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('@/utils/static')
//   mockXHR()
// }

Vue.config.productionTip = false

Vue.use(LemonIMUI)

Vue.component(lemonMessageImage.name, lemonMessageImage)
Vue.component(lemonMessageText.name, lemonMessageText)

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
  },
})
new Vue({
  el: '#vue-admin-beautiful',
  router,
  store,
  render: (h) => h(App),
})
