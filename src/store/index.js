import { createStore } from 'vuex'

// ─────────────────────────────────────────────
// State：唯一資料來源，所有元件共享
// ─────────────────────────────────────────────
const state = {
    count: 0,
    user: null,
    todos: [
        { id: 1, text: '學習 Vuex', done: true },
        { id: 2, text: '練習 Vue Router', done: false },
        { id: 3, text: '研究相容', done: false }
    ],
    isLoggedIn: false,
    role: 'guest' // guest | user | admin
}

// ─────────────────────────────────────────────
// Getters：類似 computed，從 state 衍生資料
// 不應在此修改 state
// ─────────────────────────────────────────────
const getters = {
    // 取得未完成的 todos
    incompleteTodos: state => state.todos.filter(t => !t.done),

    // 取得已完成的 todos
    completedTodos: state => state.todos.filter(t => t.done),

    // 完成比例（百分比）
    completionRate: (state, getters) => {
        if (state.todos.length === 0) return 0
        return Math.round((getters.completedTodos.length / state.todos.length) * 100)
    },

    // 是否為管理員
    isAdmin: state => state.role === 'admin',

    // 是否已登入
    isAuthenticated: state => state.isLoggedIn
}

// ─────────────────────────────────────────────
// Mutations：唯一能「同步修改」state 的地方
// 必須是同步函式，方便 DevTools 追蹤
// ─────────────────────────────────────────────
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    SET_COUNT(state, payload) {
        state.count = payload
    },
    SET_USER(state, user) {
        state.user = user
        state.isLoggedIn = !!user
        state.role = user ? user.role : 'guest'
    },
    LOGOUT(state) {
        state.user = null
        state.isLoggedIn = false
        state.role = 'guest'
    },
    ADD_TODO(state, todo) {
        state.todos.push(todo)
    },
    TOGGLE_TODO(state, id) {
        const todo = state.todos.find(t => t.id === id)
        if (todo) todo.done = !todo.done
    },
    REMOVE_TODO(state, id) {
        const index = state.todos.findIndex(t => t.id === id)
        if (index > -1) state.todos.splice(index, 1)
    }
}

// ─────────────────────────────────────────────
// Actions：處理非同步邏輯，再 commit mutation
// 不能直接修改 state，必須透過 commit
// ─────────────────────────────────────────────
const actions = {
    // 模擬非同步登入
    async login({ commit }, credentials) {
        try {
            // 模擬 API 呼叫（500ms 延遲）
            const user = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (credentials.username === 'admin' && credentials.password === 'admin') {
                        resolve({ id: 1, username: 'admin', role: 'admin' })
                    } else if (credentials.username === 'user' && credentials.password === 'user') {
                        resolve({ id: 2, username: 'user', role: 'user' })
                    } else {
                        reject(new Error('帳號或密碼錯誤'))
                    }
                }, 500)
            })
            commit('SET_USER', user)
            return { success: true, user }
        } catch (error) {
            return { success: false, message: error.message }
        }
    },

    logout({ commit }) {
        commit('LOGOUT')
    },

    // 非同步新增 todo（可加入 API 呼叫）
    addTodoAsync({ commit, state }, text) {
        return new Promise(resolve => {
            setTimeout(() => {
                const newTodo = {
                    id: Date.now(),
                    text,
                    done: false
                }
                commit('ADD_TODO', newTodo)
                resolve(newTodo)
            }, 300)
        })
    },

    // action 呼叫另一個 action（dispatch chaining）
    async resetAndAdd({ dispatch, commit }, text) {
        commit('SET_COUNT', 0)
        const todo = await dispatch('addTodoAsync', text)
        return todo
    }
}

export default createStore({
    state,
    getters,
    mutations,
    actions,
    // strict 模式在開發環境開啟，防止在 mutation 外修改 state
    strict: process.env.NODE_ENV !== 'production'
})
