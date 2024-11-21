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
      @update:page="updatePage"
      @update:sort-by="updateOrder"
    >
      <template #item.actions="{ item }">
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

      <template #item.valor="{ item }">
        {{ toCurrence(item.valor) }}
      </template>

      <template #item.autors="{ item }">
        <template v-if="router.hasRoute('AutorShow')">
          <router-link
            v-for="autor in item.autors"
            :key="autor"
            :to="{ name: 'AutorShow', params: { id: autor['@id'] } }"
          >
            {{ autor.nome }}

            <br>
          </router-link>
        </template>

        <template v-else>
          <p v-for="autor in item.raw.autors" :key="autor">
            {{ autor.nome }}
          </p>
        </template>
      </template>
      <template #item.assuntos="{ item }">
        <template v-if="router.hasRoute('AssuntoShow')">
          <router-link
            v-for="assunto in item.assuntos"
            :key="assunto"
            :to="{ name: 'AssuntoShow', params: { id: assunto['@id'] } }"
          >
            {{ assunto.descricao }}

            <br>
          </router-link>
        </template>

        <template v-else>
          <p v-for="assunto in item.raw.assuntos" :key="assunto">
            {{ assunto }}
          </p>
        </template>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useLivroListStore } from '@/store/livro/list'
  import { useLivroDeleteStore } from '@/store/livro/delete'
  import Toolbar from '@/components/common/Toolbar.vue'
  import ActionCell from '@/components/common/ActionCell.vue'
  import { useMercureList } from '@/composables/mercureList'
  import { useBreadcrumb } from '@/composables/breadcrumb'
  import type { VuetifyOrder } from '@/types/list'
  import type { Livro } from '@/types/livro'

  const { t } = useI18n()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const livroDeleteStore = useLivroDeleteStore()
  const { deleted, mercureDeleted } = storeToRefs(livroDeleteStore)

  const livroListStore = useLivroListStore()
  const { items, totalItems, error, isLoading } = storeToRefs(livroListStore)

  const page = ref('1')
  const order = ref({})

  async function sendRequest () {
    await livroListStore.getItems({
      page: page.value,
      order: order.value,
    })
  }

  useMercureList({ store: livroListStore, deleteStore: livroDeleteStore })

  sendRequest()

  const headers = [
    {
      title: t('id'),
      key: 'id',
    },
    {
      title: t('livro.titulo'),
      key: 'titulo',
      sortable: true,
    },
    {
      title: t('livro.editora'),
      key: 'editora',
      sortable: true,
    },
    {
      title: t('livro.edicao'),
      key: 'edicao',
      sortable: true,
    },
    {
      title: t('livro.anoPublicacao'),
      key: 'anoPublicacao',
      sortable: true,
    },
    {
      title: t('livro.valor'),
      key: 'valor',
      sortable: true,
    },
    {
      title: t('livro.autors'),
      key: 'autors',
      sortable: false,
    },
    {
      title: t('livro.assuntos'),
      key: 'assuntos',
      sortable: false,
    },
    {
      title: t('actions'),
      key: 'actions',
      sortable: false,
      width: '10%',
      nowrap: true,
    },
  ]

  function toCurrence (value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    return formatter.format(value)
  }

  function updatePage (newPage: string) {
    page.value = newPage

    sendRequest()
  }

  function updateOrder (newOrders: VuetifyOrder[]) {
    const newOrder = newOrders[0]
    order.value = { [newOrder.key]: newOrder.order }

    sendRequest()
  }

  function goToShowPage (item: Livro) {
    router.push({
      name: 'LivroShow',
      params: { id: item['@id'] },
    })
  }

  function goToCreatePage () {
    router.push({
      name: 'LivroCreate',
    })
  }

  function goToUpdatePage (item: Livro) {
    router.push({
      name: 'LivroUpdate',
      params: { id: item['@id'] },
    })
  }

  async function deleteItem (item: Livro) {
    await livroDeleteStore.deleteItem(item)

    sendRequest()
  }

  onBeforeUnmount(() => {
    livroDeleteStore.$reset()
  })
</script>
