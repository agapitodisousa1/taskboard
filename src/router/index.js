import { createRouter, createWebHistory } from 'vue-router'
import { estaAutenticado } from '@/services/autenticacion'
import HomeView from '@/views/HomeView.vue'
import WorkSpaceView from '@/views/WorkSpaceView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{path: "/", component: HomeView, meta: {requiresAuth: true}},
          {path: "/workspace", component: WorkSpaceView, meta: {requiresAuth: true} },
          {path: "/register", component: RegisterView },
          {path: "/login", component: LoginView}
   ],
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresauth){
    if(estaAutenticado()){
      next()
    }else{
      next("/login")}
  }else{
      next()
    }
  })
export default router
