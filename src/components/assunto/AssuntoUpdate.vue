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
  import Form from '@/components/assunto/AssuntoForm.vue'
  import Loading from '@/components/common/Loading.vue'
  import { useAssuntoDeleteStore } from '@/store/assunto/delete'
  import { useAssuntoUpdateStore } from '@/store/assunto/update'
  import { useMercureItem } from '@/composables/mercureItem'
  import { useAssuntoCreateStore } from '@/store/assunto/create'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { Assunto } from '@/types/assunto'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const assuntoCreateStore = useAssuntoCreateStore()
  const { created } = storeToRefs(assuntoCreateStore)

  const assuntoDeleteStore = useAssuntoDeleteStore()
  const { isLoading: deleteLoading, error: deleteError } =
    storeToRefs(assuntoDeleteStore)

  const assuntoUpdateStore = useAssuntoUpdateStore()
  const {
    retrieved: item,
    updated,
    isLoading,
    error,
    violations,
  } = storeToRefs(assuntoUpdateStore)

  useMercureItem({
    store: assuntoUpdateStore,
    deleteStore: assuntoDeleteStore,
    redirectRouteName: 'AssuntoList',
  })

  await assuntoUpdateStore.retrieve(decodeURIComponent(route.params.id as string))

  async function update (item: Assunto) {
    await assuntoUpdateStore.update(item)
  }

  async function deleteItem () {
    if (!item?.value) {
      assuntoUpdateStore.setError(t('itemNotFound'))
      return
    }

    await assuntoDeleteStore.deleteItem(item?.value)

    router.push({ name: 'AssuntoList' })
  }

  onBeforeUnmount(() => {
    assuntoUpdateStore.$reset()
    assuntoCreateStore.$reset()
    assuntoDeleteStore.$reset()
  })
</script>
