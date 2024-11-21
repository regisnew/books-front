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
  import Form from '@/components/autor/AutorForm.vue'
  import { useAutorCreateStore } from '@/store/autor/create'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { Autor } from '@/types/autor'

  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const autorCreateStore = useAutorCreateStore()
  const { created, isLoading, violations, error } = storeToRefs(autorCreateStore)

  async function create (item: Autor) {
    await autorCreateStore.create(item)

    if (!created?.value) {
      return
    }

    router.push({ name: 'AutorUpdate', params: { id: created?.value?.['@id'] } })
  }

  onBeforeUnmount(() => {
    autorCreateStore.$reset()
  })
</script>
