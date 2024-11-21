<template>
  <Suspense>
    <List />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
  import List from '@/components/assunto/AssuntoList.vue'
</script>
