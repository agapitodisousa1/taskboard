<script setup>
  import { onMounted } from "vue"
  import { useUsuarioStore } from "@/stores/usuarioStore"

  const storeUsuario = useUsuarioStore()

  onMounted(() => {
    storeUsuario.cargarUsuario()
  })
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
