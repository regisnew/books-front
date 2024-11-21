<template>
  <v-btn
    v-if="actions?.includes('show')"
    class="ma-2"
    color="secondary"
    size="small"
    @click="emitShow"
  >
    {{ $t("show") }}
  </v-btn>

  <v-btn
    v-if="actions?.includes('update')"
    class="ma-2"
    color="secondary"
    size="small"
    @click="emitUpdate"
  >
    {{ $t("edit") }}
  </v-btn>

  <v-btn
    v-if="actions?.includes('delete')"
    class="ma-2"
    color="secondary"
    size="small"
    @click="toggleConfirmDelete"
  >
    {{ $t("delete") }}
  </v-btn>

  <ConfirmDelete
    v-if="actions?.includes('delete')"
    :show="confirmDelete"
    @cancel="toggleConfirmDelete"
    @delete="emitDelete"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ConfirmDelete from '@/components/common/ConfirmDelete.vue'

  const { t } = useI18n()

  defineProps<{
    actions?:('show' | 'update' | 'delete')[];
  }>()

  const emit = defineEmits<{
    (e: 'show'): void;
    (e: 'update'): void;
    (e: 'delete'): void;
  }>()

  function emitShow () {
    emit('show')
  }

  function emitUpdate () {
    emit('update')
  }

  function emitDelete () {
    emit('delete')
  }

  const confirmDelete = ref(false)

  function toggleConfirmDelete () {
    confirmDelete.value = !confirmDelete.value
  }
</script>
