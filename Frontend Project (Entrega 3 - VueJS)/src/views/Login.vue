<template>
<div>

    <!-- MENU -->
    <menucustom id="menu"></menucustom>

  <div class="Login">
  <vue-headful title="Login" description="Login page" />


    <img src="../assets/undraw_authentication_fsn5.svg" alt="login image">
    <section>
    <h2 id="Login">
      Inicia sesión
    </h2>
    <p id="errors" v-show="required">{{errorMsg}}</p>
    <input type="text" spellcheck="false" required placeholder="Introduce tu correo electrónico" v-model="usuario">
    <input type="password" @keypress.enter="login()" required placeholder="Introduce tu contraseña" v-model="password">
    <a href="#" @click='login()' class="cta">
  <span>LOG IN</span>
  <svg width="13px" height="10px" viewBox="0 0 13 10">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
</a>
    <router-link id="registration" :to="{ name: 'Register'}">O registrate aquí.</router-link>

    <div class="modal" v-show="modal">
      </div>
  </section>
  
  </div>
  <FooterCustom id='footer'></FooterCustom>
  </div>
</template>

<script>
import menucustom from '../components/MenuCustom'
import FooterCustom from '../components/FooterCustom'
import { loginUser } from '../api/utils'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'Login',
  data() {
    return {
      usuario: '',
      password: '',
      errorMsg: 'Error',
      correctData: false,
      required: false,
      modal: false
    }
    },
    components: {
      menucustom, FooterCustom
    },
    methods: {
      showError(msg) {
        this.errorMsg = msg
        this.correctData = false; // NON ENVIAR
        this.required = true; // MOSTRA O MENSAXE
      },
      validatingData() {
        if (this.usuario.trim() === "" || this.password.trim() === "") {
          this.showError('Por favor cubre todos los campos');
          return false;
        } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
        return true;
      }
      },
      async login(){
        if (this.validatingData()) {
        try {
          // INTENTO HACER LOGIN
          await loginUser(this.usuario, this.password);
          localStorage.setItem("name", this.usuario);
          // SI HAY LOGIN, QUE ME LLEVE AL HOME
          this.$router.push('/home')
        } catch (error) {
          alert(error.response.data.message)
        }
      } else {
        return
      }
    },
    checkValidation() {
      if (this.$route.query.code) {
        let self = this;
        axios
        .get("http://localhost:3001/users/validate?code=" + self.$route.query.code,
        )
        .then(function(response) {
          Swal.fire({
        icon: "success",
        title: "Usuario Validado!",
        text: "Ya puedes logearte con tu contraseña!",
        confirmButtonText: "Ok",
        });
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
      }
    }
},
created() {
  this.checkValidation();
}
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');

#errors {
  font-size: 1rem;
  color: darkred;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
:focus {
outline:none;
}

div #menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
} 

div #footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  padding: 1.5rem;
  font-size: 300;
}
.Login {
  font-family: 'Merriweather', serif;
  background-image: url("../assets/loginBackground.jpeg");
  min-width: 40vw;
  min-height: 100vh;
  border-radius: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
}
.Login img {
  margin: 3rem 0rem;
  animation: fadein 1s;
  max-height: 400px;
}
.Login section {
  background: white;
  animation: fadein 2s;
  margin: 0.5rem;
  padding: 2rem 4rem;
  min-width: 20%;
  border-radius: 20px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 4rem;
}
.Login h2 {
  margin: 1.5rem;
  font-size: 3rem;
}
.Login section input {
  margin: 0.5rem;
  padding: 0.6rem 0rem 0.6rem 1rem;
  min-width: 70%;
  border-radius: 20px;
}

.Login div button {
  margin: 0.5rem;
}

.Login a#registration {
  font-size: 1rem;
  color: black;
}

.cta {
  font-size: 1rem;
  color: black;
}
#registration:hover {
  text-decoration: underline;
  color: rgb(58%, 38%, 40%);
  font-weight: bold;
  transition: all 0.1s ease;
}

/* CSS DEL BOTON */

.Login a {
  text-decoration: none;
  color: inherit;
  margin: 1rem;
}

.cta {
  position: relative;
  margin: auto;
  padding: 19px 22px;
  transition: all 0.2s ease;
}
.cta:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  border-radius: 28px;
  background: #3F3D56;
  width: 56px;
  height: 56px;
  transition: all 0.3s ease;
}
.cta span {
  color: black;
  position: relative;
  font-size: 16px;
  line-height: 18px;
  font-weight: 900;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  vertical-align: middle;
}
.cta svg {
  position: relative;
  top: 0;
  margin-left: 10px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #111;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}
.cta:hover:before {
  width: 100%;
  background: rgb(119, 115, 172);
}
.cta:hover svg {
  transform: translateX(0);
}
.cta:active {
  transform: scale(0.96);
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>