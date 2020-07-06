import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

import { isLoggedIn } from '../api/utils'

//IMPORTAMOS SWEETALERT PARA LOS ERRORES POP-UP
import Swal from "sweetalert2";

import axios from 'axios'

axios.defaults.headers.common["Authorization"] = localStorage.getItem('authToken');

const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing.vue")
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (isLoggedIn() === true) {
        next({
          path: "/home",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: "/Register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (isLoggedIn() === true) {
        next({
          path: "/home",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/About",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/myMeetings",
    name: "MyMeetings",
    component: () => import("../views/MyMeetings.vue"),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Tienes que logearte!",
        });
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: "/meeting/:id",
    name: "meeting",
    component: () => import("../views/Meeting.vue"),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Tienes que logearte!",
        });
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Tienes que logearte!",
        });
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: "/AddMeeting",
    name: "AñadirMeeting",
    component: () => import("../views/AddMeeting.vue"),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Tienes que logearte!",
        });
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
];

const router = new VueRouter({
  routes
})

export default router
