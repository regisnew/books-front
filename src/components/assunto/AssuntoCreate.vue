<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" class="mb-4" closable="true" type="error">{{ error }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
  import { onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import Toolbar from '@/components/common/Toolbar.vue'
  import Loading from '@/components/common/Loading.vue'
  import Form from '@/components/assunto/AssuntoForm.vue'
  import { useAssuntoCreateStore } from '@/store/assunto/create'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { Assunto } from '@/types/assunto'

  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const assuntoCreateStore = useAssuntoCreateStore()
  const { created, isLoading, violations, error } = storeToRefs(assuntoCreateStore)

  async function create (item: Assunto) {
    await assuntoCreateStore.create(item)

    if (!created?.value) {
      return
    }

    router.push({ name: 'AssuntoUpdate', params: { id: created?.value?.['@id'] } })
  }

  onBeforeUnmount(() => {
    assuntoCreateStore.$reset()
  })
</script>
