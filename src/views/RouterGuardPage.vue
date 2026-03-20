<template>
  <div>
    <h1 class="page-title">Vue Router 守衛 + 權限設計</h1>
    <p class="page-subtitle">掌握路由守衛的執行順序與實際權限控制方案</p>

    <!-- 1. 守衛種類 -->
    <div class="card">
      <h2>1. 路由守衛三大類型</h2>
      <div class="guard-types">
        <div class="guard-type gt-global">
          <h3>全域守衛（Global）</h3>
          <p>在 router 實例上定義，每次路由切換都會執行</p>
          <div class="guard-list">
            <div class="guard-item">
              <code>router.beforeEach</code>
              <span class="tag tag-blue">前置</span>
              <small>最常用，用於登入驗證、權限檢查</small>
            </div>
            <div class="guard-item">
              <code>router.beforeResolve</code>
              <span class="tag tag-yellow">解析</span>
              <small>在所有元件守衛和非同步元件解析後觸發</small>
            </div>
            <div class="guard-item">
              <code>router.afterEach</code>
              <span class="tag tag-green">後置</span>
              <small>無法呼叫 next()，常用於頁面統計、滾動重置</small>
            </div>
          </div>
        </div>

        <div class="guard-type gt-route">
          <h3>路由獨享守衛（Per-Route）</h3>
          <p>在路由設定物件上定義 <code>beforeEnter</code></p>
          <pre>const routes = [
  {
    path: '/admin',
    component: AdminPage,
    beforeEnter(to, from, next) {
      // 只有進入 /admin 時觸發
      if (!store.getters.isAdmin) {
        next('/')
      } else {
        next()
      }
    }
  }
]</pre>
        </div>

        <div class="guard-type gt-component">
          <h3>元件內守衛（In-Component）</h3>
          <p>在 Vue 元件選項中定義</p>
          <pre>export default {
  // 進入元件前（此時 this 不可用，因元件尚未建立）
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 透過 next 的回呼函式存取 vm 實例
      vm.fetchData()
    })
  },

  // 路由更新（同元件，不同參數，如 /user/1 → /user/2）
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.params.id)
    next()
  },

  // 離開元件前（可用於表單未儲存警告）
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('有未儲存的變更，確定離開？')
      confirmed ? next() : next(false)
    } else {
      next()
    }
  }
}</pre>
        </div>
      </div>
    </div>

    <!-- 2. 執行順序 -->
    <div class="card">
      <h2>2. 守衛執行完整順序</h2>
      <div class="execution-flow">
        <div
          v-for="(step, i) in executionSteps"
          :key="i"
          class="exec-step"
          :class="`step-${step.type}`"
        >
          <span class="step-num">{{ i + 1 }}</span>
          <div class="step-content">
            <strong>{{ step.name }}</strong>
            <small>{{ step.desc }}</small>
          </div>
          <span class="step-badge" :class="`badge-${step.type}`">{{ step.type }}</span>
        </div>
      </div>
    </div>

    <!-- 3. next() 用法 -->
    <div class="card">
      <h2>3. next() 參數用法</h2>
      <div class="next-grid">
        <div class="next-item">
          <code>next()</code>
          <p>允許通過，繼續下一個守衛</p>
        </div>
        <div class="next-item">
          <code>next(false)</code>
          <p>中止導航，留在當前頁面</p>
        </div>
        <div class="next-item">
          <code>next('/login')</code>
          <p>重定向到指定路徑</p>
        </div>
        <div class="next-item">
          <code>next({ name: 'Login', query: { redirect: to.fullPath } })</code>
          <p>重定向並帶參數（登入後跳回原頁）</p>
        </div>
        <div class="next-item next-error">
          <code>next(new Error('未授權'))</code>
          <p>傳入 Error，導航中止並觸發 router.onError</p>
        </div>
      </div>
    </div>

    <!-- 4. 權限設計 -->
    <div class="card">
      <h2>4. 實際權限設計方案</h2>

      <h3>方案一：Meta 標記 + beforeEach（本專案採用）</h3>
      <pre>// router/index.js
const routes = [
  {
    path: '/admin',
    meta: {
      requiresAuth: true,   // 需要登入
      requiresAdmin: true   // 需要 admin 角色
    }
  }
]

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const isAdmin = store.getters.isAdmin

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 儲存原本要去的路徑，登入後跳回
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Home' }) // 權限不足
    return
  }

  next()
})</pre>

      <h3>方案二：動態路由（後端控制選單）</h3>
      <pre>// 登入後，根據角色從後端取得可訪問的路由
