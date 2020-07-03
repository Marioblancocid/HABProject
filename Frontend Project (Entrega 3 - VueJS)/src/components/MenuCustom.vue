<template>
  <div class="MenuCustom">
      <router-link :to="{ name: 'Home'}"><img id="logo" src="../assets/logoapp1.png" alt=""></router-link>
 <div id="nav">
      <router-link  id='link' :to="{ name: 'Home'}">Home</router-link> 
      <router-link v-show="Loged" id='link' :to="{ name: 'Profile', params:{ id: this.userID }}">Mi perfil</router-link> 
      <router-link v-show="Loged" id='link' :to="{ name: 'MyMeetings'}">Mis Eventos</router-link> 
      <router-link v-show="!Loged" id='link' :to="{ name: 'Login'}">Entrar</router-link> 
      <router-link v-show="!Loged" id='link' :to="{ name: 'Register'}">Registrate</router-link> 
      <router-link v-show="Loged" id='link' :to="{ name: 'AñadirMeeting'}">Añadir Evento</router-link> 
      <span v-show="Loged"><router-link v-show="Loged" id='link' :to="{ name: 'Profile', params:{ id: this.userID }}">{{nombreUsuario}}</router-link></span>
      <button v-show="Loged" id='link' class="myButton" @click="logoutUser()">Salir</button>
    </div>
  </div>
</template>

<script>
import { clearLogin } from '../api/utils'
export default {
  name: 'MenuCustom',
  methods: {
    logoutUser(){
      clearLogin();
      this.$router.push('/');
      return
    },
    getUserName() {
      this.nombreUsuario = localStorage.getItem("name");
      if (localStorage.getItem("id")) {
        this.userID = localStorage.getItem("id");
      } else {
        this.userID = 0;
      }
    },
    getLogedStatus() {
      if (this.userID !== 0) {
        this.Loged = true;
      }
    }
  },
  data() {
    return {
      adminroutes: false,
      nombreUsuario: '',
      userID: 0,
      Loged: false
    };
  },
  created() {
    this.getUserName();
    this.getLogedStatus();
  }
}
</script>
<style>
#logo {
  max-width: 100px;
  max-height: 100px;
  position: absolute;
  left: 0.25rem;
  top:  -0.75rem;
  border-radius: 6rem;
}
#link {
  margin-left: 1rem;
}
.MenuCustom {
  background: #3F3D56;
  margin: 0;
  display: flex;
  justify-content: flex-end;
}
.MenuCustom button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin: 0;
}

.MenuCustom span {
  margin-left: 3rem;
  color: white;
  font-weight: bold;
}

</style>