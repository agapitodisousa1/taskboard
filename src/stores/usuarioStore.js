import { ref } from "vue"
import { defineStore } from "pinia"
import { auth } from "@/firebase/config"
import { onAuthStateChanged } from "firebase/auth"
import { crearUsuarioSiNoExiste, asignarTarea } from "@/services/usuario"

export const useUsuarioStore = defineStore("usuario", () => {
  const usuario = ref(null)
  const cargando = ref(false)
  let inicializado = false

  const cargarUsuario = () => {
    if (inicializado) return
    inicializado = true
    cargando.value = true

    onAuthStateChanged(auth, async user => {
      try {
        if (!user) {
          usuario.value = null
          return
        }

        usuario.value = await crearUsuarioSiNoExiste(user)
      } catch (err) {
        console.log(err)
        usuario.value = null
      } finally {
        cargando.value = false
      }
    })
  }

  const agregarTarea = async tarea => {
    if (!usuario.value) return
    if (tarea.completed) return

    for (let i = 0; i < usuario.value.tasks.length; i++) {
      if (usuario.value.tasks[i].id === tarea.id) {
        return
      }
    }

    usuario.value.tasks.push(tarea)

    try {
      await asignarTarea(auth.currentUser, tarea)
    } catch (err) {
      console.log(err)

      const nuevasTasks = []
      for (let i = 0; i < usuario.value.tasks.length; i++) {
        if (usuario.value.tasks[i].id !== tarea.id) {
          nuevasTasks.push(usuario.value.tasks[i])
        }
      }
      usuario.value.tasks = nuevasTasks
    }
  }

  return { usuario, cargando, cargarUsuario, agregarTarea }
})
