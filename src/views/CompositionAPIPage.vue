<template>
  <div>
    <h1 class="page-title">Composition API</h1>
    <p class="page-subtitle">Vue 3 最核心的新特性，讓邏輯可以按「功能」組織，而非按「選項類型」</p>

    <!-- 1. 核心差異 -->
    <div class="card">
      <h2>1. Options API vs Composition API</h2>
      <p class="desc">Vue 3 同時支援兩種風格。Composition API 更適合大型元件與邏輯複用，<strong>新專案推薦使用</strong>。</p>
      <div class="compare-grid">
        <div class="compare-col">
          <div class="compare-badge badge-old">Options API</div>
          <pre><code>// 按「選項類型」組織 → 相關邏輯被迫分散
export default {
  data() {
    return { count: 0, username: '' }
  },
  computed: {
    doubled() { return this.count * 2 }
  },
  methods: {
    increment() { this.count++ }
  },
  mounted() {
    console.log('mounted')
  }
}</code></pre>
        </div>
        <div class="compare-col">
          <div class="compare-badge badge-new">Composition API（Vue 3 推薦）</div>
          <pre><code>// 按「功能邏輯」組織 → 相關程式碼集中在一起
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // ── 計數器功能（邏輯集中！）──
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    const increment = () => count.value++

    onMounted(() => console.log('mounted'))

    return { count, doubled, increment }
  }
}</code></pre>
        </div>
      </div>
    </div>

    <!-- 2. ref & reactive -->
    <div class="card">
      <h2>2. ref & reactive — 宣告響應式資料</h2>
      <div class="tab-bar">
        <button
          v-for="t in ['ref', 'reactive', '比較']"
          :key="t"
          class="tab-btn"
          :class="{ active: refTab === t }"
          @click="refTab = t"
        >{{ t }}</button>
      </div>

      <div v-show="refTab === 'ref'">
        <p class="desc"><code>ref()</code> 包裝任意型別，JS 中透過 <code>.value</code> 存取，template 中自動解包。</p>
        <pre><code>import { ref } from 'vue'

const count = ref(0)         // 數字
const name  = ref('Vue 3')   // 字串
const user  = ref({ age: 18 }) // 物件也行

// ⚠️ JS 中需要 .value
count.value++
console.log(count.value)     // 1

// ✅ template 中自動解包，不需要 .value
// &lt;p&gt;{{ count }}&lt;/p&gt;</code></pre>
      </div>

      <div v-show="refTab === 'reactive'">
        <p class="desc"><code>reactive()</code> 回傳 Proxy，只適用物件/陣列，直接操作屬性即可，無需 <code>.value</code>。</p>
        <pre><code>import { reactive, toRefs } from 'vue'

const state = reactive({
  count: 0,
  list: ['A', 'B', 'C']
})

// ✅ 直接存取，不需要 .value
state.count++
state.list.push('D')

// ⚠️ 解構會失去響應性！
const { count } = state          // ❌ count 變成普通數字

// ✅ 用 toRefs 解構，保持響應性
const { count, list } = toRefs(state)  // ✅</code></pre>
      </div>

      <div v-show="refTab === '比較'">
        <div class="diff-table">
          <div class="diff-row diff-header">
            <span></span><span>ref</span><span>reactive</span>
          </div>
          <div class="diff-row"><span>適用型別</span><span>任意型別</span><span>物件 / 陣列</span></div>
          <div class="diff-row"><span>JS 存取</span><span><code>x.value</code></span><span>直接 <code>x.prop</code></span></div>
          <div class="diff-row"><span>Template</span><span>自動解包</span><span>直接存取</span></div>
          <div class="diff-row"><span>解構</span><span>✅ 可以</span><span>⚠️ 需 toRefs</span></div>
          <div class="diff-row"><span>整體替換</span><span>✅ <code>x.value = {}</code></span><span>❌ 會失去響應性</span></div>
          <div class="diff-row diff-recommend"><span>推薦</span><span class="good">✅ 大多數場景</span><span>複雜物件狀態</span></div>
        </div>
      </div>

      <!-- Live Demo -->
      <div class="demo-box">
        <div class="demo-left">
          <h4>Live Demo</h4>
          <p>count: <span class="hl">{{ demoCount }}</span></p>
          <p>doubled: <span class="hl">{{ demoDoubled }}</span></p>
          <p>msg: <span class="hl">{{ demoMsg }}</span></p>
        </div>
        <div class="demo-right">
          <button class="btn btn-green" @click="demoCount++">count++</button>
          <button class="btn btn-blue" @click="demoMsg = 'Hello Vue 3!'">改變 msg</button>
          <button class="btn btn-gray" @click="demoCount = 0; demoMsg = 'initial'">重置</button>
        </div>
      </div>
    </div>

    <!-- 3. computed & watch -->
    <div class="card">
      <h2>3. computed & watch & watchEffect</h2>
      <div class="two-col">
        <div>
          <h3>computed — 衍生計算值</h3>
          <p class="desc">依賴的響應式資料變動時自動重算，<strong>有快取</strong>（依賴不變就不重算）</p>
          <pre><code>import { ref, computed } from 'vue'

