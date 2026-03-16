<template>
  <div>
    <h1 class="page-title">CI/CD 前端必知知識</h1>
    <p class="page-subtitle">從程式碼提交到部署上線的自動化流程，前端工程師需要了解的核心概念</p>

    <!-- 1. 什麼是 CI/CD -->
    <div class="card">
      <h2>1. 什麼是 CI/CD？</h2>
      <div class="concept-grid">
        <div class="concept-item ci">
          <div class="concept-icon">🔄</div>
          <h3>CI — 持續整合<br><small>Continuous Integration</small></h3>
          <p>每次 push / PR 時自動執行：<strong>建置 → 測試 → 分析</strong>，確保新程式碼不影響主線</p>
          <ul>
            <li>自動執行 <code>npm install</code> + <code>npm run build</code></li>
            <li>跑 ESLint / TypeScript 型別檢查</li>
            <li>跑單元測試 / E2E 測試</li>
            <li>失敗時阻止 PR merge</li>
          </ul>
        </div>
        <div class="concept-item cd-deliver">
          <div class="concept-icon">📦</div>
          <h3>CD — 持續交付<br><small>Continuous Delivery</small></h3>
          <p>CI 通過後，自動將產物部署到<strong>測試環境</strong>，需人工批准才上正式環境</p>
          <ul>
            <li>自動部署到 staging 環境</li>
            <li>讓 QA / PM 驗收</li>
            <li>人工按鍵觸發正式部署</li>
          </ul>
        </div>
        <div class="concept-item cd-deploy">
          <div class="concept-icon">🚀</div>
          <h3>CD — 持續部署<br><small>Continuous Deployment</small></h3>
          <p>更激進：測試全通過就<strong>自動部署到正式環境</strong>，無需人工介入</p>
          <ul>
            <li>完全自動化的交付鏈</li>
            <li>需要非常完整的測試覆蓋</li>
            <li>適合 SaaS 產品快速迭代</li>
          </ul>
        </div>
      </div>

      <div class="pipeline-flow">
        <div class="pf-step pf-code">
          <span>💻</span>
          <strong>git push</strong>
          <small>觸發 CI</small>
        </div>
        <div class="pf-arrow">→</div>
        <div class="pf-step pf-build">
          <span>🔨</span>
          <strong>Build</strong>
          <small>npm run build</small>
        </div>
        <div class="pf-arrow">→</div>
        <div class="pf-step pf-test">
          <span>🧪</span>
          <strong>Test</strong>
          <small>lint + unit + e2e</small>
        </div>
        <div class="pf-arrow">→</div>
        <div class="pf-step pf-staging">
          <span>🌐</span>
          <strong>Staging</strong>
          <small>自動部署測試環境</small>
        </div>
        <div class="pf-arrow">→</div>
        <div class="pf-step pf-prod">
          <span>✅</span>
          <strong>Production</strong>
          <small>部署正式環境</small>
        </div>
      </div>
    </div>

    <!-- 2. 常見 CI/CD 工具 -->
    <div class="card">
      <h2>2. 常見 CI/CD 工具比較</h2>
      <div class="tools-grid">
        <div
          v-for="tool in tools"
          :key="tool.name"
          class="tool-card"
          :class="{ active: activeTool === tool.name }"
          @click="activeTool = tool.name"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <div class="tool-name">{{ tool.name }}</div>
          <div class="tool-used">{{ tool.usedBy }}</div>
        </div>
      </div>

      <div v-if="activeTool" class="tool-detail">
        <div v-for="tool in tools" :key="tool.name" v-show="activeTool === tool.name">
          <h3>{{ tool.icon }} {{ tool.name }}</h3>
          <div class="tool-info-grid">
            <div>
              <strong>適用場景</strong>
              <p>{{ tool.scenario }}</p>
            </div>
            <div>
              <strong>前端常見用途</strong>
              <ul>
                <li v-for="u in tool.frontendUse" :key="u">{{ u }}</li>
              </ul>
            </div>
          </div>
          <pre>{{ tool.example }}</pre>
        </div>
      </div>
    </div>

    <!-- 3. 前端 CI 流程 -->
    <div class="card">
      <h2>3. 前端專案標準 CI 流程</h2>
      <div class="ci-steps">
        <div v-for="(step, i) in ciSteps" :key="i" class="ci-step">
          <div class="ci-step-num">{{ i + 1 }}</div>
          <div class="ci-step-content">
            <strong>{{ step.name }}</strong>
            <span class="ci-step-cmd"><code>{{ step.cmd }}</code></span>
            <p>{{ step.desc }}</p>
          </div>
          <span :class="`ci-badge ci-${step.type}`">{{ step.type }}</span>
        </div>
      </div>

      <h3>GitHub Actions 完整前端 CI 範例</h3>
      <pre v-pre># .github/workflows/ci.yml
