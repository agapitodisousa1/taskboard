<template>
  <section>
    <div class="bg-[#ced4da] w-full rounded flex justify-center gap-5 p-5">
      <label class="text-xl" for="filtro">Filtra por asignadas o finalizadas</label>
      <select id="filtro" v-model="filtro">
        <option value="todas">Todas</option>
        <option value="finalizada">Finalizada</option>
        <option value="no_finalizada">No finalizada</option>
        <option value="asignadas">Asignadas</option>
      </select>
    </div>

    <section class="flex flex-wrap gap-1">
      <div v-if="error_message">{{ error_message }}</div>
      <div v-if="cargando">Cargando los datos...</div>

      <div
        v-else
        v-for="dato in filtrar_por_asignadas_finalizadas"
        :key="dato.id"
        class="w-1/3 flex flex-col p-5 gap-5 rounded bg-[#f8f9fa]"
      >
        <h1>{{ dato.todo }}</h1>
        <p v-if="!dato.completed">No finalizada</p>
        <p v-else>Finalizada</p>

        <button
          v-if="!dato.completed && !estaAsignada(dato)"
          class="p-2 bg-[#343a40] rounded cursor-pointer text-white"
          @click="asignar_tarea(dato)"
        >
          Agregar
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import axios from "axios"
import { useUsuarioStore } from "@/stores/usuarioStore"

const storeUsuario = useUsuarioStore()

const error_message = ref("")
const cargando = ref(false)
const datos = ref([])
const filtro = ref("todas")
const url = "https://dummyjson.com/todos"

const getData = async () => {
  try {
    cargando.value = true
    const response = await axios.get(url)
    datos.value = response.data.todos
  } catch (error) {
    error_message.value = error.message || "Error al obtener datos"
  } finally {
    cargando.value = false
  }
}

const filtrar_por_asignadas_finalizadas = computed(() => {
  if (filtro.value === "finalizada") return datos.value.filter(t => t.completed)
  if (filtro.value === "no_finalizada") return datos.value.filter(t => !t.completed)
  if (filtro.value === "asignadas") return storeUsuario.usuario?.tasks || []
  return datos.value
})

const asignar_tarea = tarea => {
  if (!storeUsuario.usuario) return
  storeUsuario.agregarTarea(tarea)
}

const estaAsignada = tarea => {
  if (!storeUsuario.usuario?.tasks) return false
  return storeUsuario.usuario.tasks.some(t => t.id === tarea.id)
}

onMounted(async () => {
  await storeUsuario.cargarUsuario()
  await getData()
})
</script>

<style scoped>
</style>