const price = ref(100)
const qty   = ref(3)

// 唯讀 computed
const total = computed(() => price.value * qty.value)
console.log(total.value)  // 300

// 可讀寫 computed（get + set）
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (val) => {
    [first.value, last.value] = val.split(' ')
  }
})</code></pre>
        </div>
        <div>
          <h3>watch vs watchEffect</h3>
          <p class="desc"><code>watch</code> 明確指定來源；<code>watchEffect</code> 自動追蹤、立即執行</p>
          <pre><code>import { ref, watch, watchEffect } from 'vue'

const query = ref('')

// watch：有新值/舊值，惰性（不立即執行）
watch(query, (newVal, oldVal) => {
  console.log(`${oldVal} → ${newVal}`)
}, {
  immediate: true,  // 立即執行一次
  deep: true        // 深層監聽物件
})

// watchEffect：自動追蹤依賴，立即執行
const stop = watchEffect(() => {
  console.log('query:', query.value)
  // 讀到什麼響應式資料就追蹤什麼
})

stop()  // 手動停止監聽</code></pre>
        </div>
      </div>
    </div>

    <!-- 4. Lifecycle Hooks -->
    <div class="card">
      <h2>4. 生命週期 Hooks</h2>
      <p class="desc">Composition API 的 hooks 名稱加上 <code>on</code> 前綴，在 <code>setup</code> 內呼叫</p>
      <div class="lifecycle-grid">
        <div v-for="hook in lifecycleHooks" :key="hook.comp" class="hook-item" :class="hook.color">
          <div class="hook-comp">{{ hook.comp }}</div>
          <div class="hook-opts">Options: <code>{{ hook.opts }}</code></div>
          <div class="hook-desc">{{ hook.desc }}</div>
        </div>
      </div>
      <pre><code>import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      // DOM 已掛載 → 發 API 請求、操作 DOM
      fetchData()
    })

    onUnmounted(() => {
      // 元件銷毀前 → 清理計時器、移除事件監聽
      clearInterval(timer)
      window.removeEventListener('resize', onResize)
    })
  }
}</code></pre>
    </div>

    <!-- 5. script setup -->
    <div class="card">
      <h2>5. &lt;script setup&gt; — 推薦語法糖（Vue 3.2+）</h2>
      <p class="desc">比 <code>setup()</code> function 更簡潔：頂層宣告自動暴露給 template，無需 <code>return</code></p>
      <div class="compare-grid">
        <div class="compare-col">
          <div class="compare-badge badge-old">setup() function（本專案使用）</div>
          <pre><code>import { ref, computed } from 'vue'

export default {
  props: ['title'],
  emits: ['submit'],
  setup(props, { emit }) {
    const count = ref(0)
    const doubled = computed(
      () => count.value * 2
    )
    function submit() {
      emit('submit', count.value)
    }
    // ⚠️ 必須 return 才能在 template 使用
    return { count, doubled, submit }
  }
}</code></pre>
        </div>
        <div class="compare-col">
          <div class="compare-badge badge-new">&lt;script setup&gt;（新專案推薦）</div>
          <pre><code>// &lt;script setup&gt;
import { ref, computed } from 'vue'

const props  = defineProps(['title'])
const emit   = defineEmits(['submit'])

