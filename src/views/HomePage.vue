<template>
  <div>
    <div class="home-hero">
      <div class="hero-badge">Vue 2 學習專案</div>
      <h1 class="hero-title">前端核心知識地圖</h1>
      <p class="hero-sub">涵蓋 Vue 2 底層原理、狀態管理、路由守衛、瀏覽器相容到 CI/CD 自動化部署，點選卡片開始閱讀</p>
    </div>

    <div class="card-grid">
      <router-link
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        class="home-card"
      >
        <div class="card-icon">{{ card.icon }}</div>
        <div class="card-body">
          <div class="card-tag">{{ card.tag }}</div>
          <h2 class="card-title">{{ card.title }}</h2>
          <p class="card-desc">{{ card.desc }}</p>
          <ul class="card-topics">
            <li v-for="t in card.topics" :key="t">{{ t }}</li>
          </ul>
        </div>
        <div class="card-arrow">→</div>
      </router-link>
    </div>

    <div class="home-footer">
      <p>Vue <strong>2.7.16</strong> · Vuex <strong>3</strong> · Vue Router <strong>3</strong> · Webpack <strong>4</strong> · Babel IE11</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      cards: [
        {
          to: '/reactivity',
          icon: '⚡',
          tag: 'Vue 2 Core',
          title: '響應式原理',
          desc: 'Vue 2 如何透過 Object.defineProperty 攔截資料讀寫，實現畫面自動更新',
          topics: ['getter / setter 劫持', 'Dep 依賴收集 & Watcher', 'Vue.set / $set 使用場景', 'Vue 3 Proxy 比較']
        },
        {
          to: '/vuex',
          icon: '🗃️',
          tag: 'State Management',
          title: 'Vuex 核心概念',
          desc: '大型應用的全域狀態管理，理解 Vuex 四大角色的分工與資料流向',
          topics: ['State — 單一數據源', 'Mutations — 同步更新', 'Actions — 非同步操作', 'Getters — 衍生計算']
        },
        {
          to: '/router-guard',
          icon: '🛡️',
          tag: 'Vue Router',
          title: 'Router 守衛',
          desc: '路由跳轉時的攔截機制，實現登入驗證、權限控制與頁面標題管理',
          topics: ['beforeEach 全域守衛', '路由獨享 beforeEnter', '元件內 beforeRouteLeave', '守衛執行順序']
        },
        {
          to: '/ie11',
          icon: '🌐',
          tag: 'Compatibility',
          title: 'IE11 相容處理',
          desc: '讓 Vue 2 專案在 IE11 正常執行所需的完整設定與 Polyfill 策略',
          topics: ['Babel preset-env 設定', 'core-js@3 Polyfill', 'CSS Flexbox -ms- 前綴', 'ES6+ API 偵測']
        },
        {
          to: '/cicd',
          icon: '🚀',
          tag: 'DevOps',
          title: 'CI/CD 前端知識',
          desc: '從 git push 到自動部署上線，前端工程師需要掌握的 CI/CD 核心流程',
          topics: ['GitHub Actions Workflow', '環境變數管理', 'Docker 多階段建置', '快取策略 & 藍綠部署']
        }
      ]
    }
  }
}
</script>

<style scoped>
.home-hero {
  text-align: center;
  padding: 52px 16px 40px;
}
.hero-badge {
  display: inline-block;
  background: #1a3a2e;
  color: #42b983;
  border: 1px solid #2d6a4f;
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 12px;
}
.hero-sub {
  color: #6e7a9a;
  font-size: 15px;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

.card-grid {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 14px;
}

.home-card {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  gap: 20px;
  background: #1a1f2e;
  border: 1px solid #2d3548;
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  -webkit-transition: border-color 0.2s, background 0.2s, -webkit-transform 0.15s;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  cursor: pointer;
}
.home-card:hover {
  border-color: #42b983;
  background: #1e2a3a;
  -webkit-transform: translateY(-2px);
  -ms-transform: translateY(-2px);
  transform: translateY(-2px);
}

.card-icon {
  font-size: 36px;
  line-height: 1;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  margin-top: 2px;
}

.card-body {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.card-tag {
  display: inline-block;
  background: #252c3b;
  color: #6e7a9a;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 6px;
}
.card-desc {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 10px;
}
.card-topics {
  list-style: none;
  padding: 0;
  margin: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  gap: 6px;
}
.card-topics li {
  background: #252c3b;
  border: 1px solid #2d3548;
  color: #c9d1d9;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
}
.home-card:hover .card-topics li {
  border-color: #3d5a4a;
}

.card-arrow {
  font-size: 20px;
  color: #2d3548;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-transition: color 0.2s, -webkit-transform 0.2s;
  transition: color 0.2s, transform 0.2s;
  margin-top: 4px;
}
.home-card:hover .card-arrow {
  color: #42b983;
  -webkit-transform: translateX(4px);
  -ms-transform: translateX(4px);
  transform: translateX(4px);
}

.home-footer {
  text-align: center;
  padding: 36px 0 8px;
  font-size: 12px;
  color: #3d4a60;
}
.home-footer strong {
  color: #4a5a70;
}
</style>
