<template>
  <div>
    <h1 class="page-title">元件通訊</h1>
    <p class="page-subtitle">Vue 3 中父子元件、跨層元件之間傳遞資料的四種主要方式</p>

    <!-- 通訊方式一覽 -->
    <div class="card">
      <h2>通訊方式速查</h2>
      <div class="overview-grid">
        <div v-for="m in methods" :key="m.name" class="overview-item" :class="m.color">
          <div class="ov-icon">{{ m.icon }}</div>
          <div>
            <strong>{{ m.name }}</strong>
            <p>{{ m.when }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. Props & Emits -->
    <div class="card">
      <h2>1. Props & Emits — 父子通訊</h2>
      <p class="desc">最基本的通訊方式：<strong>父傳子</strong>用 Props，<strong>子傳父</strong>用 Emits（單向資料流）</p>

      <div class="tab-bar">
        <button v-for="t in ['Props', 'Emits', 'Live Demo']" :key="t"
          class="tab-btn" :class="{ active: peTab === t }" @click="peTab = t">{{ t }}</button>
      </div>

      <div v-show="peTab === 'Props'">
        <div class="two-col">
          <div>
            <h4 class="section-label">父元件傳入</h4>
            <pre><code>&lt;!-- ParentComponent.vue --&gt;
&lt;template&gt;
  &lt;ChildCard
    :title="cardTitle"
    :count="num"
    :items="list"
    disabled
  /&gt;
&lt;/template&gt;</code></pre>
          </div>
          <div>
            <h4 class="section-label">子元件接收（&lt;script setup&gt;）</h4>
            <pre><code>&lt;!-- ChildCard.vue --&gt;
import { defineProps, withDefaults } from 'vue'

const props = withDefaults(defineProps({
  title:    String,
  count:    { type: Number, default: 0 },
  items:    Array,
  disabled: Boolean
}), { items: () => [] })

// ⚠️ 不能在子元件直接修改 props！
// props.count++  // ❌ 會警告
// ✅ 用 emits 通知父元件修改</code></pre>
          </div>
        </div>
      </div>

      <div v-show="peTab === 'Emits'">
        <div class="two-col">
          <div>
            <h4 class="section-label">子元件發出事件（&lt;script setup&gt;）</h4>
            <pre><code>&lt;!-- ChildCard.vue --&gt;
const emit = defineEmits(['update:count', 'delete'])

function handleClick() {
  emit('update:count', props.count + 1)
}

function handleDelete() {
  emit('delete', props.id)
}</code></pre>
          </div>
          <div>
            <h4 class="section-label">父元件監聽</h4>
            <pre><code>&lt;!-- ParentComponent.vue --&gt;
&lt;template&gt;
  &lt;ChildCard
    :count="num"
    @update:count="num = $event"
    @delete="handleDelete"
    @submit="handleSubmit"
  /&gt;
&lt;/template&gt;

&lt;script&gt;
methods: {
  handleDelete(id) {
    this.list = this.list.filter(
      item => item.id !== id
    )
  },
  handleSubmit(data) {
    console.log('submitted:', data)
  }
}
&lt;/script&gt;</code></pre>
          </div>
        </div>
      </div>

      <div v-show="peTab === 'Live Demo'">
        <div class="pe-demo">
          <div class="parent-box">
            <div class="box-label">父元件</div>
            <p>num = <span class="hl">{{ peNum }}</span></p>
            <p>message = <span class="hl">"{{ peMsg }}"</span>
            </p>
            <p class="desc" style="margin:0;font-size:12px">（等待子元件 emit 更新）</p>
          </div>
          <div class="arrow-down">⬇ props ⬆ emits</div>
          <div class="child-box">
            <div class="box-label">子元件（接收 props，emit 事件）</div>
            <p>收到 props.num = <span class="hl">{{ peNum }}</span></p>
            <div class="child-btns">
              <button class="btn btn-green" @click="peNum++">emit('update', num+1)</button>
              <button class="btn btn-blue" @click="peMsg = '子元件傳上來的訊息！'">emit('message', ...)</button>
              <button class="btn btn-gray" @click="peNum = 0; peMsg = '初始值'">重置</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. v-model -->
    <div class="card">
      <h2>2. 元件 v-model — Props + Emits 的語法糖</h2>
      <p class="desc"><code>v-model</code> 在元件上等同於 <code>:modelValue</code> + <code>@update:modelValue</code></p>
      <div class="two-col">
        <div>
          <h4 class="section-label">父元件使用 v-model</h4>
          <pre><code>&lt;!-- 基本 v-model --&gt;
&lt;MyInput v-model="username" /&gt;
&lt;!-- 等同於 --&gt;
&lt;MyInput
  :modelValue="username"
  @update:modelValue="username = $event"
/&gt;

&lt;!-- Vue 3 支援多個 v-model！ --&gt;
&lt;UserForm
  v-model:first="firstName"
  v-model:last="lastName"
  v-model:age="age"
/&gt;</code></pre>
        </div>
        <div>
          <h4 class="section-label">子元件實作 v-model</h4>
          <pre><code>&lt;!-- MyInput.vue --&gt;
&lt;template&gt;
  &lt;input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  /&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
&lt;/script&gt;

&lt;!-- 多個 v-model --&gt;
props: ['first', 'last'],
emits: ['update:first', 'update:last']</code></pre>
        </div>
      </div>
      <div class="vmodel-demo">
        <div class="vmodel-input-row">
          <label>v-model Demo：</label>
          <input v-model="vmText" class="demo-input" placeholder="輸入文字..." />
        </div>
        <p>即時值：<span class="hl">{{ vmText || '（空）' }}</span></p>
        <p>字元數：<span class="hl">{{ vmText.length }}</span></p>
      </div>
    </div>

    <!-- 3. provide / inject -->
    <div class="card">
      <h2>3. provide / inject — 跨層傳遞</h2>
      <p class="desc">祖先元件 <code>provide</code> 資料，任意深度的後代元件可以直接 <code>inject</code>，<strong>避免 props 逐層傳遞（Prop Drilling）</strong></p>
      <div class="drilling-diagram">
        <div class="drill-node drill-provide">
          App（provide: theme, locale）
        </div>
        <div class="drill-children">
          <div class="drill-node drill-pass">Layout（不需要，但 Props 鑽取必須傳）</div>
          <div class="drill-children">
            <div class="drill-node drill-pass">Sidebar（同上）</div>
            <div class="drill-children">
              <div class="drill-node drill-inject">DeepButton（inject: theme, locale ✅）</div>
            </div>
          </div>
        </div>
      </div>
      <div class="two-col" style="margin-top: 1rem;">
        <div>
          <h4 class="section-label">祖先元件 provide</h4>
          <pre><code>// 祖先元件（App.vue）— &lt;script setup&gt;
import { ref, provide } from 'vue'

const theme  = ref('dark')
const locale = ref('zh-TW')

// 提供響應式資料
provide('theme', theme)
provide('locale', locale)

// 也可以提供修改函數（讓後代能更新）
provide('setTheme', (val) => {
  theme.value = val
})</code></pre>
        </div>
        <div>
          <h4 class="section-label">後代元件 inject</h4>
          <pre><code>// 深層後代元件 — &lt;script setup&gt;
import { inject } from 'vue'

// 注入，第二個參數是預設值
const theme    = inject('theme', 'dark')
const locale   = inject('locale', 'zh-TW')
const setTheme = inject('setTheme')

function toggleTheme() {
  setTheme(
    theme.value === 'dark' ? 'light' : 'dark'
  )
}</code></pre>
        </div>
      </div>

      <div class="pi-demo">
        <div class="pi-provide">
          <strong>模擬祖先元件（provide）</strong>
          <div class="pi-controls">
            <label>theme：</label>
            <button
              v-for="t in ['dark', 'blue', 'green']" :key="t"
              class="pi-btn" :class="{ active: piTheme === t }"
              @click="piTheme = t"
            >{{ t }}</button>
          </div>
        </div>
        <div class="pi-inject" :class="`pi-theme-${piTheme}`">
          <strong>模擬深層後代元件（inject）</strong>
          <p>inject('theme') = <span class="hl">{{ piTheme }}</span></p>
          <p>這個元件不需要透過中間層傳遞，直接拿到 theme！</p>
        </div>
      </div>
    </div>

    <!-- 4. 方式比較 -->
    <div class="card">
      <h2>4. 選擇哪種方式？</h2>
      <div class="choice-grid">
        <div v-for="c in choices" :key="c.scenario" class="choice-item">
          <div class="choice-scenario">{{ c.scenario }}</div>
          <div class="choice-method" :class="c.color">{{ c.method }}</div>
          <div class="choice-reason">{{ c.reason }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentCommPage',
  data() {
    return {
      peTab: 'Props',
      peNum: 0,
      peMsg: '初始值',
      vmText: '',
      piTheme: 'dark',
      methods: [
        { icon: '⬇️', color: 'ov-green',  name: 'Props & Emits',    when: '父子元件直接通訊（最常用）' },
        { icon: '🔁', color: 'ov-blue',   name: 'v-model',          when: 'Props+Emits 語法糖，雙向綁定' },
        { icon: '🌳', color: 'ov-yellow', name: 'provide / inject', when: '跨多層傳遞，避免 Prop Drilling' },
        { icon: '🗃️', color: 'ov-purple', name: 'Pinia / Vuex',     when: '全域共享狀態，跨元件樹通訊' },
      ],
      choices: [
        { scenario: '父元件 → 子元件',        method: 'Props',           color: 'cm-green',  reason: '最直觀，資料向下流動' },
        { scenario: '子元件 → 父元件',        method: 'Emits',           color: 'cm-green',  reason: '事件向上傳遞，保持單向資料流' },
        { scenario: '表單元件雙向綁定',        method: 'v-model',         color: 'cm-blue',   reason: 'Props + Emits 的語法糖，更簡潔' },
        { scenario: '祖先 → 任意深度後代',    method: 'provide / inject', color: 'cm-yellow', reason: '避免多層 props 傳遞（Prop Drilling）' },
        { scenario: '非父子關係的元件',        method: 'Pinia / Vuex',    color: 'cm-purple', reason: '全域 Store 是最清晰的解法' },
        { scenario: '兄弟元件通訊',           method: '提升狀態到父層',   color: 'cm-red',    reason: '共同父層管理狀態是 Vue 最佳實踐' },
      ]
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
.hl { color: #42b983; font-weight: bold; }

.overview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.overview-item {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 12px; border-radius: 8px; border-left: 3px solid transparent;
}
.ov-icon { font-size: 20px; flex-shrink: 0; }
.overview-item strong { display: block; color: #e2e8f0; font-size: 13px; }
.overview-item p { font-size: 12px; color: #6e7a9a; margin: 3px 0 0; }
.ov-green  { background: #1a3a2e; border-color: #42b983; }
.ov-blue   { background: #1e2f45; border-color: #3b82f6; }
.ov-yellow { background: #2a2510; border-color: #f39c12; }
.ov-purple { background: #251a35; border-color: #a855f7; }

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
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.section-label { color: #94a3b8; font-size: 13px; font-weight: 600; margin: 0 0 8px; }

.pe-demo { display: flex; flex-direction: column; gap: 0; }
.parent-box, .child-box {
  background: #141926;
  border: 1px solid #2d3548;
  border-radius: 8px;
  padding: 1rem;
}
.parent-box { border-color: #42b983; }
.child-box { border-color: #3b82f6; }
.box-label { font-size: 12px; font-weight: 600; color: #6e7a9a; margin-bottom: 8px; }
.parent-box .box-label { color: #42b983; }
.child-box  .box-label { color: #3b82f6; }
.parent-box p, .child-box p { font-size: 13px; color: #94a3b8; margin: 4px 0; }
.arrow-down { text-align: center; color: #4a5568; font-size: 13px; padding: 4px 0; }
.child-btns { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px; }
.btn:hover { opacity: 0.85; }
.btn-green  { background: #42b983; color: #fff; }
.btn-blue   { background: #3b82f6; color: #fff; }
.btn-gray   { background: #4a5568; color: #fff; }

.vmodel-demo {
  margin-top: 1rem;
  background: #141926;
  border: 1px solid #2d3548;
  border-radius: 8px;
  padding: 1rem;
}
.vmodel-input-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.vmodel-input-row label { color: #6e7a9a; font-size: 13px; }
.demo-input {
  flex: 1;
  background: #252c3b;
  border: 1px solid #2d3548;
  border-radius: 4px;
  color: #e2e8f0;
  padding: 6px 10px;
  font-size: 13px;
}
.vmodel-demo p { font-size: 13px; color: #94a3b8; margin: 4px 0; }

.drilling-diagram { padding: 1rem; background: #141926; border-radius: 8px; border: 1px solid #2d3548; margin-top: 0.5rem; }
.drill-node { padding: 6px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 4px; display: inline-block; }
.drill-provide { background: #1a3a2e; color: #42b983; border: 1px solid #2d6a4f; }
.drill-pass    { background: #252c3b; color: #6e7a9a; border: 1px solid #2d3548; }
.drill-inject  { background: #1e2f45; color: #60a5fa; border: 1px solid #1d4a8a; }
.drill-children { padding-left: 24px; border-left: 2px dashed #2d3548; margin: 4px 0 4px 24px; }

.pi-demo {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pi-provide, .pi-inject {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #2d3548;
}
.pi-provide { background: #1a3a2e; }
.pi-provide strong, .pi-inject strong { display: block; font-size: 13px; margin-bottom: 8px; }
.pi-provide strong { color: #42b983; }
.pi-inject strong  { color: #60a5fa; }
.pi-inject p { font-size: 13px; color: #94a3b8; margin: 4px 0; }
.pi-theme-dark  { background: #141926; border-color: #42b983; }
.pi-theme-blue  { background: #1e2f45; border-color: #3b82f6; }
.pi-theme-green { background: #1a3a2e; border-color: #22c55e; }
.pi-controls { display: flex; align-items: center; gap: 8px; }
.pi-controls label { color: #6e7a9a; font-size: 13px; }
.pi-btn {
  padding: 3px 12px;
  border: 1px solid #2d3548;
  background: #252c3b;
  color: #c9d1d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.pi-btn.active { background: #42b983; color: #fff; border-color: #42b983; }

.choice-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.choice-item { background: #1e2432; border-radius: 8px; padding: 12px; border: 1px solid #2d3548; }
.choice-scenario { font-size: 12px; color: #6e7a9a; margin-bottom: 6px; }
.choice-method { font-weight: 700; font-size: 14px; margin-bottom: 4px; padding: 2px 8px; border-radius: 4px; display: inline-block; }
.choice-reason { font-size: 12px; color: #94a3b8; margin-top: 4px; }
.cm-green  { background: #1a3a2e; color: #42b983; }
.cm-blue   { background: #1e2f45; color: #60a5fa; }
.cm-yellow { background: #2a2510; color: #fbbf24; }
.cm-purple { background: #251a35; color: #c084fc; }
.cm-red    { background: #2a1f20; color: #f87171; }
</style>
