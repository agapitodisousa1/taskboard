import { auth } from '@/firebase/config.js'
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification
} from 'firebase/auth'
import {ref} from 'vue'

// variable global del usuario
export const usuario = ref(null)

// escuchar los cambios de la autenticación: logueado | no logueado
onAuthStateChanged(auth, (userFirebase) => {
    console.log(userFirebase);
    
    console.log("Auth: usuario detectado: - ", userFirebase?.uid || "Ninguno");
    
    usuario.value = userFirebase  
})

// registrar usuario
export const registrar = async (email, password) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        console.log("usuario creado correctamente ✅", email);
        return {
            ok: true,
            mensaje: 'usuario creado correctamente',
            usuario: userCredentials
        }
        
    } catch (error) {
        console.log("Ha habido un problema ❌", error);
        return {
            ok: false,
            error: 'Ha habido un problema'
        }
    }
}

export const login = async (email, password) => {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log("Sesión iniciada ✅", email);
        return {
            ok: true,
            mensaje: 'sesión iniciada correctamente',
            usuario: userCredentials
        }
    } catch (error) {
        console.log("Ha habido un problema ❌", error);
        return {
            ok: false,
            error: 'Ha habido un problema'
        }
    }
}

export const logout = async () => {
    try {
        await signOut(auth)
        console.log("✅ sesión cerrada");
        return{ok: true}   
    } catch (error) {
        console.log("❌ error en logout");
        return{ok: false, error: error.message}  
    }
}
export const enviarEmailVerificacion = async (usuarioActual = null) => {
    try{
        const usuario = usuarioActual || auth.currentUser
        if(usuario.emailVerified){
            console.log("Email ya verificado")
            return {
                ok: true,
                mensaje: "Email ya verificado"
            }
        }
        await sendEmailVerification(usuario, {url: window.location.origin + "/perfil"})
        return {
                ok: true,
                mensaje: "Email de verificacion enviado, "
            }
    }catch(error){
        console.log("Ha habido un problema al enviar el correo de verifiación")
    }
}
// sirve para proteger la ruta
export const estaAutenticado = ()=> {
    return usuario.value !== null 
}

// Obrtener usuario, si el existe
export const obtenerUsuario = () => {
    return usuario.value
}