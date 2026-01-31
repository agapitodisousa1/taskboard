<template>
    <section class="p-5">
        <div class="bg-[#ced4da] w-full rounded flex justify-center gap-5 p-5">
            <h1 class="text-2xl mb-5">Mi área de trabajo</h1>
        </div>
        <div v-if="cargando">
        Cargando tareas...
        </div>
        <div v-else-if="!tareas.length">
        No tienes tareas asignadas
        </div>
        <div v-else class="flex flex-wrap gap-4">
        <div
            v-for="tarea in tareas"
            :key="tarea.id"
            class="w-1/3 p-5 bg-[#f8f9fa] rounded flex flex-col gap-3">
            <h2 class="text-lg">{{ tarea.todo }}</h2>
            <p>No finalizada</p>
        </div>
        </div>
    </section>
    <div class="flex justify-center p-5 gap-10">
        <button class="bg-[#cae9ff] p-5 rounded cursor-pointer" @click="cerrarSesion">Cerrar sesión</button>
        <button class="bg-[#ee9b00] p-5 rounded cursor-pointer" @click="irAHome">Ir al principio</button>
    </div>
</template>

<script setup>
import { computed } from "vue"
import { useUsuarioStore } from "@/stores/usuarioStore"
import { logout } from "@/services/autenticacion"
import { useRouter } from "vue-router"

const router = useRouter()
const storeUsuario = useUsuarioStore()
const cargando = computed(() => storeUsuario.cargando)
const tareas = computed(() => {
  if (storeUsuario.cargando) return []
  if (!storeUsuario.usuario) return []
  if (!storeUsuario.usuario.tasks) return []
  const resultado = []
  for (let i = 0; i < storeUsuario.usuario.tasks.length; i++) {
    if (!storeUsuario.usuario.tasks[i].completed) {
      resultado.push(storeUsuario.usuario.tasks[i])
    }
  }
  return resultado
})
const cerrarSesion = () => {
    logout()
    router.push("/login")
}
const irAHome = () => {
    router.push("/")
}

</script>

<style scoped>
</style>
