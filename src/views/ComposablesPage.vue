<template>
  <div>
    <h1 class="page-title">Composables — 可組合函數</h1>
    <p class="page-subtitle">Vue 3 推薦的邏輯複用模式，用函數封裝響應式狀態與行為，讓邏輯跨元件共享</p>

    <!-- 1. 什麼是 Composable -->
    <div class="card">
      <h2>1. 什麼是 Composable？</h2>
      <p class="desc">
        Composable 是一個以 <code>use</code> 開頭命名的函數，內部使用 Vue 的 Composition API，
        封裝並回傳響應式狀態與方法，讓多個元件可以<strong>共享邏輯</strong>而不重複程式碼。
      </p>
      <div class="compare-grid">
        <div class="comp-col bad">
          <div class="comp-label label-bad">❌ 沒有 Composable — 邏輯重複</div>
          <pre><code>// ComponentA.vue
data() { return { count: 0 } },
methods: {
  increment() { this.count++ },
  decrement() { this.count-- }
}

// ComponentB.vue — 一模一樣的程式碼！
data() { return { count: 0 } },
methods: {
  increment() { this.count++ },
  decrement() { this.count-- }
}</code></pre>
        </div>
        <div class="comp-col good">
          <div class="comp-label label-good">✅ 使用 Composable — 邏輯集中</div>
          <pre><code>// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}

// 任何元件都能用這一行搞定！
const { count, increment } = useCounter()</code></pre>
        </div>
      </div>
    </div>

    <!-- 2. useCounter 基礎範例 -->
    <div class="card">
      <h2>2. useCounter — 基礎範例 + Live Demo</h2>
      <div class="two-col">
        <div>
          <pre><code>// src/composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initial = 0, step = 1) {
  const count = ref(initial)

  const doubled  = computed(() => count.value * 2)
  const isNeg    = computed(() => count.value &lt; 0)

  function increment() { count.value += step }
  function decrement() { count.value -= step }
  function reset()     { count.value = initial }

  return { count, doubled, isNeg, increment, decrement, reset }
}

// ── 在元件中使用 ──
import { useCounter } from '@/composables/useCounter'

export default {
  setup() {
    const { count, doubled, increment, decrement, reset }
      = useCounter(0, 5)  // 起始值 0，步進 5

    return { count, doubled, increment, decrement, reset }
  }
}</code></pre>
        </div>
        <div class="demo-panel">
          <h4>Live Demo</h4>
          <div class="counter-display" :class="{ negative: cCount < 0 }">
            {{ cCount }}
          </div>
          <div class="counter-sub">doubled: {{ cCount * 2 }}</div>
          <div class="counter-btns">
            <button class="btn btn-danger" @click="cCount -= cStep">－ {{ cStep }}</button>
            <button class="btn btn-gray" @click="cCount = 0">重置</button>
            <button class="btn btn-green" @click="cCount += cStep">＋ {{ cStep }}</button>
          </div>
          <div class="step-ctrl">
            步進值：
            <button class="step-btn" @click="cStep = 1" :class="{ active: cStep === 1 }">1</button>
            <button class="step-btn" @click="cStep = 5" :class="{ active: cStep === 5 }">5</button>
            <button class="step-btn" @click="cStep = 10" :class="{ active: cStep === 10 }">10</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. useFetch 實用範例 -->
    <div class="card">
      <h2>3. useFetch — 封裝非同步請求</h2>
      <p class="desc">把「載入中 / 資料 / 錯誤」三種狀態封裝起來，讓元件只關心顯示邏輯</p>
      <pre><code>// src/composables/useFetch.js
import { ref } from 'vue'

export function useFetch(fetchFn) {
  const data    = ref(null)
  const loading = ref(false)
  const error   = ref(null)

  async function execute(...args) {
    loading.value = true
    error.value   = null
    try {
      data.value = await fetchFn(...args)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}

// ── 在元件中使用 ──
import { onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'

export default {
  setup() {
    const { data: users, loading, error, execute } = useFetch(
      () => fetch('/api/users').then(r => r.json())
    )

    onMounted(() => execute())  // 掛載時自動發請求

    return { users, loading, error, execute }
  }
}</code></pre>

      <div class="fetch-demo">
        <div class="fetch-header">
          <h4>模擬 useFetch Demo</h4>
          <button class="btn btn-blue" @click="simulateFetch" :disabled="fetchLoading">
            {{ fetchLoading ? '載入中...' : '發送請求' }}
          </button>
        </div>
        <div v-if="fetchLoading" class="fetch-loading">
          <span class="spinner"></span> 載入中...
        </div>
        <div v-else-if="fetchError" class="fetch-error">❌ 錯誤：{{ fetchError }}</div>
        <div v-else-if="fetchData" class="fetch-result">
          <div v-for="user in fetchData" :key="user.id" class="user-row">
            <span class="user-id">#{{ user.id }}</span>
            <span class="user-name">{{ user.name }}</span>
            <span class="user-role" :class="user.role">{{ user.role }}</span>
          </div>
        </div>
        <div v-else class="fetch-empty">點擊「發送請求」模擬 API 呼叫</div>
      </div>
    </div>

    <!-- 4. useLocalStorage -->
    <div class="card">
      <h2>4. useLocalStorage — 持久化狀態</h2>
      <p class="desc">把 localStorage 讀寫封裝成響應式資料，資料自動同步到瀏覽器本地儲存</p>
      <div class="two-col">
        <pre><code>// src/composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // 從 localStorage 讀取初始值
  const stored = localStorage.getItem(key)
  const data = ref(
    stored ? JSON.parse(stored) : defaultValue
  )

  // 監聽變化，自動同步到 localStorage
  watch(
    data,
    (newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal))
    },
    { deep: true }
  )

  function clear() {
    localStorage.removeItem(key)
    data.value = defaultValue
  }

  return { data, clear }
}

