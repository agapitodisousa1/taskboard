<template>
    <section class="flex  justify-center bg-[#f8f9fa] flex-col items-center gap-5 p-5 h-screen">
        <div class="bg-[#ced4da] w-[30%] rounded flex justify-center p-5">
            <strong><h1 class="text-2xl">INICIAR SESIÓN</h1></strong>
        </div>
        <form @submit.prevent="loguearUsuario" class="flex gap-10 p-5 flex-col border-1 rounded w-[30%]">
            <div>
                <label for="email">Email: </label>
                <input class="outline-none p-1 rounded" type="email" id="email" placeholder="Introduce tu email"
                v-model="email">
            </div>
            <div>
                <label for="pass">Contraseña</label>
                <input class="outline-none p-1 rounded" type="password" id="pass" placeholder="Introduce la contraseña" v-model="password">
            </div>
            <p v-if="exito">{{ exito }}</p>
            <p v-if="error">{{ error }}</p>
            <div class="flex justify-center items-center gap-5">
                <button type="submit" class="p-2 bg-[#343a40] rounded cursor-pointer text-[#ffffff]" :disabled="cargando">{{ cargando ? "Iniciando..." : "Iniciar sesión"}}</button>
            </div>
        </form>
        <button @click="goRegister" class="shadow p-2 rounded cursor-pointer">¿No tienes cuenta?</button>
    </section>  
</template>

<script setup>
    import { login, enviarEmailVerificacion } from '@/services/autenticacion';
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter()
    let email = ref("")
    let password = ref("")
    const error = ref("")
    const exito = ref("")
    const cargando = ref(false)
    let loguearUsuario = async () => {
        error.value = ""
        exito.value = ""
        cargando.value = true
        const resultado = await login(email.value, password.value)
        const usuario = resultado.usuario.email
        const respuestaEmail = await enviarEmailVerificacion(usuario)
        if(respuestaEmail.emailVerified){
            exito.value = "Email verificado"

        } 
        cargando.value = false
        if(resultado.ok && respuestaEmail.ok){
            exito.value = `Bien, ${email.value} sesión iniciada`
            router.push("/")
        } else{
            error.value = "Oh no, error, asegurate de introducir las credenciales correctamente y de verificar el email"
        }
    
        }
    
    const goRegister = () => { 
        router.push("/register")
    }
    
</script>

<style>

</style>