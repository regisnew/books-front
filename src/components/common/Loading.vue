<template>
  <v-overlay class="align-center justify-center" :model-value="visible">
    <v-progress-circular color="primary" indeterminate size="64" />
  </v-overlay>
</template>

<script lang="ts" setup>
  defineProps<{
    visible: boolean;
  }>()
</script>
