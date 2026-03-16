<template>
  <div>
    <h1 class="page-title">Vuex：state / mutations / actions / getters 分工</h1>
    <p class="page-subtitle">了解 Vuex 單向資料流架構，以及各角色的職責邊界</p>

    <!-- 1. 架構圖 -->
    <div class="card">
      <h2>1. Vuex 資料流架構</h2>
      <div class="architecture">
        <div class="arch-block arch-component">
          <div class="arch-title">Vue Component</div>
          <div class="arch-desc">呼叫 dispatch / commit<br>透過 computed 讀取 state/getters</div>
        </div>
        <div class="arch-arrows">
          <div class="arrow-row">
            <span class="arrow-label">dispatch(action)</span>
            <span class="arrow">→</span>
          </div>
          <div class="arrow-row reverse">
            <span class="arrow">←</span>
            <span class="arrow-label">state 變更觸發重渲染</span>
          </div>
        </div>
        <div class="arch-block arch-store">
          <div class="arch-title">Vuex Store</div>
          <div class="store-parts">
            <div class="store-part part-actions">
              <strong>Actions</strong>
              <small>非同步邏輯</small>
              <small>→ commit mutation</small>
            </div>
            <div class="store-part part-mutations">
              <strong>Mutations</strong>
              <small>唯一修改 state</small>
              <small>必須同步</small>
            </div>
            <div class="store-part part-state">
              <strong>State</strong>
              <small>唯一資料來源</small>
            </div>
            <div class="store-part part-getters">
              <strong>Getters</strong>
              <small>衍生資料快取</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 四大角色說明 -->
    <div class="card">
      <h2>2. 各角色職責說明</h2>
      <div class="role-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- State -->
      <div v-if="activeTab === 'state'" class="tab-content">
        <div class="role-header role-state">
          <h3>State — 唯一資料來源（Single Source of Truth）</h3>
        </div>
        <ul class="role-rules">
          <li>✅ 所有需要跨元件共享的資料都放這裡</li>
          <li>✅ 元件透過 <code>computed + mapState</code> 讀取</li>
          <li>❌ 不能在元件或 action 中直接修改（strict 模式會拋出錯誤）</li>
          <li>❌ 只應存放「需要響應式追蹤」的資料，避免放大量靜態配置</li>
        </ul>
        <pre>// store/index.js
const state = {
  user: null,
  count: 0,
  todos: []
}

// 元件中使用
import { mapState } from 'vuex'
computed: {
  ...mapState(['count', 'user']),
  // 或帶別名：
  ...mapState({ myCount: 'count' })
}</pre>
      </div>

      <!-- Mutations -->
      <div v-if="activeTab === 'mutations'" class="tab-content">
        <div class="role-header role-mutations">
          <h3>Mutations — 唯一能同步修改 state 的地方</h3>
        </div>
        <ul class="role-rules">
          <li>✅ 必須是<strong>同步函式</strong> — DevTools 才能快照前後狀態</li>
          <li>✅ 命名慣例使用全大寫 + 底線（如 <code>SET_USER</code>）</li>
          <li>✅ 接收 payload 傳入資料</li>
          <li>❌ 不能有非同步操作（setTimeout、API 呼叫等）</li>
          <li>❌ 不能呼叫其他 mutation（避免狀態難以追蹤）</li>
        </ul>
        <pre>// 定義
const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  INCREMENT(state, amount = 1) {
    state.count += amount
  }
}

// 元件中使用
import { mapMutations } from 'vuex'
methods: {
  ...mapMutations(['INCREMENT']),
  // 或手動呼叫：
  this.$store.commit('SET_USER', { name: 'Alice' })
}</pre>
      </div>

      <!-- Actions -->
      <div v-if="activeTab === 'actions'" class="tab-content">
        <div class="role-header role-actions">
          <h3>Actions — 處理非同步邏輯，再 commit mutation</h3>
        </div>
        <ul class="role-rules">
          <li>✅ 可以包含非同步操作（API 呼叫、setTimeout 等）</li>
          <li>✅ 透過 <code>context.commit</code> 提交 mutation</li>
          <li>✅ 可以透過 <code>context.dispatch</code> 呼叫其他 action</li>
          <li>✅ 回傳 Promise，元件可以 <code>await dispatch()</code></li>
          <li>❌ 不能直接修改 state（應 commit mutation 來修改）</li>
        </ul>
        <pre>// 定義
const actions = {
  async fetchUser({ commit }, userId) {
    try {
      const user = await api.getUser(userId)
      commit('SET_USER', user)          // 修改透過 mutation
    } catch (e) {
      commit('SET_ERROR', e.message)
    }
  },

  // action 組合：呼叫多個 mutation/action
  async initApp({ dispatch, commit }) {
    commit('SET_LOADING', true)
    await dispatch('fetchUser', 1)
    await dispatch('fetchTodos')
    commit('SET_LOADING', false)
  }
}

