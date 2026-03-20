<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-inner">
        <div class="brand">Vue 3 學習專案</div>
        <ul class="nav-links">
          <li>
            <router-link to="/" exact>首頁</router-link>
          </li>
          <li>
            <router-link to="/vuex">Vuex</router-link>
          </li>
          <li>
            <router-link to="/router-guard">Router 守衛</router-link>
          </li>
          <li>
            <router-link to="/cicd">CI/CD</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/admin">Admin</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/login">登入</router-link>
          </li>
          <li v-else>
            <a href="#" @click.prevent="handleLogout">登出 ({{ username }})</a>
          </li>
        </ul>
      </div>
    </nav>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin']),
    username() {
      return this.$store.state.user ? this.$store.state.user.username : ''
    }
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: #0f1117;
  color: #c9d1d9;
}

.navbar {
  background: #0d1117;
  border-bottom: 1px solid #2d3548;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.brand {
  color: #42b983;
  font-size: 18px;
  font-weight: 700;
}

.nav-links {
  list-style: none;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  gap: 8px;
}

.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  -webkit-transition: background 0.2s;
  transition: background 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #42b983;
  color: #fff;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 16px;
}

/* 共用卡片 */
.card {
  background: #1a1f2e;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #2d3548;
  -webkit-box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.card h2 {
  color: #e2e8f0;
  margin-bottom: 16px;
  font-size: 20px;
  border-left: 4px solid #42b983;
  padding-left: 10px;
}

.card h3 {
  color: #94a3b8;
  margin: 16px 0 8px;
  font-size: 16px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #6e7a9a;
  margin-bottom: 24px;
  font-size: 14px;
}

pre {
  background: #0d1117;
  color: #c9d1d9;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid #2d3548;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 4px;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.85; }
.btn-primary { background: #42b983; color: #fff; }
.btn-danger  { background: #c0392b; color: #fff; }
.btn-info    { background: #2980b9; color: #fff; }
.btn-warning { background: #d68910; color: #fff; }

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin: 2px;
}

.tag-green  { background: #1a3a2e; color: #4ade80; }
.tag-blue   { background: #1e2f45; color: #60a5fa; }
.tag-red    { background: #3a1f20; color: #f87171; }
.tag-yellow { background: #3a2e14; color: #fbbf24; }
</style>
