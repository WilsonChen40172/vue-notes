<template>
  <div class="card" style="text-align:center; padding: 48px;">
    <div style="font-size: 72px; color: #2d3548;">404</div>
    <h2 style="margin: 8px 0; color: #e2e8f0;">找不到頁面</h2>
    <p style="color: #6e7a9a;">您要訪問的頁面不存在</p>
    <button class="btn btn-primary" style="margin-top:16px;" @click="$router.push('/')">返回首頁</button>
  </div>
</template>

<script>
export default { name: 'NotFound' }
</script>
