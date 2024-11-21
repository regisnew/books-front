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
            {{ $t("livro.titulo") }}
          </td>

          <td>
            {{ item.titulo }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("livro.editora") }}
          </td>

          <td>
            {{ item.editora }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("livro.edicao") }}
          </td>

          <td>{{ item.edicao }}</td>
        </tr>
        <tr>
          <td>
            {{ $t("livro.anoPublicacao") }}
          </td>

          <td>{{ item.anoPublicacao }}</td>
        </tr>
        <tr>
          <td>
            {{ $t("livro.valor") }}
          </td>

          <td>{{ toCurrence(item.valor) }}</td>
        </tr>
        <tr>
          <td>
            {{ $t("livro.autors") }}
          </td>

          <td>
            <template v-if="router.hasRoute('AutorShow')">
              <router-link
                v-for="autor in item.autors"
                :key="autor"
                :to="{ name: 'AutorShow', params: { id: autor } }"
              >
                {{ autor.nome }}

                <br>
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="autor in item.autors"
                :key="autor"
              >
                {{ autor }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("livro.assuntos") }}
          </td>

          <td>
            <template v-if="router.hasRoute('AssuntoShow')">
              <router-link
                v-for="assunto in item.assuntos"
                :key="assunto"
                :to="{ name: 'AssuntoShow', params: { id: assunto } }"
              >
                {{ assunto.descricao }}

                <br>
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="assunto in item.assuntos"
                :key="assunto"
              >
                {{ assunto }}
              </p>
            </template>
          </td>
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
  import { useLivroDeleteStore } from '@/store/livro/delete'
  import { useLivroShowStore } from '@/store/livro/show'
  import { useBreadcrumb } from '@/composables/breadcrumb'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const breadcrumb = useBreadcrumb()

  const livroShowStore = useLivroShowStore()
  const { retrieved: item, isLoading, error } = storeToRefs(livroShowStore)

  const livroDeleteStore = useLivroDeleteStore()
  const { deleted, error: deleteError } = storeToRefs(livroDeleteStore)

  useMercureItem({
    store: livroShowStore,
    deleteStore: livroDeleteStore,
    redirectRouteName: 'LivroList',
  })

  await livroShowStore.retrieve(decodeURIComponent(route.params.id as string))

  async function deleteItem () {
    if (!item?.value) {
      livroDeleteStore.setError(t('itemNotFound'))
      return
    }

    await livroDeleteStore.deleteItem(item.value)

    if (!deleted?.value) {
      return
    }

    router.push({ name: 'LivroList' })
  }

  onBeforeUnmount(() => {
    livroShowStore.$reset()
  })

  function toCurrence (value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    return formatter.format(value)
  }
</script>
