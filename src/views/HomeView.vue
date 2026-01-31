<template>
  <section>
    <div class="bg-[#ced4da] w-full rounded flex justify-center gap-5 p-5">
      <label class="text-xl" for="filtro">Filtra por asignadas o finalizadas</label>
      <select id="filtro" class="bg-[#f8f9fa] rounded p-1" v-model="filtro">
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
        class="w-[33.1%] flex flex-col p-5 gap-5 rounded bg-[#f8f9fa]"
      >
        <strong><h1 class="text-xl">{{ dato.todo }}</h1></strong>
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
    <div class="flex justify-center p-5 gap-10">
        <button class="bg-[#cae9ff] p-5 rounded cursor-pointer" @click="cerrarSesion">Cerrar sesión</button>
        <button class="bg-[#ee9b00] p-5 rounded cursor-pointer" @click="irAlWorkspace">Ir al workspace</button>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import axios from "axios"
import { useUsuarioStore } from "@/stores/usuarioStore"
import { logout } from "@/services/autenticacion"
import { useRouter } from "vue-router"

const storeUsuario = useUsuarioStore()
const router = useRouter()
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

const cerrarSesion = () => {
    logout()
    router.push("/login")
}

const irAlWorkspace = () => {
    router.push("/workspace")
}
onMounted(async () => {
  await storeUsuario.cargarUsuario()
  await getData()
})
</script>

<style scoped>
</style>
