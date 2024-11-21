<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="hover-card" @click="goToRoute('AutorList')">
          <v-card-title>Autores(as)</v-card-title>
          <v-card-text>Gerencie os autores do sistema.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="hover-card" @click="goToRoute('AssuntoList')">
          <v-card-title>Assuntos</v-card-title>
          <v-card-text>Gerencie os assuntos do sistema.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row cols="12" md="6">
      <v-col cols="12" md="6">
        <v-card class="hover-card" @click="goToRoute('LivroList')">
          <v-card-title>Livros</v-card-title>
          <v-card-text>Gerencie os livros do sistema.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function goToRoute (routeName: string) {
    router.push({ name: routeName })
  }
</script>

<style scoped>
.hover-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.hover-card:hover {
  transform: scale(1.05);
}
</style>
