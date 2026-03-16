<template>
  <div class="card" style="text-align:center; padding: 48px;">
    <div style="font-size: 64px;">🔐</div>
    <h2 style="margin: 16px 0 8px; color: #e2e8f0;">管理後台</h2>
    <p style="color: #94a3b8;">你已通過 admin 權限驗證，歡迎 <strong style="color:#42b983;">{{ username }}</strong></p>
    <p style="font-size:13px; color:#6e7a9a; margin-top:8px;">
      此頁面由 Vue Router meta.requiresAuth + meta.requiresAdmin 保護
    </p>
    <button class="btn btn-primary" style="margin-top:16px;" @click="$router.push('/')">返回首頁</button>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  computed: {
    username() { return this.$store.state.user ? this.$store.state.user.username : '' }
  }
}
</script>
