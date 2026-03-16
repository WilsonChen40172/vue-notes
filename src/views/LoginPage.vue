<template>
  <div class="card" style="max-width: 400px; margin: 60px auto;">
    <h2>登入</h2>
    <p class="hint">測試帳號：admin/admin 或 user/user</p>
    <div class="form-group">
      <label>帳號</label>
      <input v-model="form.username" class="input" placeholder="輸入帳號" @keyup.enter="handleLogin" />
    </div>
    <div class="form-group">
      <label>密碼</label>
      <input v-model="form.password" type="password" class="input" placeholder="輸入密碼" @keyup.enter="handleLogin" />
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <button class="btn btn-primary" @click="handleLogin" :disabled="loading" style="width:100%; margin-top:8px;">
      {{ loading ? '登入中...' : '登入' }}
    </button>
    <p style="margin-top:12px; font-size:13px; color:#666; text-align:center;">
      <router-link to="/">← 返回首頁</router-link>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'LoginPage',
  data() {
    return { form: { username: '', password: '' }, loading: false, error: '' }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      this.loading = true
      this.error = ''
      const result = await this.login(this.form)
      this.loading = false
      if (result.success) {
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } else {
        this.error = result.message
      }
    }
  }
}
</script>

<style scoped>
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: 13px; margin-bottom: 4px; color: #94a3b8; }
.input { width: 100%; padding: 8px 12px; border: 1px solid #2d3548; border-radius: 4px; font-size: 14px; box-sizing: border-box; background: #252c3b; color: #c9d1d9; }
.error { color: #f87171; font-size: 13px; margin-top: 4px; }
.hint { font-size: 12px; color: #6e7a9a; margin-bottom: 16px; }
</style>
