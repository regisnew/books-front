<template>
  <v-toolbar class="px-4 d-flex justify-space-around" elevation="0">
    <v-btn @click="toggleTheme"><v-icon icon="mdi-theme-light-dark" /></v-btn>
    <Breadcrumb :breadcrumb="breadcrumb" />

    <v-spacer />

    <div>
      <v-btn
        v-if="actions?.includes('delete')"
        class="ml-sm-2"
        color="error"
        @click="toggleConfirmDelete"
      >
        {{ $t("delete") }}
      </v-btn>

      <v-btn
        v-if="actions?.includes('add')"
        color="primary"
        icon="mdi-plus-circle"
        @click="emitAdd"
      />
    </div>

    <ConfirmDelete
      v-if="actions?.includes('delete')"
      :show="confirmDelete"
      @cancel="toggleConfirmDelete"
      @delete="emitDelete"
    />
  </v-toolbar>
</template>

<script lang="ts" setup>
  import { ref, toRefs } from 'vue'
  import { useTheme } from 'vuetify'
  import Breadcrumb from '@/components/common/Breadcrumb.vue'
  import ConfirmDelete from '@/components/common/ConfirmDelete.vue'
  import type { BreadcrumbValue } from '@/types/breadcrumb'

  const theme = useTheme()

  const props = defineProps<{
    actions?:('submit' | 'reset' | 'delete' | 'add')[];
    isLoading: boolean;
    breadcrumb: BreadcrumbValue[];
  }>()

  const { actions } = toRefs(props)

  const emit = defineEmits<{
    (e: 'submit'): void;
    (e: 'reset'): void;
    (e: 'add'): void;
    (e: 'delete'): void;
  }>()

  function emitAdd () {
    emit('add')
  }

  function emitDelete () {
    emit('delete')
  }

  const confirmDelete = ref(false)

  function toggleConfirmDelete () {
    confirmDelete.value = !confirmDelete.value
  }

  function toggleTheme () {
    theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
  }
</script>
