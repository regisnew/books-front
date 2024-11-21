<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          v-model="item.titulo"
          :error="Boolean(violations?.titulo)"
          :error-messages="violations?.titulo"
          :label="$t('livro.titulo')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.titulo = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          v-model="item.editora"
          :error="Boolean(violations?.editora)"
          :error-messages="violations?.editora"
          :label="$t('livro.editora')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.editora = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          v-model.number="item.edicao"
          v-mask="'####'"
          :error="Boolean(violations?.edicao)"
          :error-messages="violations?.edicao"
          :label="$t('livro.edicao')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.edicao = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          v-model="item.anoPublicacao"
          v-mask="'####'"
          :error="Boolean(violations?.anoPublicacao)"
          :error-messages="violations?.anoPublicacao"
          :label="$t('livro.anoPublicacao')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.anoPublicacao = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          v-model.lazy="item.valor"
          v-money="money"
          :error="Boolean(violations?.valor)"
          :error-messages="violations?.valor"
          :label="$t('livro.valor')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.valor = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="item.autors"
          chips
          item-title="nome"
          item-value="id"
          :items="autors"
          :label="$t('livro.autors')"
          multiple
          return-object
        />
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="item.assuntos"
          chips
          item-title="descricao"
          item-value="id"
          :items="assuntos"
          :label="$t('livro.assuntos')"
          multiple
          return-object
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <v-btn color="primary" type="submit">{{ $t("submit") }}</v-btn>

        <v-btn class="ml-2" color="primary" variant="text" @click="resetForm">
          {{ $t("reset") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
  import { onMounted, Ref, ref, toRef, watch } from 'vue'
  import { VForm } from 'vuetify/components'
  import { useAutorListStore } from '@/store/autor/list'
  import { useAssuntoListStore } from '@/store/assunto/list'
  import type { Livro } from '@/types/livro'
  import type { SubmissionErrors } from '@/types/error'
  import { components } from 'vuetify/dist/vuetify-labs.js'

  const props = defineProps<{
    values?: Livro;
    errors?: SubmissionErrors;
  }>()

  const violations = toRef(props, 'errors')

  const item: Ref<Livro> = ref({})

  const money = {
    decimal: ',',
    thousands: '.',
    prefix: 'R$ ',
    precision: 2,
    masked: false,
  }

  if (props.values) {
    item.value = {
      ...props.values,
    }
  }

  const emit = defineEmits<{
    (e: 'submit', item: Livro): void;
  }>()

  function emitSubmit () {
    const itemToSubmit = {
      ...item.value,
      valor: item.value.valor?.replace('R$', '').replace('.', '').replace(',', '.').trim(),
      autors: item.value.autors.map(autor => autor['@id']),
      assuntos: item.value.assuntos.map(assunto => assunto['@id']),

    }
    emit('submit', itemToSubmit)
  }

  const form: Ref<VForm | null> = ref(null)

  function resetForm () {
    if (!form.value) return

    form.value.reset()
  }

  const autoresStore = useAutorListStore()
  const autors = ref([])

  const assuntosStore = useAssuntoListStore()
  const assuntos = ref([])

  onMounted(async () => {
    await autoresStore.getItems({ paginate: false })
    autors.value = autoresStore.items

    await assuntosStore.getItems({ paginate: false })
    assuntos.value = assuntosStore.items
  })
</script>
