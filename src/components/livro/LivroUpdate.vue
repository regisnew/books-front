<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" class="mb-4" closable="true" type="error">
      {{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" class="mb-4" closable="true" type="success">
      <template v-if="updated">
        {{ $t("itemUpdated", [updated["@id"]]) }}
      </template>
      <template v-else-if="created">
        {{ $t("itemCreated", [created["@id"]]) }}
      </template>
    </v-alert>

    <Form v-if="item" :errors="violations" :values="item" @submit="update" />
  </v-container>

  <Loading :visible="isLoading || deleteLoading" />
</template>

<script lang="ts" setup>
  import { onBeforeUnmount } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import Toolbar from '@/components/common/Toolbar.vue'
  import Form from '@/components/livro/LivroForm.vue'
  import Loading from '@/components/common/Loading.vue'
  import { useLivroDeleteStore } from '@/store/livro/delete'
  import { useLivroUpdateStore } from '@/store/livro/update'
  import { useMercureItem } from '@/composables/mercureItem'
  import { useLivroCreateStore } from '@/store/livro/create'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { Livro } from '@/types/livro'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const livroCreateStore = useLivroCreateStore()
  const { created } = storeToRefs(livroCreateStore)

  const livroDeleteStore = useLivroDeleteStore()
  const { isLoading: deleteLoading, error: deleteError } =
    storeToRefs(livroDeleteStore)

  const livroUpdateStore = useLivroUpdateStore()
  const {
    retrieved: item,
    updated,
    isLoading,
    error,
    violations,
  } = storeToRefs(livroUpdateStore)

  useMercureItem({
    store: livroUpdateStore,
    deleteStore: livroDeleteStore,
    redirectRouteName: 'LivroList',
  })

  await livroUpdateStore.retrieve(decodeURIComponent(route.params.id as string))

  async function update (item: Livro) {
    await livroUpdateStore.update(item)
  }

  async function deleteItem () {
    if (!item?.value) {
      livroUpdateStore.setError(t('itemNotFound'))
      return
    }

    await livroDeleteStore.deleteItem(item?.value)

    router.push({ name: 'LivroList' })
  }

  onBeforeUnmount(() => {
    livroUpdateStore.$reset()
    livroCreateStore.$reset()
    livroDeleteStore.$reset()
  })
</script>
