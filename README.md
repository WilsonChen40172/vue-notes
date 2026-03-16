# Vue 2 學習專案

一個以 Vue 2 為核心、手動設定 Webpack 建置工具鏈的前端學習專案，涵蓋響應式原理、Vuex、Router 守衛、IE11 相容以及 CI/CD 知識。

## 線上預覽

> 部署於 Vercel，推送至 `main` 分支後自動觸發重新部署。

---

## 功能頁面

| 路由            | 頁面             | 說明                                                      |
| --------------- | ---------------- | --------------------------------------------------------- |
| `/reactivity`   | Vue 2 響應式原理 | Object.defineProperty、Vue.set、與 Vue 3 Proxy 比較       |
| `/vuex`         | Vuex 核心概念    | State / Mutations / Actions / Getters 分工說明與互動 Demo |
| `/router-guard` | Vue Router 守衛  | 全域守衛、路由守衛、元件守衛執行順序與權限控制 Demo       |
| `/ie11`         | IE11 相容處理    | Babel 設定、CSS Prefix、API 偵測、Polyfill Checklist      |
| `/cicd`         | CI/CD 前端知識   | CI/CD 概念、工具比較、Pipeline 流程、部署策略、常見問題   |
| `/login`        | 登入             | 模擬驗證（admin/admin 或 user/user）                      |
| `/admin`        | 管理後台         | 需登入且為 admin 角色才可存取                             |

---

## 技術棧

### 核心框架

| 套件                                         | 版本      | 用途                                                  |
| -------------------------------------------- | --------- | ----------------------------------------------------- |
| [Vue 2](https://v2.vuejs.org/)               | `^2.7.16` | 核心 UI 框架，響應式資料綁定                          |
| [Vue Router 3](https://v3.router.vuejs.org/) | `^3.6.5`  | SPA 路由管理、全域路由守衛                            |
| [Vuex 3](https://v3.vuex.vuejs.org/)         | `^3.6.2`  | 全域狀態管理（Store / Mutations / Actions / Getters） |

### 建置工具

| 套件                                                                         | 版本       | 用途                                |
| ---------------------------------------------------------------------------- | ---------- | ----------------------------------- |
| [Webpack 4](https://v4.webpack.js.org/)                                      | `^4.47.0`  | 模組打包、程式碼分割                |
| [webpack-dev-server 3](https://github.com/webpack/webpack-dev-server)        | `^3.11.3`  | 本地開發伺服器，支援 Hot Reload     |
| [webpack-cli 3](https://github.com/webpack/webpack-cli)                      | `^3.3.12`  | Webpack 命令列工具                  |
| [vue-loader 15](https://vue-loader.vuejs.org/v15/)                           | `^15.11.1` | 解析 `.vue` 單檔元件（SFC）         |
| [vue-template-compiler](https://www.npmjs.com/package/vue-template-compiler) | `^2.7.16`  | 編譯 Vue 模板，需與 vue 版本一致    |
| [html-webpack-plugin 4](https://github.com/jantimon/html-webpack-plugin)     | `^4.5.2`   | 自動生成 `index.html` 並注入 bundle |
| [css-loader 3](https://github.com/webpack-contrib/css-loader)                | `^3.6.0`   | 解析 CSS `@import` 與 `url()`       |
| [style-loader 1](https://github.com/webpack-contrib/style-loader)            | `^1.3.0`   | 將 CSS 注入 DOM `<style>` 標籤      |

### Babel / Polyfill（IE11 支援）

| 套件                                                           | 版本      | 用途                                        |
| -------------------------------------------------------------- | --------- | ------------------------------------------- |
| [@babel/core](https://babeljs.io/)                             | `^7.29.0` | Babel 核心，轉譯現代 JS 語法                |
| [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)  | `^7.29.0` | 根據目標瀏覽器自動選擇需要的語法轉換        |
| [babel-loader 8](https://github.com/babel/babel-loader)        | `^8.4.1`  | Webpack 與 Babel 的整合 loader              |
| [core-js 3](https://github.com/zloirock/core-js)               | `^3.48.0` | ES6+ API Polyfill（Promise、Array.from 等） |
| [regenerator-runtime](https://github.com/facebook/regenerator) | `^0.14.1` | async/await 的 runtime 支援                 |

**Babel 設定目標：**

```js
// babel.config.js
targets: {
  ie: "11";
}
useBuiltIns: "usage"; // 按需注入 polyfill
corejs: 3;
```

---

## 專案結構

```
vue2-260316/
├── public/
│   └── index.html           # HTML 模板
├── src/
│   ├── main.js              # 入口，掛載 polyfill / Vue 實例
│   ├── App.vue              # 根元件，全域樣式、Navbar
│   ├── router/
│   │   └── index.js         # Vue Router 設定、全域守衛
│   ├── store/
│   │   └── index.js         # Vuex Store
│   └── views/
│       ├── ReactivityPage.vue
│       ├── VuexPage.vue
│       ├── RouterGuardPage.vue
│       ├── IE11Page.vue
│       ├── CICDPage.vue
│       ├── LoginPage.vue
│       ├── AdminPage.vue
│       └── NotFound.vue
├── .gitignore
├── babel.config.js
├── package.json
├── vercel.json              # Vercel 部署設定
└── webpack.config.js
```

---

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器（http://localhost:8080）
npm run dev

# 生產模式打包（輸出至 dist/）
npm run build
```

---

## 部署

### Vercel（自動部署）

1. 將專案 push 到 GitHub
2. 在 [vercel.com](https://vercel.com) 匯入 GitHub Repo
3. Framework Preset 選 **Other**
4. 點 Deploy，之後每次 push `main` 分支自動重新部署

`vercel.json` 已設定：

- SPA rewrites（重新整理不會 404）
- `index.html` 不快取 / 靜態資源永久快取

---

## 設計

- **暗黑模式**：全站統一色票，無外部 UI 框架，純 CSS scoped styles
- **IE11 相容**：Flexbox（含 `-ms-` prefix）、無 ES6+ 未 polyfill 語法、CSS Grid 降級
- **路由守衛**：`beforeEach` 處理標題更新、登入驗證、Admin 角色檢查；`afterEach` 自動捲回頂部
