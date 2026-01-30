<template>
    <section>
        <h1>REGISTER</h1>
        <form @submit.prevent="loguearUsuario">
            <div>
                <label for="email">Email: </label>
                <input type="email" name="email" placeholder="Introduce tu email"
                v-model="email">
            </div>
            <div>
                <label for="pass">Contraseña</label>
                <input type="password" name="pass" v-model="password">
            </div>
            <p v-if="exito">{{ exito }}</p>
            <p v-if="error">{{ error }}</p>
            <button type="submit" :disabled="cargando">{{ cargando ? "Accediendo..." : "Iniciar sesión" }}</button>
        </form>
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
        const usuario = resultado.usuario.user
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
    
</script>

<style>

</style>