async function loadDynamicRoutes(role) {
  const accessibleRoutes = await api.getRoutesByRole(role)
  accessibleRoutes.forEach(route => {
    router.addRoute(route)  // Vue Router 3 動態新增
  })
}

// 搭配 beforeEach 做 NProgress 進度條
import NProgress from 'nprogress'
router.beforeEach((to, from, next) => {
  NProgress.start()
  // ... 驗證邏輯
  next()
})
router.afterEach(() => {
  NProgress.done()
})</pre>

      <h3>方案三：路由白名單（不需登入的頁面）</h3>
      <pre>const whiteList = ['/login', '/register', '/404']

router.beforeEach((to, from, next) => {
  if (whiteList.includes(to.path)) {
    next()  // 白名單直接放行
    return
  }
  // 其他頁面都需要登入
  if (!store.getters.isAuthenticated) {
    next(`/login?redirect=${to.path}`)
  } else {
    next()
  }
})</pre>
    </div>

    <!-- 5. 互動示範 -->
    <div class="card">
      <h2>5. 互動示範：登入 / 權限測試</h2>
      <div class="auth-status">
        <div class="status-row">
          <span>登入狀態：</span>
          <span :class="isAuthenticated ? 'tag tag-green' : 'tag tag-red'">
            {{ isAuthenticated ? `已登入（${username}）` : '未登入' }}
          </span>
        </div>
        <div class="status-row">
          <span>角色：</span>
          <span class="tag tag-blue">{{ role }}</span>
        </div>
      </div>

      <div v-if="!isAuthenticated" class="login-form">
        <h3>登入測試帳號</h3>
        <div class="account-hint">
          <div class="hint-item">
            帳號 <code>admin</code> / 密碼 <code>admin</code> → role: admin（可進入 /admin）
          </div>
          <div class="hint-item">
            帳號 <code>user</code> / 密碼 <code>user</code> → role: user（無法進入 /admin）
          </div>
        </div>
        <div class="form-row">
          <input v-model="loginForm.username" placeholder="帳號" class="input" />
          <input v-model="loginForm.password" type="password" placeholder="密碼" class="input" />
          <button class="btn btn-primary" @click="handleLogin" :disabled="loginLoading">
            {{ loginLoading ? '登入中...' : '登入' }}
          </button>
        </div>
        <p v-if="loginError" class="error-msg">{{ loginError }}</p>
      </div>

      <div v-else class="nav-test">
        <h3>路由跳轉測試</h3>
        <div class="test-buttons">
          <button class="btn btn-info" @click="goTo('/admin')">前往 /admin（需 admin 角色）</button>
          <button class="btn btn-danger" @click="handleLogout">登出</button>
        </div>
        <p v-if="navMessage" class="nav-msg">{{ navMessage }}</p>
      </div>

      <!-- 離開守衛示範 -->
      <h3 style="margin-top: 16px;">beforeRouteLeave 示範</h3>
      <div class="leave-demo">
        <label>
          <input type="checkbox" v-model="hasForm" />
          模擬有未儲存的表單
        </label>
        <p class="hint">勾選後，切換到其他頁面時會跳出確認對話框</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RouterGuardPage',
  data() {
    return {
      loginForm: { username: '', password: '' },
      loginLoading: false,
      loginError: '',
      navMessage: '',
      hasForm: false,
      executionSteps: [
        { name: 'router.beforeEach', desc: '全域前置守衛，最先執行', type: 'global' },
        { name: 'route.beforeEnter', desc: '路由獨享守衛', type: 'route' },
        { name: 'beforeRouteEnter', desc: '元件內守衛（新元件）', type: 'component' },
        { name: 'router.beforeResolve', desc: '全域解析守衛，等非同步元件都解析後', type: 'global' },
        { name: '導航確認（DOM 更新）', desc: 'Vue 更新視圖', type: 'update' },
        { name: 'beforeRouteEnter next(vm=>{})', desc: '可存取 vm 實例的回呼', type: 'component' },
        { name: 'router.afterEach', desc: '全域後置鉤子，無法呼叫 next()', type: 'global' }
      ]
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin']),
    username() {
      return this.$store.state.user ? this.$store.state.user.username : ''
    },
    role() {
      return this.$store.state.role
    }
  },
  methods: {
    ...mapActions(['login', 'logout']),
    async handleLogin() {
      this.loginLoading = true
      this.loginError = ''
      const result = await this.login(this.loginForm)
      this.loginLoading = false
      if (!result.success) {
        this.loginError = result.message
      }
    },
    handleLogout() {
      this.logout()
    },
    goTo(path) {
      this.$router.push(path).catch(err => {
        // 被守衛攔截時顯示訊息
        if (err && err.name !== 'NavigationDuplicated') {
          this.navMessage = `⚠️ 被守衛攔截！無法前往 ${path}（權限不足）`
        }
      })
    }
  },
  // ─────────────────────────────────────────────
  // 元件內守衛示範
  // ─────────────────────────────────────────────
  beforeRouteLeave(to, from, next) {
    if (this.hasForm) {
      const confirmed = window.confirm('你有未儲存的表單，確定要離開嗎？')
      if (confirmed) {
        next()
      } else {
        next(false) // 取消導航
      }
    } else {
      next()
    }
  }
}
</script>