// 元件中使用
import { mapActions } from 'vuex'
methods: {
  ...mapActions(['fetchUser']),
  async init() {
    const result = await this.$store.dispatch('login', { username, password })
    if (result.success) this.$router.push('/')
  }
}</pre>
      </div>

      <!-- Getters -->
      <div v-if="activeTab === 'getters'" class="tab-content">
        <div class="role-header role-getters">
          <h3>Getters — 從 state 衍生資料（有快取）</h3>
        </div>
        <ul class="role-rules">
          <li>✅ 類似 <code>computed</code>，有快取，依賴不變就不重算</li>
          <li>✅ 可以接收其他 getter 作為第二個參數</li>
          <li>✅ 可以回傳函式，實現「帶參數的 getter」</li>
          <li>❌ 不能修改 state</li>
          <li>❌ 避免在 getter 中做繁重的計算，保持純粹</li>
        </ul>
        <pre>// 定義
const getters = {
  // 基本衍生
  completedTodos: state => state.todos.filter(t => t.done),

  // 使用其他 getter
  completionRate: (state, getters) => {
    return Math.round(
      (getters.completedTodos.length / state.todos.length) * 100
    )
  },

  // 回傳函式（帶參數）
  getTodoById: state => id => state.todos.find(t => t.id === id)
}

// 元件中使用
import { mapGetters } from 'vuex'
computed: {
  ...mapGetters(['completedTodos', 'completionRate']),
  specificTodo() {
    return this.$store.getters.getTodoById(this.todoId)
  }
}</pre>
      </div>
    </div>

    <!-- 3. 互動示範 -->
    <div class="card">
      <h2>3. 互動示範（使用真實 Store）</h2>

      <h3>State 直接讀取</h3>
      <div class="demo-row">
        <span>count：<strong>{{ count }}</strong></span>
        <span>登入狀態：<span :class="isAuthenticated ? 'tag tag-green' : 'tag tag-red'">
          {{ isAuthenticated ? '已登入' : '未登入' }}
        </span></span>
      </div>

      <h3>Mutation 操作</h3>
      <div class="demo-row">
        <button class="btn btn-primary" @click="increment">INCREMENT</button>
        <button class="btn btn-danger" @click="decrement">DECREMENT</button>
        <button class="btn btn-warning" @click="setCount(0)">重置為 0</button>
      </div>

      <h3>Getters 衍生資料</h3>
      <div class="getter-display">
        <div class="getter-item">
          <span class="getter-label">未完成 todos</span>
          <span class="getter-value">{{ incompleteTodos.length }} 筆</span>
        </div>
        <div class="getter-item">
          <span class="getter-label">已完成 todos</span>
          <span class="getter-value">{{ completedTodos.length }} 筆</span>
        </div>
        <div class="getter-item">
          <span class="getter-label">完成率</span>
          <span class="getter-value">{{ completionRate }}%</span>
        </div>
      </div>

      <h3>Action（非同步）</h3>
      <div class="demo-row">
        <input v-model="newTodoText" placeholder="輸入新 todo" class="input" />
        <button class="btn btn-info" @click="handleAddTodo" :disabled="adding">
          {{ adding ? '新增中...' : 'Action 新增 Todo' }}
        </button>
      </div>
      <div class="todo-list">
        <div v-for="todo in allTodos" :key="todo.id" class="todo-item">
          <span :class="{ done: todo.done }">{{ todo.text }}</span>
          <button class="btn-sm" @click="toggleTodo(todo.id)">
            {{ todo.done ? '取消' : '完成' }}
          </button>
          <button class="btn-sm btn-sm-danger" @click="removeTodo(todo.id)">刪除</button>
        </div>
      </div>
    </div>

    <!-- 4. 何時用 Vuex / 何時不用 -->
    <div class="card">
      <h2>4. Vuex 使用時機判斷</h2>
      <div class="when-grid">
        <div class="when-item when-use">
          <h3>✅ 應使用 Vuex</h3>
          <ul>
            <li>多個元件需要共享同一份資料</li>
            <li>兄弟/遠親元件需要通訊</li>
            <li>擁有複雜業務邏輯的非同步資料流</li>
            <li>需要時光旅行除錯（DevTools）</li>
          </ul>
        </div>
        <div class="when-item when-notuse">
          <h3>❌ 不應過度使用 Vuex</h3>
          <ul>
            <li>只在父子元件間傳遞的局部狀態（用 props/emit）</li>
            <li>UI 狀態（modal 開關、hover 等，用 data）</li>
            <li>小型應用（可能增加不必要複雜度）</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'VuexPage',
  data() {
    return {
      activeTab: 'state',
      newTodoText: '',
      adding: false,
      tabs: [
        { id: 'state',     label: 'State' },
        { id: 'mutations', label: 'Mutations' },
        { id: 'actions',   label: 'Actions' },
        { id: 'getters',   label: 'Getters' }
      ]
    }
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters([
      'isAuthenticated',
      'incompleteTodos',
      'completedTodos',
      'completionRate'
    ]),
    allTodos() {
      return this.$store.state.todos
    }
  },
  methods: {
    ...mapMutations({
      increment: 'INCREMENT',
      decrement: 'DECREMENT',
      setCount:  'SET_COUNT',
      toggleTodo: 'TOGGLE_TODO',
      removeTodo: 'REMOVE_TODO'
    }),
    ...mapActions(['addTodoAsync']),
    async handleAddTodo() {
      if (!this.newTodoText.trim()) return
      this.adding = true
      await this.addTodoAsync(this.newTodoText.trim())
      this.newTodoText = ''
      this.adding = false
    }
  }
}
</script>