const count   = ref(0)
const doubled = computed(
  () => count.value * 2
)
function submit() {
  emit('submit', count.value)
}
// ✅ 不需要 return！
// 頂層宣告自動在 template 中可用</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompositionAPIPage',
  data() {
    return {
      refTab: 'ref',
      demoCount: 0,
      demoMsg: 'initial',
      lifecycleHooks: [
        { comp: 'onBeforeMount()',  opts: 'beforeMount',  color: 'hook-blue',   desc: 'DOM 掛載前，$el 尚未建立' },
        { comp: 'onMounted()',      opts: 'mounted',      color: 'hook-green',  desc: 'DOM 掛載完成，可操作 DOM / 發 API' },
        { comp: 'onBeforeUpdate()', opts: 'beforeUpdate', color: 'hook-yellow', desc: '資料變化、DOM 更新前' },
        { comp: 'onUpdated()',      opts: 'updated',      color: 'hook-yellow', desc: 'DOM 已更新完成' },
        { comp: 'onBeforeUnmount()',opts: 'beforeDestroy',color: 'hook-red',    desc: '元件卸載前，仍可存取 DOM' },
        { comp: 'onUnmounted()',    opts: 'destroyed',    color: 'hook-red',    desc: '元件已卸載，清理計時器 / 監聽器' },
      ]
    }
  },
  computed: {
    demoDoubled() {
      return this.demoCount * 2
    }
  }
}
</script>

<style scoped>
.desc { color: #94a3b8; margin-bottom: 1rem; font-size: 14px; }
.desc strong { color: #e2e8f0; }
code { background: #2d3548; color: #42b983; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }

.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}
.compare-col { display: flex; flex-direction: column; }
.compare-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}
.badge-old { background: #2a2510; color: #fbbf24; border: 1px solid #5a4010; }
.badge-new { background: #1a3a2e; color: #42b983; border: 1px solid #2d6a4f; }

.tab-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.tab-btn {
  padding: 6px 16px;
  border: 2px solid #2d3548;
  background: #252c3b;
  color: #c9d1d9;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.tab-btn.active { background: #42b983; color: #fff; border-color: #42b983; }

.diff-table { border-radius: 8px; overflow: hidden; margin-top: 8px; }
.diff-row {
  display: grid;
  grid-template-columns: 130px 1fr 1fr;
  gap: 1px;
  background: #1a1f2e;
}
.diff-row > span {
  background: #252c3b;
  padding: 8px 12px;
  font-size: 13px;
  color: #c9d1d9;
}
.diff-header > span { background: #1e2432; color: #42b983; font-weight: 600; }
.diff-recommend > span { background: #1a3a2e; }
.good { color: #42b983 !important; font-weight: 600; }

.demo-box {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  background: #141926;
  border: 1px solid #2d3548;
  border-radius: 8px;
  padding: 1rem;
}
.demo-left { flex: 1; font-family: monospace; }
.demo-left h4 { color: #42b983; margin: 0 0 8px; font-size: 13px; }
.demo-left p { margin: 4px 0; font-size: 13px; color: #94a3b8; }
.hl { color: #e2e8f0; font-weight: bold; }
.demo-right { display: flex; flex-direction: column; gap: 8px; justify-content: center; }

.btn { padding: 6px 14px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 13px; }
.btn:hover { opacity: 0.85; }
.btn-green { background: #42b983; color: #fff; }
.btn-blue  { background: #3b82f6; color: #fff; }
.btn-gray  { background: #4a5568; color: #fff; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.two-col h3 { color: #e2e8f0; margin-top: 0; font-size: 15px; }

.lifecycle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 1rem;
}
.hook-item { padding: 10px 12px; border-radius: 6px; border-left: 3px solid transparent; }
.hook-comp { font-family: monospace; font-weight: 700; font-size: 13px; margin-bottom: 3px; }
.hook-opts { font-size: 11px; color: #6e7a9a; margin-bottom: 3px; }
.hook-desc { font-size: 12px; color: #94a3b8; }
.hook-blue   { background: #1e2f45; border-color: #3b82f6; }
.hook-blue   .hook-comp { color: #60a5fa; }
.hook-green  { background: #1a3a2e; border-color: #42b983; }
.hook-green  .hook-comp { color: #4ade80; }
.hook-yellow { background: #2a2510; border-color: #f39c12; }
.hook-yellow .hook-comp { color: #fbbf24; }
.hook-red    { background: #2a1f20; border-color: #ef4444; }
.hook-red    .hook-comp { color: #f87171; }

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
</style>
