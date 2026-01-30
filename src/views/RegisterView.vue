<template>
    <section class="flex justify-center">
        <h1>REGISTRAR</h1>
        <form @submit.prevent="registrarUsuario">
            <div>
                <label for="email">Email: </label>
                <input required type="email" name="email" placeholder="Introduce tu email" v-model="email">
            </div>
            <div>
                <label for="pass">Contraseña: </label>
                <input required type="password" name="pass" placeholder="Introduce la contraseña" v-model="password">
            </div>
            <div>
                <label for="confirmpass">Confirmar contraseña</label>
                <input required type="password" v-model="confirmPassword" name="confirmpass" placeholder="Vuelve a introducir la contraseña">
            </div>
            <p v-if="error">{{ error }}</p>
            <p v-if="exito">{{ exito }}</p>
            <button type="submit" :disabled="cargando">{{ cargando ? "Creando usuario..." : "Registrar usuario"}}</button>
        </form>
    </section>
</template>

<script setup>
    import { enviarEmailVerificacion, registrar } from '@/services/autenticacion';
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter()
    let email = ref("")
    let password = ref("")
    let confirmPassword = ref("")
    const error = ref("")
    const exito = ref("")
    const cargando = ref(false)
    let coinciden = computed(
        ()=>{
            return password.value === confirmPassword.value
        }
    )
    let registrarUsuario = async () =>{
        error.value = ""
        exito.value = ""
        if(!coinciden.value){
            error.value="Las contraseñas no coinciden"
            return
        }
        cargando.value = true
        const resultado = await registrar(email.value, password.value)
        const usuario = resultado.usuario.user
        cargando.value = false
        if(resultado.ok){
            await enviarEmailVerificacion(usuario)
            
            exito.value = `Éxito! ${email.value} creado exitosamente. Revisa tu correo para verificar tu email. Sin verificacion no puedes entrar en la app. `
            alert("Revisa tu correo para verificar tu email para entrar en la app")
            email.value = ""
            password.value = ""
            confirmPassword.value = ""
            router.push("/login")
        }else{
            error.value = `Oh no!, ha habido un error: ${resultado.error}`
            email.value = ""
            password.value = ""
            confirmPassword.value = ""
        }
    }
    


</script>

<style>

</style>