import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    // 外部连接，跳转联系客服模块
    {
      path: "/",
      meta: {
        title: "联系客服",
      },
      component: () => import("@/views/externalConnection/index"),
    },
    {
      path: "/chat/index",
      name: "customerServerRedirect",
      meta: {
        title: "联系客服",
      },
      component: () => import("@/views/externalConnection/index"),
    },
    {
      path: "/chat/pc",
      name: "customerServerPc",
      meta: {
        title: "联系客服pc",
      },
      component: () => import("@/views/externalConnection/pcCustomerServer"),
    },
    {
      path: "/chat/mobile",
      name: "customerServerMobile",
      meta: {
        title: "联系客服mobile",
      },
      component: () =>
        import("@/views/externalConnection/mobileCustomerServer"),
    },
    {
      // 客服不在线。提交反馈
      path: "/chat/customerOutLine",
      name: "customerOutLine",
      meta: {
        title: "提交反馈",
      },
      component: () => import("@/views/externalConnection/customerOutLine"),
    },
    {
      // 完成提交反馈
      path: "/chat/finishSubmitOutLine",
      name: "finishSubmitOutLine",
      meta: {
        title: "提交成功",
      },
      component: () => import("@/views/externalConnection/finishSubmitOutLine"),
    },
    // 外部连接，跳转联系客服模块结束
  ],
});
