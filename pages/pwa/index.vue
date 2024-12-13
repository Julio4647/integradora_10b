<template>
  <div>
    <iframe
      src="/pwa/index.html"
      style="width: 100%; height: 100vh; border: none"
      title="PWA App"
    ></iframe>
  </div>
</template>
<script lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
