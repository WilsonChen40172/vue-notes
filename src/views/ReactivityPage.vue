<template>
  <div>
    <h1 class="page-title">Vue 2 響應式原理 + Vue.set 使用場景</h1>
    <p class="page-subtitle">深入了解 Vue 2 如何透過 Object.defineProperty 實現資料劫持</p>

    <!-- 1. 響應式原理說明 -->
    <div class="card">
      <h2>1. 響應式原理：Object.defineProperty</h2>
      <p>Vue 2 在初始化時，會遍歷 <code>data</code> 物件的每個屬性，並使用 <strong>Object.defineProperty</strong> 將其轉換成 getter/setter。當資料被讀取（get）或修改（set）時，Vue 便能追蹤依賴、通知 Watcher 更新視圖。</p>
      <pre>// Vue 2 響應式核心原理（簡化版）
function defineReactive(obj, key, val) {
  const dep = new Dep()  // 依賴收集桶

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend()   // 收集依賴（Watcher）
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      dep.notify()   // 通知所有 Watcher 更新
    }
  })
}</pre>

      <div class="flow-diagram">
        <div class="flow-item flow-data">data</div>
        <div class="flow-arrow">→ Observer →</div>
        <div class="flow-item flow-dep">Dep（依賴）</div>
        <div class="flow-arrow">↔</div>
        <div class="flow-item flow-watcher">Watcher</div>
        <div class="flow-arrow">→</div>
        <div class="flow-item flow-render">重新渲染</div>
      </div>
    </div>

    <!-- 2. 限制說明 -->
    <div class="card">
      <h2>2. Object.defineProperty 的限制</h2>
      <div class="limit-grid">
        <div class="limit-item limit-bad">
          <strong>❌ 無法偵測：新增屬性</strong>
          <pre>// 直接新增屬性，視圖不會更新！
this.obj.newProp = 'hello'</pre>
        </div>
        <div class="limit-item limit-bad">
          <strong>❌ 無法偵測：刪除屬性</strong>
          <pre>// 刪除屬性，視圖不會更新！
delete this.obj.existProp</pre>
        </div>
        <div class="limit-item limit-bad">
          <strong>❌ 無法偵測：陣列索引賦值</strong>
          <pre>// 直接用索引修改，視圖不會更新！
this.arr[0] = 'new value'</pre>
        </div>
        <div class="limit-item limit-bad">
          <strong>❌ 無法偵測：修改 length</strong>
          <pre>// 修改 length，視圖不會更新！
this.arr.length = 0</pre>
        </div>
      </div>
    </div>

    <!-- 3. Vue.set 互動演示 -->
    <div class="card">
      <h2>3. Vue.set 使用場景（互動示範）</h2>

      <h3>場景一：動態新增物件屬性</h3>
      <p class="hint">只有透過 <code>Vue.set</code> 或 <code>this.$set</code> 新增的屬性才是響應式的</p>
      <div class="demo-box">
        <div class="demo-display">
          <div class="obj-preview">
            <div v-for="(val, key) in profile" :key="key" class="obj-row">
              <span class="obj-key">{{ key }}</span>
              <span class="obj-val">{{ val }}</span>
              <span v-if="newKeys.includes(key)" class="tag tag-green">響應式 ✓</span>
              <span v-if="nonReactiveKeys.includes(key)" class="tag tag-red">非響應式 ✗</span>
            </div>
          </div>
        </div>
        <div class="demo-controls">
          <button class="btn btn-primary" @click="addWithVueSet">
            Vue.set 新增 address（響應式）
          </button>
          <button class="btn btn-danger" @click="addDirectly">
            直接賦值 extra（非響應式）
          </button>
          <button class="btn btn-warning" @click="resetProfile">重置</button>
        </div>
        <p class="demo-note">{{ setMessage }}</p>
      </div>

      <h3>場景二：動態新增巢狀物件屬性</h3>
      <pre>// ✅ 正確：使用 Vue.set
this.$set(this.user.settings, 'darkMode', true)

// ❌ 錯誤：直接賦值
this.user.settings.darkMode = true  // 視圖不更新！</pre>

      <h3>場景三：陣列響應式操作</h3>
      <div class="demo-box">
        <p>陣列：{{ reactiveArr }}</p>
        <div class="demo-controls">
          <button class="btn btn-primary" @click="addByVueSet">
            Vue.set(arr, 0, '★') 修改索引
          </button>
          <button class="btn btn-info" @click="addByMethods">
            arr.push / splice（Vue 已包裝）
          </button>
          <button class="btn btn-warning" @click="resetArr">重置</button>
        </div>
      </div>

      <h3>Vue 2 已包裝的陣列方法（這些可觸發更新）</h3>
      <div class="method-tags">
        <span class="tag tag-green">push()</span>
        <span class="tag tag-green">pop()</span>
        <span class="tag tag-green">shift()</span>
        <span class="tag tag-green">unshift()</span>
        <span class="tag tag-green">splice()</span>
        <span class="tag tag-green">sort()</span>
        <span class="tag tag-green">reverse()</span>
      </div>
    </div>

    <!-- 4. Vue.delete -->
    <div class="card">
      <h2>4. Vue.delete 使用場景</h2>
      <p>對應地，刪除屬性也需要使用 <code>Vue.delete</code> / <code>this.$delete</code> 才能觸發更新：</p>
      <div class="demo-box">
        <p>用戶資料：<code>{{ deletableObj }}</code></p>
        <div class="demo-controls">
          <button class="btn btn-primary" @click="deleteWithVueDelete">
            Vue.delete(obj, 'age')
          </button>
          <button class="btn btn-warning" @click="resetDeleteObj">重置</button>
        </div>
      </div>
      <pre>// ✅ 正確：使用 Vue.delete