<style scoped>
.guard-types { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; gap: 16px; }
.guard-type { border-radius: 8px; padding: 16px; }
.gt-global    { background: #1a2535; border-left: 4px solid #3498db; }
.gt-route     { background: #2a2010; border-left: 4px solid #f39c12; }
.gt-component { background: #1a2e1a; border-left: 4px solid #2ecc71; }
.guard-list { margin-top: 8px; }
.guard-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.guard-item small { color: #6e7a9a; font-size: 12px; }

.execution-flow { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; gap: 8px; }
.exec-step {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 6px;
  background: #252c3b;
  border-left: 3px solid #2d3548;
}
.step-global    { border-color: #3498db; background: #1a2535; }
.step-route     { border-color: #f39c12; background: #2a2010; }
.step-component { border-color: #2ecc71; background: #1a2e1a; }
.step-update    { border-color: #9b59b6; background: #251a35; }
.step-num {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #42b983;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 12px;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.step-content { -webkit-box-flex: 1; -ms-flex: 1; flex: 1; }
.step-content strong { display: block; font-family: monospace; color: #e2e8f0; }
.step-content small { color: #6e7a9a; font-size: 12px; }
.step-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.badge-global    { background: #1a2535; color: #60a5fa; }
.badge-route     { background: #2a2010; color: #fbbf24; }
.badge-component { background: #1a2e1a; color: #4ade80; }
.badge-update    { background: #251a35; color: #c084fc; }

.next-grid { display: -ms-grid; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.next-item {
  background: #252c3b;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #2d3548;
}
.next-item code { display: block; font-size: 12px; margin-bottom: 6px; color: #f87171; word-break: break-all; }
.next-item p { font-size: 13px; color: #6e7a9a; }
.next-error { background: #2a1f20; border-color: #5a2d2e; }

.auth-status { background: #252c3b; border: 1px solid #2d3548; border-radius: 6px; padding: 12px; margin-bottom: 16px; }
.status-row { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; gap: 8px; margin: 4px 0; }
.login-form { margin-top: 12px; }
.account-hint { background: #2a2510; border: 1px solid #3a3010; border-radius: 6px; padding: 10px; margin-bottom: 12px; }
.hint-item { font-size: 13px; margin: 3px 0; }
.form-row { display: -webkit-box; display: -ms-flexbox; display: flex; gap: 8px; -ms-flex-wrap: wrap; flex-wrap: wrap; margin-top: 8px; }
.input { padding: 8px 12px; border: 1px solid #2d3548; border-radius: 4px; font-size: 14px; background: #252c3b; color: #c9d1d9; }
.error-msg { color: #f87171; margin-top: 8px; font-size: 13px; }
.nav-test { margin-top: 12px; }
.test-buttons { display: -webkit-box; display: -ms-flexbox; display: flex; gap: 8px; -ms-flex-wrap: wrap; flex-wrap: wrap; margin-top: 8px; }
.nav-msg { margin-top: 8px; font-size: 13px; color: #fbbf24; }
.leave-demo { background: #2a2510; border: 1px solid #3a3010; border-radius: 6px; padding: 12px; }
.leave-demo label { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; gap: 8px; cursor: pointer; }
.hint { color: #6e7a9a; font-size: 12px; margin-top: 4px; }
</style>