<style scoped>
.architecture {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 16px;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.arch-block {
  border-radius: 8px;
  padding: 16px;
  min-width: 160px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.arch-component { background: #1a2535; border: 2px solid #1e6e9a; }
.arch-store     { background: #2a2510; border: 2px solid #9a7520; }
.arch-title     { font-weight: 700; font-size: 15px; margin-bottom: 6px; color: #e2e8f0; }
.arch-desc      { font-size: 12px; color: #6e7a9a; }
.store-parts {
  display: -ms-grid;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}
.store-part {
  border-radius: 6px;
  padding: 8px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 2px;
}
.store-part small { font-size: 11px; color: #6e7a9a; }
.part-actions   { background: #1a3a2e; }
.part-mutations { background: #3a1f20; }
.part-state     { background: #1e2f45; }
.part-getters   { background: #3a2e14; }
.arch-arrows {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}
.arrow-row { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; gap: 4px; }
.arrow { font-size: 20px; color: #6e7a9a; }
.arrow-label { font-size: 11px; color: #4a5568; }

.role-tabs { display: -webkit-box; display: -ms-flexbox; display: flex; gap: 8px; margin-bottom: 16px; -ms-flex-wrap: wrap; flex-wrap: wrap; }
.tab-btn {
  padding: 8px 20px;
  border: 2px solid #2d3548;
  background: #252c3b;
  color: #c9d1d9;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}
.tab-btn.active { background: #42b983; color: #fff; border-color: #42b983; }
.tab-content { margin-top: 8px; }
.role-header { border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; }
.role-state     .role-header,
.role-header.role-state     { background: #1e2f45; }
.role-header.role-mutations { background: #3a1f20; }
.role-header.role-actions   { background: #1a3a2e; }
.role-header.role-getters   { background: #3a2e14; }
.role-rules { padding-left: 20px; margin: 8px 0 12px; }
.role-rules li { margin: 4px 0; font-size: 14px; line-height: 1.6; }

.demo-row { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; gap: 8px; margin: 8px 0 16px; -ms-flex-wrap: wrap; flex-wrap: wrap; }
.getter-display { display: -webkit-box; display: -ms-flexbox; display: flex; gap: 16px; margin: 8px 0 16px; -ms-flex-wrap: wrap; flex-wrap: wrap; }
.getter-item {
  background: #252c3b;
  border: 1px solid #2d3548;
  border-radius: 6px;
  padding: 12px 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.getter-label { font-size: 12px; color: #6e7a9a; }
.getter-value { font-size: 24px; font-weight: 700; color: #e2e8f0; }
.input { padding: 8px 12px; border: 1px solid #2d3548; border-radius: 4px; font-size: 14px; width: 200px; background: #252c3b; color: #c9d1d9; }
.todo-list { margin-top: 8px; }
.todo-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #2d3548;
}
.todo-item span { -webkit-box-flex: 1; -ms-flex: 1; flex: 1; }
.done { text-decoration: line-through; color: #4a5568; }
.btn-sm {
  padding: 3px 8px;
  font-size: 12px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background: #42b983;
  color: #fff;
}
.btn-sm-danger { background: #c0392b; }
.when-grid { display: -ms-grid; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.when-item { padding: 16px; border-radius: 6px; }
.when-use    { background: #1a3a2e; }
.when-notuse { background: #3a1f20; }
.when-item ul { padding-left: 18px; margin-top: 8px; }
.when-item li { margin: 4px 0; font-size: 14px; }
</style>
