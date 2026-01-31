<template>
    <section class="flex  justify-center bg-[#f8f9fa] flex-col items-center gap-5 p-5 h-screen">
        <div class="bg-[#ced4da] w-[30%] rounded flex justify-center p-5">
            <strong><h1 class="text-2xl">REGISTRAR</h1></strong>
        </div>
        <form @submit.prevent="registrarUsuario" class="flex gap-10 p-5 flex-col border-1 rounded w-[30%]">
            <div class="">
                <label for="email">Email:   </label>
                <input class="outline-none p-1 rounded" required type="email" id="email" placeholder="Introduce tu email" v-model="email">
            </div>
            <div>
                <label for="pass">Contraseña:    </label>
                <input class="outline-none p-1 rounded" required type="password" id="pass" placeholder="Introduce la contraseña" v-model="password">
            </div>
            <div class="">
                <label for="confirmpass">Confirmar contraseña:    </label>
                <input class="outline-none" required type="password" v-model="confirmPassword" id="confirmpass" placeholder="Vuelve a introducir la contraseña">
            </div>
            <p v-if="error">{{ error }}</p>
            <p v-if="exito">{{ exito }}</p>
            <div class="flex justify-center items-center gap-5">
                
                <button type="submit" class="p-2 bg-[#343a40] rounded cursor-pointer text-[#ffffff]" :disabled="cargando">{{ cargando ? "Creando usuario..." : "Registrar usuario"}}</button>
            </div>
        </form>
        <button @click="goLogin" class="shadow p-2 rounded cursor-pointer">¿Ya tienes cuenta?</button>
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
    let goLogin = () => {
        router.push("/login")
    }
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