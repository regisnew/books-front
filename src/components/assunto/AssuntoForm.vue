<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          v-model="item.descricao"
          :error="Boolean(violations?.descricao)"
          :error-messages="violations?.descricao"
          :label="$t('assunto.descricao')"
          required
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.descricao = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
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
  import { ref, Ref, toRef } from 'vue'
  import { VForm } from 'vuetify/components'
  import type { Assunto } from '@/types/assunto'
  import type { SubmissionErrors } from '@/types/error'
  const props = defineProps<{
    values?: Assunto;
    errors?: SubmissionErrors;
  }>()

  const violations = toRef(props, 'errors')

  const item: Ref<Assunto> = ref({})

  if (props.values) {
    item.value = {
      ...props.values,
    }
  }

  const emit = defineEmits<{(e: 'submit', item: Assunto): void;}>()

  function emitSubmit () {
    emit('submit', item.value)
  }

  const form: Ref<VForm | null> = ref(null)

  function resetForm () {
    if (!form.value) return

    form.value.reset()
  }
</script>
