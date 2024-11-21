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
  import Form from '@/components/autor/AutorForm.vue'
  import Loading from '@/components/common/Loading.vue'
  import { useAutorDeleteStore } from '@/store/autor/delete'
  import { useAutorUpdateStore } from '@/store/autor/update'
  import { useMercureItem } from '@/composables/mercureItem'
  import { useAutorCreateStore } from '@/store/autor/create'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { Autor } from '@/types/autor'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const autorCreateStore = useAutorCreateStore()
  const { created } = storeToRefs(autorCreateStore)

  const autorDeleteStore = useAutorDeleteStore()
  const { isLoading: deleteLoading, error: deleteError } =
    storeToRefs(autorDeleteStore)

  const autorUpdateStore = useAutorUpdateStore()
  const {
    retrieved: item,
    updated,
    isLoading,
    error,
    violations,
  } = storeToRefs(autorUpdateStore)

  useMercureItem({
    store: autorUpdateStore,
    deleteStore: autorDeleteStore,
    redirectRouteName: 'AutorList',
  })

  await autorUpdateStore.retrieve(decodeURIComponent(route.params.id as string))

  async function update (item: Autor) {
    await autorUpdateStore.update(item)
  }

  async function deleteItem () {
    if (!item?.value) {
      autorUpdateStore.setError(t('itemNotFound'))
      return
    }

    await autorDeleteStore.deleteItem(item?.value)

    router.push({ name: 'AutorList' })
  }

  onBeforeUnmount(() => {
    autorUpdateStore.$reset()
    autorCreateStore.$reset()
    autorDeleteStore.$reset()
  })
</script>
