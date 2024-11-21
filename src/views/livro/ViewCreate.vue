<template>
  <Suspense>
    <Create />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
  import Create from '@/components/livro/LivroCreate.vue'
</script>
