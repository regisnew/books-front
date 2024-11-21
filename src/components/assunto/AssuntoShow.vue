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

    <v-table v-if="item">
      <thead>
        <tr>
          <th>{{ $t("field") }}</th>
          <th>{{ $t("value") }}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            {{ $t("assunto.descricao") }}
          </td>

          <td>{{ item.descricao }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
  import { onBeforeUnmount } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import Toolbar from '@/components/common/Toolbar.vue'
  import Loading from '@/components/common/Loading.vue'
  import { useMercureItem } from '@/composables/mercureItem'
  import { useAssuntoDeleteStore } from '@/store/assunto/delete'
  import { useAssuntoShowStore } from '@/store/assunto/show'
  import { useBreadcrumb } from '@/composables/breadcrumb'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const assuntoShowStore = useAssuntoShowStore()
  const { retrieved: item, isLoading, error } = storeToRefs(assuntoShowStore)

  const assuntoDeleteStore = useAssuntoDeleteStore()
  const { deleted, error: deleteError } = storeToRefs(assuntoDeleteStore)

  useMercureItem({
    store: assuntoShowStore,
    deleteStore: assuntoDeleteStore,
    redirectRouteName: 'AssuntoList',
  })

  await assuntoShowStore.retrieve(decodeURIComponent(route.params.id as string))

  async function deleteItem () {
    if (!item?.value) {
      assuntoDeleteStore.setError(t('itemNotFound'))
      return
    }

    await assuntoDeleteStore.deleteItem(item.value)

    if (!deleted?.value) {
      return
    }

    router.push({ name: 'AssuntoList' })
  }

  onBeforeUnmount(() => {
    assuntoShowStore.$reset()
  })
</script>
