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
  import Form from '@/components/livro/LivroForm.vue'
  import { useLivroCreateStore } from '@/store/livro/create'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { Livro } from '@/types/livro'

  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const livroCreateStore = useLivroCreateStore()
  const { created, isLoading, violations, error } = storeToRefs(livroCreateStore)

  async function create (item: Livro) {
    await livroCreateStore.create(item)

    if (!created?.value) {
      return
    }

    router.push({ name: 'LivroUpdate', params: { id: created?.value?.['@id'] } })
  }

  onBeforeUnmount(() => {
    livroCreateStore.$reset()
  })
</script>
