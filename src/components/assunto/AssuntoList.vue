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
      class="striped"
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

      <!-- <template #item["@id"]="{ item }">
        <router-link
          :to="{ name: 'AssuntoShow', params: { id: item.raw['@id'] } }"
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
  import { useAssuntoListStore } from '@/store/assunto/list'
  import { useAssuntoDeleteStore } from '@/store/assunto/delete'
  import Toolbar from '@/components/common/Toolbar.vue'
  import { useMercureList } from '@/composables/mercureList'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { VuetifyOrder } from '@/types/list'
  import type { Assunto } from '@/types/assunto'

  const { t } = useI18n()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const assuntoDeleteStore = useAssuntoDeleteStore()
  const { deleted, mercureDeleted } = storeToRefs(assuntoDeleteStore)

  const assuntoListStore = useAssuntoListStore()
  const { items, totalItems, error, isLoading } = storeToRefs(assuntoListStore)

  const page = ref('1')
  const order = ref({})
  const itemsPerPage = ref(10)

  async function sendRequest () {
    await assuntoListStore.getItems({
      page: page.value,
      order: order.value,
      itemsPerPage: itemsPerPage.value,
    })
  }

  useMercureList({ store: assuntoListStore, deleteStore: assuntoDeleteStore })

  sendRequest()

  const headers = [
    {
      title: t('id'),
      key: 'id',
      width: '10%',
    },
    {
      title: t('assunto.descricao'),
      key: 'descricao',
      sortable: true,
      width: '80%',
    },
    {
      title: t('actions'),
      key: 'actions',
      sortable: false,
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

  function goToShowPage (item: Assunto) {
    console.log(item)
    router.push({
      name: 'AssuntoShow',
      params: { id: item['@id'] },
    })
  }

  function goToCreatePage () {
    router.push({
      name: 'AssuntoCreate',
    })
  }

  function goToUpdatePage (item: Assunto) {
    console.log(item)
    router.push({
      name: 'AssuntoUpdate',
      params: { id: item['@id'] },
    })
  }

  async function deleteItem (item: Assunto) {
    await assuntoDeleteStore.deleteItem(item)

    sendRequest()
  }

  onBeforeUnmount(() => {
    assuntoDeleteStore.$reset()
  })
</script>