this.$delete(this.user, 'age')

// ❌ 錯誤：直接 delete
delete this.user.age  // 視圖不更新！</pre>
    </div>

    <!-- 5. Vue 3 對比 -->
    <div class="card">
      <h2>5. Vue 3 的改進：Proxy</h2>
      <p>Vue 3 改用 <strong>ES6 Proxy</strong> 實現響應式，解決了上述所有限制：</p>
      <pre>// Vue 3 響應式（概念）
const handler = {
  get(target, key) {
    track(target, key)   // 追蹤依賴
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    Reflect.set(target, key, value)
    trigger(target, key) // 觸發更新
    return true
  },
  deleteProperty(target, key) {
    Reflect.deleteProperty(target, key)
    trigger(target, key) // 刪除也能觸發更新！
    return true
  }
}

const reactive = (obj) => new Proxy(obj, handler)</pre>
      <div class="comparison-table">
        <table>
          <thead>
            <tr>
              <th>能力</th>
              <th>Vue 2 (defineProperty)</th>
              <th>Vue 3 (Proxy)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>新增屬性</td>
              <td class="no">❌ 需 Vue.set</td>
              <td class="yes">✅ 自動偵測</td>
            </tr>
            <tr>
              <td>刪除屬性</td>
              <td class="no">❌ 需 Vue.delete</td>
              <td class="yes">✅ 自動偵測</td>
            </tr>
            <tr>
              <td>陣列索引賦值</td>
              <td class="no">❌ 需 Vue.set</td>
              <td class="yes">✅ 自動偵測</td>
            </tr>
            <tr>
              <td>修改 length</td>
              <td class="no">❌ 無效</td>
              <td class="yes">✅ 自動偵測</td>
            </tr>
            <tr>
              <td>IE11 支援</td>
              <td class="yes">✅ 支援（需 polyfill）</td>
              <td class="no">❌ 不支援</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'ReactivityPage',
  data() {
    return {
      profile: {
        name: 'Alice',
        age: 25
      },
      newKeys: [],
      nonReactiveKeys: [],
      setMessage: '',
      reactiveArr: ['a', 'b', 'c'],
      deletableObj: { name: 'Bob', age: 30, city: 'Taipei' }
    }
  },
  methods: {
    // ─ 場景一 ─
    addWithVueSet() {
      // ✅ Vue.set：新增的屬性會是響應式的
      Vue.set(this.profile, 'address', '台北市')
      this.newKeys.push('address')
      this.setMessage = '✅ Vue.set 新增 address — 視圖已更新'
    },
    addDirectly() {
      // ❌ 直接賦值：不是響應式，Vue 偵測不到
      this.profile.extra = '非響應式資料'
      // 為了讓畫面能顯示（強制更新），這裡用 $forceUpdate 模擬
      this.$forceUpdate()
      this.nonReactiveKeys.push('extra')
      this.setMessage = '❌ 直接賦值 extra — Vue 無法追蹤此屬性的後續變化'
    },
    resetProfile() {
      this.profile = { name: 'Alice', age: 25 }
      this.newKeys = []
      this.nonReactiveKeys = []
      this.setMessage = ''
    },
    // ─ 場景三 ─
    addByVueSet() {
      Vue.set(this.reactiveArr, 0, '★')
    },
    addByMethods() {
      this.reactiveArr.push('d')
      if (this.reactiveArr.length > 5) {
        this.reactiveArr.splice(0, 1)
      }
    },
    resetArr() {
      this.reactiveArr = ['a', 'b', 'c']
    },
    // ─ 場景四 ─
    deleteWithVueDelete() {
      Vue.delete(this.deletableObj, 'age')
    },
    resetDeleteObj() {
      this.deletableObj = { name: 'Bob', age: 30, city: 'Taipei' }
    }
  }
}
</script>

<style scoped>
.hint { color: #6e7a9a; font-size: 13px; margin-bottom: 8px; }
.demo-box {
  background: #252c3b;
  border: 1px solid #2d3548;
  border-radius: 6px;
  padding: 16px;
  margin: 12px 0;
}
.obj-preview { font-family: monospace; }
.obj-row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #2d3548;
}
.obj-key { color: #f87171; font-weight: 600; min-width: 100px; }
.obj-val { color: #60a5fa; }
.demo-controls { margin: 12px 0; }
.demo-note { margin-top: 8px; font-size: 13px; color: #6e7a9a; }
.flow-diagram {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.flow-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}
.flow-data    { background: #1a3a2e; color: #4ade80; }
.flow-dep     { background: #3a2e14; color: #fb923c; }
.flow-watcher { background: #1e2f45; color: #60a5fa; }
.flow-render  { background: #3a1f20; color: #f87171; }
.flow-arrow   { color: #6e7a9a; font-weight: bold; }
.limit-grid {
  display: -ms-grid;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.limit-item { padding: 12px; border-radius: 6px; }
.limit-bad  { background: #2a1f20; border: 1px solid #5a2d2e; }
.method-tags { margin-top: 8px; }
.comparison-table { margin-top: 12px; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px 14px; text-align: left; border: 1px solid #2d3548; font-size: 14px; }
th { background: #131720; color: #e2e8f0; }
tr:nth-child(even) { background: #131720; }
.yes { color: #4ade80; font-weight: 600; }
.no  { color: #f87171; }
</style>
