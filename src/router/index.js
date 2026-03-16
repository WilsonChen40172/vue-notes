import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import ReactivityPage from '@/views/ReactivityPage.vue'
import VuexPage from '@/views/VuexPage.vue'
import RouterGuardPage from '@/views/RouterGuardPage.vue'
import IE11Page from '@/views/IE11Page.vue'
import LoginPage from '@/views/LoginPage.vue'
import AdminPage from '@/views/AdminPage.vue'
import NotFound from '@/views/NotFound.vue'
import CICDPage from '@/views/CICDPage.vue'

Vue.use(VueRouter)

// ─────────────────────────────────────────────
// 路由設定
// meta.requiresAuth  = 需要登入才能訪問
// meta.requiresAdmin = 需要 admin 角色
// meta.title         = 頁面標題
// ─────────────────────────────────────────────
const routes = [
    {
        path: '/',
        redirect: '/reactivity'
    },
    {
        path: '/reactivity',
        name: 'Reactivity',
        component: ReactivityPage,
        meta: { title: 'Vue 2 響應式原理' }
    },
    {
        path: '/vuex',
        name: 'Vuex',
        component: VuexPage,
        meta: { title: 'Vuex 核心概念' }
    },
    {
        path: '/router-guard',
        name: 'RouterGuard',
        component: RouterGuardPage,
        meta: { title: 'Vue Router 守衛 & 權限' }
    },
    {
        path: '/ie11',
        name: 'IE11',
        component: IE11Page,
        meta: { title: 'IE11 相容處理' }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { title: '登入' }
    },
    {
        // 模擬需要登入 + admin 才能訪問的頁面
        path: '/admin',
        name: 'Admin',
        component: AdminPage,
        meta: {
            title: '管理後台',
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/cicd',
        name: 'CICD',
        component: CICDPage,
        meta: { title: 'CI/CD 前端知識' }
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound,
        meta: { title: '404 找不到頁面' }
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

// ─────────────────────────────────────────────
// 全域前置守衛（Global Before Guard）
// 每次路由跳轉前都會執行
// 執行順序：beforeEach → beforeEnter → beforeRouteEnter → afterEach
// ─────────────────────────────────────────────
router.beforeEach((to, from, next) => {
    // 1. 設定頁面標題
    document.title = to.meta.title ? `${to.meta.title} | Vue2 學習` : 'Vue2 學習'

    const isAuthenticated = store.getters.isAuthenticated
    const isAdmin = store.getters.isAdmin

    // 2. 需要登入驗證的路由
    if (to.meta.requiresAuth && !isAuthenticated) {
        // 儲存原本要去的路徑，登入後可跳回
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
    }

    // 3. 需要 admin 角色的路由
    if (to.meta.requiresAdmin && !isAdmin) {
        // 已登入但權限不足，導向首頁
        next({ name: 'Reactivity' })
        return
    }

    next()
})

// ─────────────────────────────────────────────
// 全域後置鉤子（Global After Hook）
// 不能呼叫 next()，常用於統計、滾動還原
// ─────────────────────────────────────────────
router.afterEach((to, from) => {
    // 頁面跳轉後滾回頂部
    window.scrollTo(0, 0)
})

export default router
