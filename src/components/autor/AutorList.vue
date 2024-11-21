<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

  <v-container fluid>
    <v-alert v-if="deleted" class="mb-4" closable="true" type="success">
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" class="mb-4" closable="true" type="success">
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" class="mb-4" closable="true" type="error">
      {{ error }}
    </v-alert>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :items-per-page="items.length"
      :loading="isLoading"
      @update:items-per-page="updateItemsPerPage"
      @update:page="updatePage"
      @update:sort-by="updateOrder"
    >
      <template #item.actions="{ item }">
        <!-- <ActionCell
          :actions="['show', 'update', 'delete']"
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        /> -->
        <v-btn icon @click="goToShowPage(item)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn icon @click="goToUpdatePage(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <!-- <template #item.@id="{ item }">
        <router-link
          :to="{ name: 'AutorShow', params: { id: item.raw['@id'] } }"
        >
          {{ item.raw["@id"] }}
        </router-link>
      </template> -->

    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useAutorListStore } from '@/store/autor/list'
  import { useAutorDeleteStore } from '@/store/autor/delete'
  import Toolbar from '@/components/common/Toolbar.vue'
  import ActionCell from '@/components/common/ActionCell.vue'
  import { useMercureList } from '@/composables/mercureList'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { VuetifyOrder } from '@/types/list'
  import type { Autor } from '@/types/autor'

  const { t } = useI18n()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const autorDeleteStore = useAutorDeleteStore()
  const { deleted, mercureDeleted } = storeToRefs(autorDeleteStore)

  const autorListStore = useAutorListStore()
  const { items, totalItems, error, isLoading } = storeToRefs(autorListStore)

  const page = ref('1')
  const order = ref({})
  const itemsPerPage = ref(10)

  async function sendRequest () {
    await autorListStore.getItems({
      page: page.value,
      order: order.value,
      itemsPerPage: itemsPerPage.value,
    })
  }

  useMercureList({ store: autorListStore, deleteStore: autorDeleteStore })

  sendRequest()

  const headers = [
    {
      title: t('id'),
      key: 'id',
      width: '10%',
    },
    {
      title: t('autor.nome'),
      key: 'nome',
      sortable: true,
      width: '80%',
    },
    {
      title: t('actions'),
      key: 'actions',
      width: '10%',
      nowrap: true,
    },
  ]

  function updatePage (newPage: string) {
    page.value = newPage

    sendRequest()
  }

  function updateOrder (newOrders: VuetifyOrder[]) {
    const newOrder = newOrders[0]
    order.value = { [newOrder.key]: newOrder.order }

    sendRequest()
  }

  function updateItemsPerPage (newItemsPerPage: number) {
    itemsPerPage.value = newItemsPerPage

    sendRequest()
  }

  function goToShowPage (item: Autor) {
    router.push({
      name: 'AutorShow',
      params: { id: item['@id'] },
    })
  }

  function goToCreatePage () {
    router.push({
      name: 'AutorCreate',
    })
  }

  function goToUpdatePage (item: Autor) {
    router.push({
      name: 'AutorUpdate',
      params: { id: item['@id'] },
    })
  }

  async function deleteItem (item: Autor) {
    await autorDeleteStore.deleteItem(item)

    sendRequest()
  }

  onBeforeUnmount(() => {
    autorDeleteStore.$reset()
  })
</script>
