<template>
  <div>
    <h1 class="page-title">IE11 的 Polyfill / 相容處理</h1>
    <p class="page-subtitle">完整指南：讓 Vue 2 專案在 IE11 上正常運行</p>

    <!-- 1. IE11 環境概況 -->
    <div class="card">
      <h2>1. IE11 環境限制總覽</h2>
      <div class="compat-grid">
        <div class="compat-item cant">
          <h3>❌ IE11 不支援</h3>
          <ul>
            <li>ES6+ 語法（箭頭函式、解構、展開…）</li>
            <li>Promise / async-await</li>
            <li>Proxy（Vue 3 無法支援 IE11 的根本原因）</li>
            <li>fetch API</li>
            <li>CSS Variables（var(--color)）</li>
            <li>CSS Grid（部分支援，需 -ms- 前綴）</li>
            <li>Flexbox gap 屬性</li>
            <li>Array.from / Array.includes</li>
            <li>Object.assign / Object.entries</li>
            <li>Symbol、Map、Set、WeakMap</li>
          </ul>
        </div>
        <div class="compat-item can">
          <h3>✅ IE11 支援（或可 polyfill）</h3>
          <ul>
            <li>Vue 2（不使用 Proxy），需 transpile</li>
            <li>Vuex 3 / Vue Router 3</li>
            <li>ES5 語法（var、function、prototype…）</li>
            <li>XMLHttpRequest（xhr）</li>
            <li>Flexbox（需 -webkit- 前綴）</li>
            <li>CSS3 transition / transform</li>
            <li>localStorage / sessionStorage</li>
            <li>canvas</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 2. Babel 設定 -->
    <div class="card">
      <h2>2. Babel 轉譯設定（核心）</h2>
      <p>IE11 只支援 ES5，所有 ES6+ 語法都必須透過 Babel 降級編譯：</p>

      <h3>安裝</h3>
      <pre>npm install --save-dev @babel/core @babel/preset-env babel-loader
npm install --save core-js@3 regenerator-runtime</pre>

      <h3>babel.config.js（本專案使用）</h3>
      <pre>module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { ie: '11' },   // 目標瀏覽器 IE11
      useBuiltIns: 'usage',    // 按需引入 polyfill（自動偵測用到的 API）
      corejs: 3                // 指定 core-js 版本
    }]
  ]
}</pre>

      <div class="compare-block">
        <div>
          <p><strong>useBuiltIns 三個選項：</strong></p>
          <table class="small-table">
            <tr>
              <th>值</th>
              <th>說明</th>
              <th>推薦</th>
            </tr>
            <tr>
              <td><code>false</code></td>
              <td>不自動引入，需手動 import</td>
              <td></td>
            </tr>
            <tr>
              <td><code>'entry'</code></td>
              <td>入口檔引入所有 polyfill（包太多）</td>
              <td></td>
            </tr>
            <tr>
              <td><code>'usage'</code></td>
              <td>只引入用到的 polyfill（最小化打包）</td>
              <td>✅ 推薦</td>
            </tr>
          </table>
        </div>
      </div>

      <h3>main.js 入口引入</h3>
      <pre>// 必須在最頂部，確保 polyfill 先於其他程式碼
import 'core-js/stable'
import 'regenerator-runtime/runtime'  // async/await 支援

import Vue from 'vue'
// ...</pre>
    </div>

    <!-- 3. Webpack 設定 -->
    <div class="card">
      <h2>3. Webpack 相容設定</h2>

      <h3>轉譯 node_modules（重要！）</h3>
      <pre>// webpack.config.js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      // 預設排除 node_modules，但部分套件需要 transpile
      exclude: file => (
        /node_modules/.test(file) &&
        // 以下套件需要 transpile 才能在 IE11 運行
        !/node_modules\/(vue|vuex|vue-router|axios)/.test(file)
      )
    }
  ]
}</pre>

      <h3>package.json browserslist（與 Babel 整合）</h3>
      <pre>// package.json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "ie 11"   // 加入 IE11
  ]
}</pre>
    </div>

    <!-- 4. CSS 相容 -->
    <div class="card">
      <h2>4. CSS 相容處理</h2>

      <h3>Flexbox 需加 -ms- 前綴</h3>
      <pre>/* ✅ 相容 IE11 的 Flexbox 寫法 */