name: Frontend CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'           # 快取 node_modules，加快速度

      - name: Install dependencies
        run: npm ci               # 比 npm install 更嚴格，使用 package-lock.json

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check   # TypeScript 專案

      - name: Unit tests
        run: npm run test:unit -- --coverage

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          VUE_APP_API_URL: ${{ secrets.API_URL }}  # 從 GitHub Secrets 注入

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/</pre>
    </div>

    <!-- 4. 環境變數管理 -->
    <div class="card">
      <h2>4. 前端環境變數管理（重要！）</h2>
      <p>CI/CD 中最常踩到的坑：不同環境要用不同的 API URL、Feature Flag 等設定</p>

      <h3>Vue 2 / Vue CLI 的環境變數</h3>
      <pre># .env.development（本地開發）
VUE_APP_API_URL=http://localhost:3000
VUE_APP_ENV=development

# .env.staging（測試環境）
VUE_APP_API_URL=https://api-staging.example.com
VUE_APP_ENV=staging

# .env.production（正式環境）
VUE_APP_API_URL=https://api.example.com
VUE_APP_ENV=production</pre>

      <div class="env-rules">
        <div class="env-rule env-must">
          <strong>⚠️ Vue 2 規則：必須以 VUE_APP_ 開頭</strong>
          <p>只有 <code>VUE_APP_</code> 前綴的變數才會被打包進前端 bundle</p>
        </div>
        <div class="env-rule env-never">
          <strong>🔐 絕對不要放進前端的資訊</strong>
          <ul>
            <li>資料庫連線字串</li>
            <li>後端 API 私鑰 / Secret</li>
            <li>第三方服務 Secret Key（非 Public Key）</li>
          </ul>
          <small>前端 bundle 是公開的，任何人都能看到原始碼！</small>
        </div>
      </div>

      <h3>在 CI 中注入環境變數</h3>
      <pre v-pre># GitHub Actions：從 Secrets 注入
- name: Build
  run: npm run build
  env:
    VUE_APP_API_URL: ${{ secrets.STAGING_API_URL }}

# GitLab CI：從 CI/CD Variables 注入
build:
  script:
    - npm run build
  variables:
    VUE_APP_API_URL: $CI_VUE_APP_API_URL</pre>
    </div>

    <!-- 5. 部署策略 -->
    <div class="card">
      <h2>5. 前端部署策略</h2>
      <div class="deploy-tabs">
        <button
          v-for="tab in deployTabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeDeployTab === tab.id }"
          @click="activeDeployTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-show="activeDeployTab === 'static'" class="tab-content">
        <h3>靜態資源部署（最常見）</h3>
        <p>Vue build 產出的 <code>dist/</code> 資料夾是純靜態檔案，可部署到任何靜態托管平台</p>
        <div class="deploy-options">
          <div class="deploy-option">
            <strong>Nginx</strong>
            <pre>server {
  listen 80;
  root /var/www/dist;
  index index.html;

  # SPA 必須：所有路徑都回傳 index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # 靜態資源長期快取
  location ~* \.(js|css|png|jpg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}</pre>
          </div>
          <div class="deploy-option">
            <strong>GitHub Pages / Netlify / Vercel</strong>
            <pre># netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"    # SPA 路由必備
  status = 200</pre>
          </div>
        </div>
      </div>

      <div v-show="activeDeployTab === 'docker'" class="tab-content">
        <h3>Docker 容器化部署</h3>
        <pre># Dockerfile（多階段建置，最佳化 image 大小）
# ── 第一階段：Build ──
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # 安裝依賴
COPY . .
RUN npm run build             # 建置產物

# ── 第二階段：Serve ──
FROM nginx:alpine             # 只需要 nginx，不需要 node
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]</pre>
        <div class="tip">
          <strong>💡 多階段建置的好處：</strong>
          最終 image 只包含 nginx + dist 靜態檔，不含 node_modules（大小從 ~600MB → ~20MB）
        </div>
      </div>

      <div v-show="activeDeployTab === 'cdn'" class="tab-content">
        <h3>CDN + Hash 版本控制</h3>
        <pre># webpack 設定：output filename 加 contenthash
