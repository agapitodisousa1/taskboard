import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/config"

export async function crearUsuarioSiNoExiste(user) {
  if (!user) return null

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    const nuevoUsuario = {
      uid: user.uid,
      email: user.email,
      tasks: []
    }
    await setDoc(ref, nuevoUsuario)
    return nuevoUsuario
  }

  const data = snap.data()

  return {
    uid: data.uid,
    email: data.email,
    tasks: data.tasks ? data.tasks : []
  }
}

export async function asignarTarea(user, tarea) {
  if (!user) return
  if (tarea.completed) return

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  let tasks = []

  if (!snap.exists()) {
    tasks.push({
      id: tarea.id,
      todo: tarea.todo,
      completed: tarea.completed
    })

    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      tasks: tasks
    })

    return
  }

  const data = snap.data()

  if (data.tasks) {
    for (let i = 0; i < data.tasks.length; i++) {
      if (data.tasks[i].id === tarea.id) {
        return
      }
      tasks.push(data.tasks[i])
    }
  }

  tasks.push({
    id: tarea.id,
    todo: tarea.todo,
    completed: tarea.completed
  })

  await updateDoc(ref, {
    tasks: tasks
  })
}