.container {
  display: -webkit-box;      /* 舊版 Chrome/Safari */
  display: -ms-flexbox;      /* IE11 */
  display: flex;             /* 現代瀏覽器 */

  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;

  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

/* ⚠️ gap 在 IE11 不支援，改用 margin */
/* ❌ gap: 16px; */
/* ✅ 用 margin 代替 */
.child + .child { margin-left: 16px; }</pre>

      <h3>Grid 需加 -ms- 前綴</h3>
      <pre>/* ✅ 相容 IE11 的 Grid 寫法 */
.grid {
  display: -ms-grid;         /* IE11 */
  display: grid;

  -ms-grid-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
}

/* ⚠️ IE11 的 grid 子元素需手動定位 */
.child:nth-child(1) {
  -ms-grid-column: 1;
  -ms-grid-row: 1;
}
.child:nth-child(2) {
  -ms-grid-column: 2;
  -ms-grid-row: 1;
}</pre>

      <div class="tip">
        <strong>💡 推薦：使用 postcss-preset-env 或 autoprefixer 自動補前綴</strong>
        <pre>// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['ie >= 11']
    })
  ]
}</pre>
      </div>

      <h3>CSS Variables（var()）— IE11 完全不支援</h3>
      <pre>/* ❌ IE11 無法使用 CSS 變數 */