output: {
  filename: 'js/[name].[contenthash:8].js',
  chunkFilename: 'js/[name].[contenthash:8].chunk.js'
}

# 建置後產出（hash 根據內容生成，內容不變 hash 不變）
dist/
  js/
    app.3f6a9b2c.js     # 主程式
    vendors.a1b2c3d4.js # 第三方依賴（不常變動）
  css/
    app.8e1f2a3b.css
  index.html            # 永遠不快取！</pre>
        <div class="cache-strategy">
          <div class="cache-item cache-never">
            <code>index.html</code>
            <span>Cache-Control: no-cache</span>
            <small>每次都要重新請求，確保拿到最新的 JS/CSS 路徑</small>
          </div>
          <div class="cache-item cache-long">
            <code>*.{js,css}</code>
            <span>Cache-Control: max-age=31536000, immutable</span>
            <small>hash 不變就永久快取；有更新 hash 就變動，強制瀏覽器重新下載</small>
          </div>
        </div>
      </div>

      <div v-show="activeDeployTab === 'bluegreen'" class="tab-content">
        <h3>藍綠部署 / 金絲雀發布</h3>
        <div class="strategy-grid">
          <div class="strategy-item">
            <h4>🔵🟢 藍綠部署（Blue-Green）</h4>
            <p>同時維持兩套完整環境，切換流量實現零停機部署</p>
            <ul>
              <li>Blue（舊版）持續跑線上流量</li>
              <li>Green（新版）部署並驗證</li>
              <li>Load Balancer 切換 100% 流量到 Green</li>
              <li>若發生問題，秒回切到 Blue</li>
            </ul>
          </div>
          <div class="strategy-item">
            <h4>🐤 金絲雀發布（Canary）</h4>
            <p>漸進式放量，降低新版風險</p>
            <ul>
              <li>先讓 5% 流量走新版</li>
              <li>監控錯誤率、效能指標</li>
              <li>沒問題再逐步擴大到 100%</li>
              <li>前端常搭配 Feature Flag 使用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 快取 & 版本問題 -->
    <div class="card">
      <h2>6. 前端部署常見問題</h2>
      <div class="issues-list">
        <div v-for="issue in commonIssues" :key="issue.title" class="issue-item">
          <div class="issue-header" @click="issue.open = !issue.open">
            <span class="issue-icon">{{ issue.open ? '▼' : '▶' }}</span>
            <strong>{{ issue.title }}</strong>
            <span :class="`issue-level issue-${issue.level}`">{{ issue.level }}</span>
          </div>
          <div v-show="issue.open" class="issue-body">
            <p>{{ issue.desc }}</p>
            <pre>{{ issue.solution }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. 前端效能監控 -->
    <div class="card">
      <h2>7. 部署後的效能監控 Checklist</h2>
      <div class="monitor-grid">
        <div class="monitor-item" v-for="item in monitorItems" :key="item.name">
          <div class="monitor-icon">{{ item.icon }}</div>
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.desc }}</p>
            <small>工具：{{ item.tool }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CICDPage',
  data() {
    return {
      activeTool: 'GitHub Actions',
      activeDeployTab: 'static',
      tools: [
        {
          name: 'GitHub Actions',
          icon: '⚙️',
          usedBy: 'GitHub 專案首選',
          scenario: '直接整合 GitHub，零設定成本，免費額度充裕，適合開源或中小型團隊',
          frontendUse: [
            'PR 自動跑 lint + build + test',
            '推 main 分支自動部署到 Vercel / Netlify',
            '自動發布 npm 套件'
          ],
          example: `# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist`
        },
        {
          name: 'GitLab CI',
          icon: '🦊',
          usedBy: '企業私有部署常見',
          scenario: '內建於 GitLab，適合自架 GitLab 的企業，Pipeline 設定彈性高',
          frontendUse: [
            '多環境 Pipeline（dev → staging → prod）',
            '手動觸發正式部署',
            'Docker image 建置推送'
          ],
          example: `# .gitlab-ci.yml
stages:
  - install
  - test
  - build
  - deploy

install:
  stage: install
  script: npm ci
  cache:
    paths: [node_modules/]

build:
  stage: build
  script: npm run build
  artifacts:
    paths: [dist/]`
        },
        {
          name: 'Jenkins',
          icon: '🏗️',
          usedBy: '老牌企業 / 高度客製化',
          scenario: '插件生態豐富、高度可客製，但需自行維護伺服器，設定複雜',
          frontendUse: [
            '對接公司內部系統（LDAP、Jira 等）',
            '複雜的多專案依賴 Pipeline',
            '舊有系統的 CI 整合'
          ],
          example: `// Jenkinsfile (Declarative Pipeline)
pipeline {
  agent any
  stages {
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Test') {
      steps { sh 'npm run test' }
    }
    stage('Build') {
      steps { sh 'npm run build' }
    }
  }
}`
        },
        {
          name: 'Vercel / Netlify',
          icon: '☁️',
          usedBy: '前端靜態網站首選',
          scenario: 'Preview Deploy 最強，每個 PR 自動產生預覽網址，前端體驗極佳',
          frontendUse: [
            'PR Preview Deploy（每個分支有獨立網址）',
            '自動 HTTPS + CDN',
            'Serverless Functions'
          ],
          example: `# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VUE_APP_API_URL": "@api-url"
  }
}`
        }
      ],
      ciSteps: [
        { name: '安裝依賴', cmd: 'npm ci', desc: '使用 npm ci 而非 npm install，保證依賴版本與 package-lock.json 完全一致', type: 'install' },
        { name: 'Lint 檢查', cmd: 'npm run lint', desc: '靜態程式碼分析，確保 coding style 一致，提前發現潛在 bug', type: 'check' },
        { name: '型別檢查', cmd: 'npm run type-check', desc: 'TypeScript 專案必備，CI 中型別錯誤要能中斷流程', type: 'check' },
        { name: '單元測試', cmd: 'npm run test:unit', desc: '跑 Jest / Vitest，確保元件邏輯正確，建議要求 coverage >= 80%', type: 'test' },
        { name: 'E2E 測試', cmd: 'npm run test:e2e', desc: '跑 Cypress / Playwright，模擬真實用戶操作，通常只在 main 分支跑', type: 'test' },
        { name: 'Build 打包', cmd: 'npm run build', desc: '生產模式打包，Tree Shaking、Minify、產出 dist/', type: 'build' },
        { name: '部署', cmd: 'deploy script', desc: '將 dist/ 上傳到 CDN / Server / Docker Registry', type: 'deploy' }
      ],
      deployTabs: [
        { id: 'static',   label: '靜態托管' },
        { id: 'docker',   label: 'Docker' },
        { id: 'cdn',      label: 'CDN 快取策略' },
        { id: 'bluegreen',label: '藍綠/金絲雀' }
      ],
      commonIssues: [
        {
          title: '用戶看到舊版頁面（快取問題）',
          level: '高頻',
          open: false,
          desc: '部署新版後，用戶瀏覽器快取了舊的 index.html，導致載入的仍是舊版 JS/CSS',
          solution: `# Nginx：index.html 禁止快取
location = /index.html {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
  add_header Pragma "no-cache";
}

# JS/CSS：使用 contenthash，讓瀏覽器強制更新
# webpack 設定 filename: '[name].[contenthash:8].js'`
        },
        {
          title: 'SPA 重新整理頁面出現 404',
          level: '高頻',
          open: false,
          desc: 'Vue Router history 模式下，直接訪問 /about 等路徑，Server 找不到對應檔案',
          solution: `# Nginx：所有路徑都回傳 index.html
location / {
  try_files $uri $uri/ /index.html;
}

# Apache：.htaccess
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]`
        },
        {
          title: '環境變數沒有生效',
          level: '常見',
          open: false,
          desc: 'CI build 時使用了錯誤的環境變數，或變數名沒有 VUE_APP_ 前綴',
          solution: `# 檢查變數名前綴（Vue CLI 必須 VUE_APP_）
VUE_APP_API_URL=...   ✅
API_URL=...           ❌（不會被打包）

# CI 中確認注入
- run: echo $VUE_APP_API_URL  # 先確認有沒有值
- run: npm run build`
        },
        {
          title: 'Build 成功但 Runtime 出錯',
          level: '常見',
          open: false,
          desc: '本機正常，CI build 通過，但部署後網頁報錯。常見原因：node 版本不一致、缺少 Polyfill',
          solution: `# 在 CI 固定 Node.js 版本
- uses: actions/setup-node@v3
  with:
    node-version: '18.17.0'  # 指定精確版本，避免 .x 帶來差異

# 使用 .nvmrc 或 engines 欄位統一版本
# package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}`
        },
        {
          title: 'node_modules 快取失效導致 CI 很慢',
          level: '效能',
          open: false,
          desc: '每次 CI 都從頭安裝 node_modules，尤其大型專案非常耗時',
          solution: `# GitHub Actions：善用快取
- uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'          # 自動快取 npm cache

# 或手動設定
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: \${{ runner.os }}-npm-\${{ hashFiles('package-lock.json') }}`
        }
      ],
      monitorItems: [
        { icon: '⚡', name: 'Core Web Vitals', desc: 'LCP、FID/INP、CLS 三大指標，影響 Google SEO 排名', tool: 'Google PageSpeed Insights、Lighthouse CI' },
        { icon: '📦', name: 'Bundle Size', desc: '監控打包大小，防止引入大型套件造成載入變慢', tool: 'bundlesize、size-limit、webpack-bundle-analyzer' },
        { icon: '🐛', name: '前端錯誤監控', desc: '捕獲線上 JS 錯誤、Promise rejection，搭配 Source Map 還原堆疊', tool: 'Sentry、Datadog RUM、LogRocket' },
        { icon: '📊', name: '使用者行為分析', desc: '了解用戶流量、頁面停留時間、轉換率', tool: 'Google Analytics 4、Mixpanel' },
        { icon: '🔔', name: '部署通知', desc: 'CI/CD 結果自動推播到 Slack / Teams，讓團隊即時知道', tool: 'GitHub Actions + Slack Webhook' },
        { icon: '🌡️', name: 'Lighthouse CI', desc: '在 CI Pipeline 中自動跑 Lighthouse，效能退步就阻止 merge', tool: 'lighthouse-ci（LHCI）' }
      ]
    }
  }
}
</script>

