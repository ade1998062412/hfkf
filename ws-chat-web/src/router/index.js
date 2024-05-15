/**
 * @author https://vue-admin-beautiful.com （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/promoter/index',
    name: 'Promoterdata',
    component: () => import('@/views/promoterdata/index'),
    hidden: true,
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index1',
        component: () => import('@/views/guide'),
        meta: {
          title: '用户指南',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/customerServiceReport',
    component: Layout,
    redirect: 'noRedirect',
    name: 'customerServiceReport',
    meta: { title: '客服统计', icon: 'home' },
    children: [
      {
        path: 'customerServiceReport',
        name: 'customerServiceReport1',
        component: () => import('@/views/customerServiceReport/index'),
        meta: { title: '客服统计', icon: 'home' },
      },
    ],
  },
  {
    path: '/scoreLog',
    component: Layout,
    redirect: 'noRedirect',
    name: 'scoreLog',
    meta: { title: '积分明细', icon: 'marker' },
    children: [
      {
        path: 'scoreLog',
        name: 'scoreLog1',
        component: () => import('@/views/scoreLog/index'),
        meta: { title: '积分明细', icon: 'marker' },
      },
    ],
  },
  {
    path: '/viewsphoneNumber',
    component: Layout,
    redirect: 'noRedirect',
    name: 'viewsphoneNumber',
    meta: { title: '分配手机号管理', icon: 'marker' },
    children: [
      {
        path: 'viewsphoneNumber',
        name: 'viewsphoneNumber1',
        component: () => import('@/views/phoneNumber/index'),
        meta: { title: '分配手机号管理', icon: 'marker' },
      },
    ],
  },
  {
    path: '/customerServiceManagement',
    component: Layout,
    redirect: 'noRedirect',
    name: 'customerServiceManagement',
    meta: { title: '客服管理', icon: 'user-edit' },
    children: [
      {
        path: 'customerServiceManagement',
        name: 'customerServiceManagement1',
        component: () => import('@/views/customerServiceManagement/index.vue'),
        meta: { title: '客服管理', icon: 'user-edit' },
      },
    ],
  },
  {
    path: '/customerTask',
    component: Layout,
    redirect: 'noRedirect',
    name: 'customerTask',
    meta: { title: '群发管理', icon: 'users-cog' },
    children: [
      {
        path: 'customerTask',
        name: 'customerTask1',
        component: () => import('@/views/customerTask/index.vue'),
        meta: { title: '群发管理', icon: 'users-cog' },
      },
    ],
  },
  {
    path: '/webapp',
    component: Layout,
    redirect: 'noRedirect',
    name: 'webapp',
    meta: { title: 'web聊天应用', icon: 'apple-alt' },
    children: [
      {
        path: 'webapp',
        name: 'webapp1',
        component: () => import('@/views/webapp/index.vue'),
        meta: { title: 'web聊天应用', icon: 'apple-alt' },
      },
    ],
  },
  {
    path: '/promoter',
    component: Layout,
    redirect: 'noRedirect',
    name: 'promoter',
    meta: { title: '推广商管理', icon: 'users-cog' },
    children: [
      {
        path: 'promoter',
        name: 'promoter1',
        component: () => import('@/views/promoter/index.vue'),
        meta: { title: '推广商管理', icon: 'users-cog' },
      },
    ],
  },
  {
    path: '/sessionList',
    component: Layout,
    redirect: 'noRedirect',
    name: 'sessionList',
    meta: { title: '会话管理', icon: 'comment-dots' },
    children: [
      {
        path: 'sessionList',
        name: 'sessionList1',
        component: () => import('@/views/sessionList/index.vue'),
        meta: { title: '会话管理', icon: 'comment-dots' },
      },
    ],
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