:root { --primary: #42b983; }
.btn { color: var(--primary); }

/* ✅ 替代方案：SASS/LESS 變數（在編譯期解析） */
$primary: #42b983;
.btn { color: $primary; }</pre>
    </div>

    <!-- 5. JS API Polyfill -->
    <div class="card">
      <h2>5. 常用 JS API Polyfill 清單</h2>
      <div class="polyfill-table">
        <table>
          <thead>
            <tr>
              <th>API</th>
              <th>IE11 支援</th>
              <th>解決方案</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="api in polyfillList" :key="api.name">
              <td><code>{{ api.name }}</code></td>
              <td :class="api.support === '❌' ? 'no' : 'partial'">{{ api.support }}</td>
              <td>{{ api.solution }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 6. 互動測試 -->
    <div class="card">
      <h2>6. 當前瀏覽器 API 支援偵測</h2>
      <p class="hint">以下偵測當前瀏覽器是否支援這些 API（在 IE11 測試可看到差異）：</p>
      <div class="detect-grid">
        <div
          v-for="check in apiChecks"
          :key="check.name"
          class="detect-item"
          :class="check.supported ? 'supported' : 'unsupported'"
        >
          <span class="detect-icon">{{ check.supported ? '✅' : '❌' }}</span>
          <span class="detect-name">{{ check.name }}</span>
        </div>
      </div>

      <h3 style="margin-top: 16px;">IE11 識別</h3>
      <div class="ie-detect">
        <div :class="isIE11 ? 'ie-yes' : 'ie-no'">
          {{ isIE11 ? '⚠️ 當前為 IE11 瀏覽器' : '✅ 非 IE11（現代瀏覽器）' }}
        </div>
        <p class="hint">User Agent: {{ userAgent }}</p>
      </div>
    </div>

    <!-- 7. Vue CLI 設定 -->
    <div class="card">
      <h2>7. Vue CLI 專案的 IE11 設定（補充）</h2>
      <pre>// vue.config.js（如使用 Vue CLI）
module.exports = {
  transpileDependencies: [
    // 需要 transpile 的 node_modules
    'vuex',
    'vue-router',
    'axios'
  ]
}

// 搭配 package.json browserslist
// "browserslist": ["ie 11", "> 1%", "last 2 versions"]</pre>

      <h3>IE11 HTML 頁面必備 meta</h3>
      <pre>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;!-- 告訴 IE 使用最新的渲染引擎 --&gt;
  &lt;meta http-equiv="X-UA-Compatible" content="IE=edge" /&gt;
  &lt;meta charset="UTF-8" /&gt;
&lt;/head&gt;</pre>

      <div class="summary-box">
        <h3>IE11 相容處理 Checklist</h3>
        <div v-for="item in checklist" :key="item.text" class="check-item">
          <span class="check-icon">{{ item.done ? '✅' : '⬜' }}</span>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IE11Page',
  data() {
    return {
      polyfillList: [
        { name: 'Promise',         support: '❌', solution: 'core-js@3（自動引入）' },
        { name: 'async/await',     support: '❌', solution: 'regenerator-runtime + Babel' },
        { name: 'fetch',           support: '❌', solution: 'whatwg-fetch 或改用 axios' },
        { name: 'Array.from',      support: '❌', solution: 'core-js@3（自動引入）' },
        { name: 'Array.includes',  support: '❌', solution: 'core-js@3（自動引入）' },
        { name: 'Object.assign',   support: '❌', solution: 'core-js@3（自動引入）' },
        { name: 'Object.entries',  support: '❌', solution: 'core-js@3（自動引入）' },
        { name: 'Symbol',          support: '❌', solution: 'core-js@3（自動引入）' },
        { name: 'Map / Set',       support: '⚠️', solution: 'core-js@3（完整 polyfill）' },
        { name: 'WeakMap',         support: '⚠️', solution: 'core-js@3（自動引入）' },
        { name: 'CustomEvent',     support: '⚠️', solution: '手動 polyfill' },
        { name: 'URLSearchParams', support: '❌', solution: 'url-search-params-polyfill' },
        { name: 'Element.closest', support: '❌', solution: 'core-js@3' },
        { name: 'NodeList.forEach',support: '❌', solution: 'core-js@3 或手動 polyfill' }
      ],
      checklist: [
        { text: 'babel.config.js 設定 targets: { ie: 11 }', done: true },
        { text: 'useBuiltIns: "usage" + corejs: 3', done: true },
        { text: 'main.js 頂部引入 core-js/stable + regenerator-runtime', done: true },
        { text: 'HTML 加上 <meta http-equiv="X-UA-Compatible" content="IE=edge">', done: true },
        { text: 'Flexbox 加上 -ms-flexbox 前綴', done: true },
        { text: 'Grid 加上 -ms-grid 前綴（或避免使用）', done: true },
        { text: '避免使用 CSS Variables（用 SCSS 變數代替）', done: true },
        { text: 'fetch 改用 axios（已支援 IE11）', done: false },
        { text: 'Vue 3 / Vite 不支援 IE11，必須使用 Vue 2', done: true },
        { text: 'autoprefixer 自動補 CSS 前綴', done: false }
      ]
    }
  },
  computed: {
    userAgent() {
      return navigator.userAgent
    },
    isIE11() {
      return navigator.userAgent.indexOf('Trident/') > -1
    },
    apiChecks() {
      return [
        { name: 'Promise',          supported: typeof Promise !== 'undefined' },
        { name: 'fetch',            supported: typeof fetch !== 'undefined' },
        { name: 'Array.from',       supported: typeof Array.from === 'function' },
        { name: 'Array.includes',   supported: typeof [].includes === 'function' },
        { name: 'Object.assign',    supported: typeof Object.assign === 'function' },
        { name: 'Symbol',           supported: typeof Symbol !== 'undefined' },
        { name: 'Map',              supported: typeof Map !== 'undefined' },
        { name: 'Set',              supported: typeof Set !== 'undefined' },
        { name: 'WeakMap',          supported: typeof WeakMap !== 'undefined' },
        { name: 'Proxy',            supported: typeof Proxy !== 'undefined' },
        { name: 'async/await',      supported: (function() { try { eval("async function t(){}"); return true; } catch(e) { return false; } })() },
        { name: 'CSS Variables',    supported: window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--test)') },
        { name: 'URLSearchParams',  supported: typeof URLSearchParams !== 'undefined' }
      ]
    }
  }
}
</script>

<style scoped>
.compat-grid { display: -ms-grid; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.compat-item { border-radius: 8px; padding: 16px; }
.cant { background: #2a1f20; border: 1px solid #5a2d2e; }
.can  { background: #1a3a2e; border: 1px solid #1e6e4e; }
.compat-item ul { padding-left: 18px; margin-top: 8px; }
.compat-item li { margin: 4px 0; font-size: 13px; line-height: 1.6; }

.compare-block { margin: 12px 0; }
.small-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
.small-table th, .small-table td {
  padding: 6px 12px;
  border: 1px solid #2d3548;
  font-size: 13px;
}
.small-table th { background: #131720; color: #e2e8f0; }

.tip {
  background: #2a2510;
  border-left: 4px solid #f39c12;
  padding: 12px 16px;
  border-radius: 0 6px 6px 0;
  margin: 12px 0;
}

.polyfill-table { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px 12px; border: 1px solid #2d3548; font-size: 13px; }
th { background: #131720; color: #e2e8f0; }
tr:nth-child(even) { background: #131720; }
.no      { color: #f87171; font-weight: 600; }
.partial { color: #fbbf24; font-weight: 600; }

.detect-grid {
  display: -ms-grid;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  margin-top: 12px;
}
.detect-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
}
.supported   { background: #1a3a2e; color: #4ade80; }
.unsupported { background: #2a1f20; color: #f87171; }
.detect-name { font-family: monospace; }

.ie-detect { margin-top: 8px; }
.ie-yes {
  background: #2a1f20;
  border: 1px solid #5a2d2e;
  border-radius: 6px;
  padding: 10px 14px;
  color: #f87171;
  font-weight: 600;
}
.ie-no {
  background: #1a3a2e;
  border: 1px solid #1e6e4e;
  border-radius: 6px;
  padding: 10px 14px;
  color: #4ade80;
  font-weight: 600;
}
.hint { color: #6e7a9a; font-size: 12px; margin-top: 6px; word-break: break-all; }

.summary-box {
  background: #252c3b;
  border: 1px solid #2d3548;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}
.summary-box h3 { margin-bottom: 12px; color: #e2e8f0; }
.check-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  font-size: 13px;
  border-bottom: 1px solid #2d3548;
}
.check-icon { font-size: 16px; }
</style>