// ── 使用 ──
const { data: theme } = useLocalStorage('theme', 'dark')
const { data: cart }  = useLocalStorage('cart', [])
// 修改 theme.value / cart.value 時自動存入 localStorage</code></pre>

        <div class="ls-demo">
          <h4>Live Demo（實際寫入 localStorage）</h4>
          <div class="ls-row">
            <label>暱稱：</label>
            <input v-model="lsName" class="ls-input" placeholder="輸入暱稱..." />
          </div>
          <div class="ls-row">
            <label>主題：</label>
            <select v-model="lsTheme" class="ls-input">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="blue">Blue</option>
            </select>
          </div>
          <div class="ls-stored">
            <small>localStorage 中的值：</small>
            <code>{{ lsPreview }}</code>
          </div>
          <button class="btn btn-danger" style="margin-top: 8px; font-size: 13px;" @click="clearLS">清除</button>
        </div>
      </div>
    </div>

    <!-- 5. 最佳實踐 -->
    <div class="card">
      <h2>5. Composable 最佳實踐</h2>
      <div class="tips-grid">
        <div v-for="tip in tips" :key="tip.title" class="tip-item" :class="tip.color">
          <div class="tip-icon">{{ tip.icon }}</div>
          <div>
            <strong>{{ tip.title }}</strong>
            <p>{{ tip.desc }}</p>
            <pre v-if="tip.code"><code>{{ tip.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComposablesPage',
  data() {
    return {
      cCount: 0,
      cStep: 1,
      fetchLoading: false,
      fetchData: null,
      fetchError: null,
      lsName: localStorage.getItem('demo_name') || '',
      lsTheme: localStorage.getItem('demo_theme') || 'dark',
      tips: [
        {
          icon: '📁', color: 'tip-blue', title: '以 use 開頭命名',
          desc: '這是社群約定，讓人一眼知道這是 Composable',
          code: '// ✅ useCounter, useFetch, useAuth\n// ❌ counter, fetchData, auth'
        },
        {
          icon: '↩️', color: 'tip-green', title: '回傳響應式 ref，而非原始值',
          desc: '確保解構後仍保持響應性',
          code: '// ✅ 回傳 ref\nreturn { count }  // ref\n// ❌ 回傳原始值\nreturn { count: count.value }'
        },
        {
          icon: '🧹', color: 'tip-yellow', title: '在 onUnmounted 清理副作用',
          desc: '計時器、事件監聽等需要在元件銷毀時清除',
          code: 'onMounted(() => {\n  window.addEventListener(\'resize\', fn)\n})\nonUnmounted(() => {\n  window.removeEventListener(\'resize\', fn)\n})'
        },
        {
          icon: '🔧', color: 'tip-purple', title: '接受 ref 或原始值作為參數',
          desc: '用 toValue()（Vue 3.3+）或 isRef() 讓 Composable 更靈活',
          code: 'import { toValue } from \'vue\'\nfunction useDouble(x) {\n  return computed(() => toValue(x) * 2)\n  // 不管 x 是 ref(5) 還是 5 都能用\n}'
        }
      ]
    }
  },
  computed: {
    lsPreview() {
      return JSON.stringify({ demo_name: this.lsName, demo_theme: this.lsTheme })
    }
  },
  watch: {
    lsName(v) { localStorage.setItem('demo_name', v) },
    lsTheme(v) { localStorage.setItem('demo_theme', v) }
  },
  methods: {
    async simulateFetch() {
      this.fetchLoading = true
      this.fetchData = null
      this.fetchError = null
      await new Promise(r => setTimeout(r, 1200))
      if (Math.random() < 0.2) {
        this.fetchError = 'Network Error (20% 機率模擬失敗)'
      } else {
        this.fetchData = [
          { id: 1, name: 'Alice Chen', role: 'admin' },
          { id: 2, name: 'Bob Wang',   role: 'user' },
          { id: 3, name: 'Carol Lin',  role: 'user' },
        ]
      }
      this.fetchLoading = false
    },
    clearLS() {
      localStorage.removeItem('demo_name')
      localStorage.removeItem('demo_theme')
      this.lsName = ''
      this.lsTheme = 'dark'
    }
  }
}
</script>

<style scoped>
.desc { color: #94a3b8; margin-bottom: 1rem; font-size: 14px; }
.desc strong { color: #e2e8f0; }
code { background: #2d3548; color: #42b983; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
pre {
  background: #141926;
  color: #c9d1d9;
  padding: 12px 14px;
  border-radius: 6px;
  overflow-x: auto;
  border: 1px solid #2d3548;
  font-size: 13px;
  line-height: 1.6;
}
pre code { background: none; color: inherit; padding: 0; font-size: inherit; }

.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
.comp-col { border-radius: 8px; padding: 1rem; }
.bad  { background: #1e1520; border: 1px solid #5a2d2e; }
.good { background: #1a3a2e; border: 1px solid #2d6a4f; }
.comp-label { font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.label-bad  { color: #f87171; }
.label-good { color: #42b983; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }

.demo-panel {
  background: #141926;
  border: 1px solid #2d3548;
  border-radius: 8px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.demo-panel h4 { color: #42b983; margin: 0; font-size: 13px; }
.counter-display {
  font-size: 48px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: monospace;
  transition: color 0.3s;
}
.counter-display.negative { color: #f87171; }
.counter-sub { font-size: 13px; color: #6e7a9a; }
.counter-btns { display: flex; gap: 8px; }
.step-ctrl { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6e7a9a; }
.step-btn {
  padding: 3px 10px;
  background: #252c3b;
  border: 1px solid #2d3548;
  border-radius: 4px;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 13px;
}
.step-btn.active { background: #42b983; color: #fff; border-color: #42b983; }
.btn { padding: 6px 14px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 13px; }
.btn:hover { opacity: 0.85; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-green  { background: #42b983; color: #fff; }
.btn-blue   { background: #3b82f6; color: #fff; }
.btn-danger { background: #e05252; color: #fff; }
.btn-gray   { background: #4a5568; color: #fff; }

.fetch-demo {
  margin-top: 1rem;
  background: #141926;
  border: 1px solid #2d3548;
  border-radius: 8px;
  padding: 1rem;
}
.fetch-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.fetch-header h4 { margin: 0; color: #42b983; font-size: 13px; }
.fetch-loading { color: #94a3b8; font-size: 14px; display: flex; align-items: center; gap: 8px; }
.spinner {
  display: inline-block;
  width: 14px; height: 14px;
  border: 2px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.fetch-error { color: #f87171; font-size: 14px; }
.fetch-empty { color: #4a5568; font-size: 13px; font-style: italic; }
.user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  background: #1e2432;
  margin-bottom: 4px;
}
.user-id   { color: #4a5568; font-size: 12px; width: 28px; }
.user-name { color: #e2e8f0; flex: 1; font-size: 14px; }
.user-role { padding: 1px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.admin { background: #2a2510; color: #fbbf24; }
.user  { background: #1e2f45; color: #60a5fa; }

.ls-demo { background: #141926; border: 1px solid #2d3548; border-radius: 8px; padding: 1rem; }
.ls-demo h4 { color: #42b983; margin: 0 0 12px; font-size: 13px; }
.ls-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.ls-row label { color: #6e7a9a; font-size: 13px; width: 44px; }
.ls-input {
  flex: 1;
  background: #252c3b;
  border: 1px solid #2d3548;
  border-radius: 4px;
  color: #e2e8f0;
  padding: 5px 10px;
  font-size: 13px;
}
.ls-stored { margin-top: 8px; }
.ls-stored small { color: #4a5568; font-size: 11px; display: block; margin-bottom: 4px; }
.ls-stored code { font-size: 11px; word-break: break-all; display: block; }

.tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.tip-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
  border-left: 3px solid transparent;
}
.tip-icon { font-size: 22px; flex-shrink: 0; }
.tip-item strong { display: block; color: #e2e8f0; margin-bottom: 4px; font-size: 14px; }
.tip-item p { font-size: 13px; color: #94a3b8; margin: 0 0 8px; }
.tip-blue   { background: #1e2f45; border-color: #3b82f6; }
.tip-green  { background: #1a3a2e; border-color: #42b983; }
.tip-yellow { background: #2a2510; border-color: #f39c12; }
.tip-purple { background: #251a35; border-color: #a855f7; }
</style>