<style scoped>
.concept-grid {
  display: -ms-grid;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.concept-item {
  border-radius: 8px;
  padding: 16px;
  border-top: 3px solid transparent;
}
.concept-item h3 { font-size: 15px; margin: 8px 0; color: #e2e8f0; }
.concept-item h3 small { font-size: 11px; color: #6e7a9a; display: block; font-weight: 400; }
.concept-item p { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
.concept-item ul { padding-left: 16px; }
.concept-item li { font-size: 13px; margin: 3px 0; color: #c9d1d9; }
.concept-icon { font-size: 28px; }
.ci          { background: #1a2535; border-color: #3498db; }
.cd-deliver  { background: #2a2010; border-color: #f39c12; }
.cd-deploy   { background: #1a3a2e; border-color: #42b983; }

.pipeline-flow {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  gap: 4px;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  background: #131720;
  border-radius: 8px;
  padding: 20px;
}
.pf-step {
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
  gap: 4px;
  padding: 10px 14px;
  border-radius: 8px;
  min-width: 90px;
}
.pf-step span { font-size: 22px; }
.pf-step strong { font-size: 13px; color: #e2e8f0; }
.pf-step small { font-size: 11px; color: #6e7a9a; text-align: center; }
.pf-code    { background: #1e2f45; }
.pf-build   { background: #2a2510; }
.pf-test    { background: #251a35; }
.pf-staging { background: #1a3a2e; }
.pf-prod    { background: #1a3a20; border: 1px solid #42b983; }
.pf-arrow   { color: #4a5568; font-size: 18px; font-weight: bold; }

.tools-grid {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  gap: 10px;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.tool-card {
  background: #252c3b;
  border: 2px solid #2d3548;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  text-align: center;
  min-width: 120px;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}
.tool-card:hover { border-color: #42b983; }
.tool-card.active { border-color: #42b983; background: #1a3a2e; }
.tool-icon  { font-size: 24px; }
.tool-name  { font-size: 13px; font-weight: 600; color: #e2e8f0; margin-top: 4px; }
.tool-used  { font-size: 11px; color: #6e7a9a; margin-top: 2px; }

.tool-detail { background: #131720; border-radius: 8px; padding: 16px; border: 1px solid #2d3548; }
.tool-detail h3 { color: #e2e8f0; margin-bottom: 12px; }
.tool-info-grid {
  display: -ms-grid;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;
}
.tool-info-grid strong { font-size: 13px; color: #94a3b8; display: block; margin-bottom: 4px; }
.tool-info-grid p, .tool-info-grid li { font-size: 13px; color: #c9d1d9; }
.tool-info-grid ul { padding-left: 16px; }

.ci-steps { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ci-step {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 12px;
  background: #252c3b;
  border-radius: 6px;
  padding: 10px 14px;
}
.ci-step-num {
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
  font-weight: 700;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.ci-step-content { -webkit-box-flex: 1; -ms-flex: 1; flex: 1; }
.ci-step-content strong { display: block; color: #e2e8f0; font-size: 14px; }
.ci-step-content p { font-size: 12px; color: #6e7a9a; margin-top: 2px; }
.ci-step-cmd { margin-left: 8px; }
.ci-step-cmd code { background: #0d1117; color: #4ade80; padding: 1px 6px; border-radius: 3px; font-size: 12px; }
.ci-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.ci-install { background: #1e2f45; color: #60a5fa; }
.ci-check   { background: #2a2510; color: #fbbf24; }
.ci-test    { background: #251a35; color: #c084fc; }
.ci-build   { background: #1a3a2e; color: #4ade80; }
.ci-deploy  { background: #3a1f20; color: #f87171; }

.env-rules { display: -ms-grid; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 12px 0 16px; }
.env-rule { border-radius: 6px; padding: 14px; }
.env-must  { background: #2a2510; border: 1px solid #5a4010; }
.env-never { background: #2a1f20; border: 1px solid #5a2d2e; }
.env-rule strong { display: block; margin-bottom: 6px; font-size: 13px; }
.env-rule p, .env-rule li { font-size: 13px; color: #c9d1d9; }
.env-rule ul { padding-left: 16px; margin-top: 4px; }
.env-rule small { font-size: 11px; color: #f87171; margin-top: 6px; display: block; }

.deploy-tabs { display: -webkit-box; display: -ms-flexbox; display: flex; gap: 8px; margin-bottom: 16px; -ms-flex-wrap: wrap; flex-wrap: wrap; }
.tab-btn {
  padding: 7px 16px;
  border: 2px solid #2d3548;
  background: #252c3b;
  color: #c9d1d9;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}
.tab-btn.active { background: #42b983; color: #fff; border-color: #42b983; }
.tab-content { margin-top: 8px; }

.deploy-options { display: -ms-grid; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; }
.deploy-option strong { display: block; color: #e2e8f0; margin-bottom: 8px; }

.tip {
  background: #2a2510;
  border-left: 4px solid #f39c12;
  padding: 12px 16px;
  border-radius: 0 6px 6px 0;
  margin-top: 12px;
  font-size: 13px;
}

.cache-strategy { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; gap: 8px; margin-top: 12px; }
.cache-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 6px;
}
.cache-item code { font-size: 13px; min-width: 100px; color: #4ade80; }
.cache-item span { font-size: 12px; color: #fbbf24; -webkit-box-flex: 1; -ms-flex: 1; flex: 1; }
.cache-item small { font-size: 11px; color: #6e7a9a; }
.cache-never { background: #3a1f20; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; }
.cache-long  { background: #1a3a2e; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; }

.strategy-grid { display: -ms-grid; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.strategy-item { background: #252c3b; border-radius: 8px; padding: 16px; border: 1px solid #2d3548; }
.strategy-item h4 { color: #e2e8f0; margin-bottom: 8px; font-size: 14px; }
.strategy-item p { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
.strategy-item ul { padding-left: 16px; }
.strategy-item li { font-size: 13px; color: #c9d1d9; margin: 3px 0; }

.issues-list { display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; gap: 8px; }
.issue-item { background: #252c3b; border-radius: 6px; overflow: hidden; border: 1px solid #2d3548; }
.issue-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.issue-header:hover { background: #2d3548; }
.issue-icon { color: #6e7a9a; font-size: 12px; }
.issue-header strong { -webkit-box-flex: 1; -ms-flex: 1; flex: 1; font-size: 14px; color: #e2e8f0; }
.issue-level { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.issue-高頻 { background: #3a1f20; color: #f87171; }
.issue-常見 { background: #2a2510; color: #fbbf24; }
.issue-效能 { background: #1e2f45; color: #60a5fa; }
.issue-body { padding: 0 16px 14px; }
.issue-body p { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }

.monitor-grid {
  display: -ms-grid;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.monitor-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  gap: 12px;
  background: #252c3b;
  border-radius: 8px;
  padding: 14px;
  border: 1px solid #2d3548;
}
.monitor-icon { font-size: 28px; -webkit-flex-shrink: 0; -ms-flex-negative: 0; flex-shrink: 0; }
.monitor-item strong { display: block; color: #e2e8f0; margin-bottom: 4px; font-size: 14px; }
.monitor-item p { font-size: 13px; color: #94a3b8; margin-bottom: 4px; }
.monitor-item small { font-size: 11px; color: #42b983; }
</style>
