<template>
<div>

    <!-- MENU -->
    <MenuCustom id="menu"></MenuCustom>
  <div class="Register">

      <!--APLICAMOS EL CAMBIO DE NOMBRE DINAMICO-->
    <vue-headful title="Registro"
    description="Página de registro de la aplicación."/>


    <section class="flexregister">
    <img src="../assets/Register.svg" alt="Register image">  
    <form id="registerform">
    <h2 id="titulo">
      ¡Empieza ya a aprender idiomas!
    </h2>
    <p id="error" v-show="required">{{errorMsg}}</p>
    
    <section>
      <p>
        Introduce tus datos de Login y guardalos para el futuro! Te servirán para entrar en tu Coffee&Talk!
      </p>
    </section>

    <section class="flexsection">

    <section>
    <label for="email">Email:</label>
    <input minlength="3" maxlength="100" required type="email" placeholder="Introduce tu email" v-model="email">
    </section>
    
    <section>
    <label for="password">Contraseña:</label>
    <input name="password" required type="password" minlength="6" maxlength="100" placeholder="Introduce tu contraseña" v-model="user_password">
    </section>

    <section>
    <input name="password2" required type="password" minlength="6" maxlength="100" placeholder="Repite tu contraseña" v-model="user_password2">
    </section>

    </section>
  

    <section>
      <p>
        Ahora cuentanos un poco sobre ti! Nos servirá para encontrar gente similar con quién practicar idiomas!
      </p>
    </section>

    <section class="flexsection">

    <section>
    <label for="">Nombre:</label>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu nombre" v-model="first_name">
    </section>
    <section>
    <label for="">Apellidos:</label>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu apellido" v-model="second_name">
    </section>
    <section>
    <select name="language" required placeholder="Introduce tu lenguaje nativo" v-model="main_language">
    <option v-for="lang in languages" :key="lang.lang_name" v-bind:value="lang.lang_name">
      {{lang.lang_name}}
      </option> 
      <option value="" selected disabled hidden>Elige tu idioma principal</option>
    </select>
    </section>
    </section>

    <section class="flexsection3">

    <section>
    <label for="">Fecha:</label>
    <input required type="date" value="2000-01-01" min="1940-01-01" max="2004-07-01" placeholder="Introduce tu fecha de nacimiento" v-model="birth_date">
    </section>
    <section>
    <label required for="">Sexo:</label>
    <select name="sexo" required v-model="sex">
      <option value="" selected disabled hidden>Elige tu sexo</option>
      <option value="Male">Hombre</option>
      <option value="Female">Mujer</option>
      <option value="Other">Otro</option>
    </select>
    </section>    
    <section>
    <label for="">Telefono:</label>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu telefono" v-model="tel">
    </section>

    </section>
    



          <p>
        ¿Donde vives? ¿Que hobbies tienes? ¿Te ha recomendado alguien? ¡Esto nos ayudará a encontrar a gente como tú!
      </p>
    <section class="flexsection">

    <section>
    <label for="">Direccion:</label>
    <input minlength="3" maxlength="100" required type="text"  placeholder="Introduce tu direccion" v-model="adress">
    </section>
    <section>
    <input minlength="3" maxlength="100" required type="text"  placeholder="Introduce tu ciudad" v-model="city">
    </section>

    <section>
    <input minlength="3" maxlength="100" required type="text"  placeholder="Introduce tu provincia" v-model="province">
    </section>
    <section>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu pais" v-model="country">
    </section>

    </section>

    <section class="flexsection">

    <section>
    <label for="">Intereses:</label>
    <input minlength="3" maxlength="100" required c type="text"  placeholder="Introduce tus intereses" v-model="interests">
    </section>
        <section>
    <label for="">Comentario:</label>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce un comentario" v-model="user_status">
    </section>
    <section>
    <label for="">Código de amigo:</label>
    <input type="text" placeholder="Recomendaciones" v-model="admin_code">
    </section>

    </section>
  

<a href="#" @click='addUser()' class="cta">
  <span id="regispan">Register</span>
  <svg width="13px" height="10px" viewBox="0 0 13 10">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
</a>
    </form>

  </section>
  </div>
  <FooterCustom id="footer"></FooterCustom>
  </div>
</template>

<script>
import { loginUser, registerUser, getLang, getEmail } from '../api/utils'
import axios from 'axios'
import FooterCustom from '../components/FooterCustom'
import MenuCustom from '@/components/MenuCustom.vue'
import Swal from 'sweetalert2'
export default {
  name: 'Register',
  data() {
    return {
      email: '',
      user_password: '',
      user_password2: '',
      main_language: '',
      first_name: '',
      second_name: '',
      birth_date: '',
      adress: '',
      city: '',
      province: '',
      country: '',
      sex: '',
      tel: '',
      user_status: '',
      interests: '',
      admin_code: '', 
      correctData: false,
      required: false,
      errorMsg: 'Error',
      languages: [],
      existingUser: false
    }
    },
    components: {
      MenuCustom, FooterCustom
    },
    methods: {
      showError(msg) {
        this.errorMsg = msg
        this.correctData = false; // NON ENVIAR
        this.required = true; // MOSTRA O MENSAXE
      },
      validatingData() {
      if (
        this.email === "" ||
        this.password === "" ||
        this.password2 === "" || 
        this.main_language === "" ||
        this.first_name === "" ||
        this.second_name === "" ||
        this.birth_date === "" ||
        this.adress === "" ||
        this.city === "" ||
        this.province === "" ||
        this.country === "" ||
        this.sex === "" ||
        this.tel === "" ||
        this.user_status === "" ||
        this.interests === ""
      ) {
        this.showError('Por favor cubre todos los campos');
        return;
      } else if (this.user_password !== this.user_password2){
        this.showError('Las contraseñas no coinciden');
        return;
      } else if (!this.validateEmail(this.email)){
        this.showError('El email no es valido');
        return;
      } else if (!this.validateName(this.first_name)){
        this.showError('El nombre no es valido');
        return;
      } else if (!this.validateName(this.second_name)){
        this.showError('Los apellidos no son validos');
        return;
      } else if (!this.validateName(this.city)){
        this.showError('La ciudad no es válida');
        return;
      } else if (!this.validateName(this.province)){
        this.showError('La provincia no es válida');
        return;
      } else if (!this.validateName(this.country)){
        this.showError('La ciudad no es válida');
        return;
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
      async addUser(){
        this.validatingData();
        if (this.correctData) {
        try {
          if (!this.admin_code.length) {
            this.admin_code = '      '
          }
          await this.isNewUser();
          if (this.existingUser === true) {
            this.showError('Este correo ya existe en la base de datos');
          } else {
          await registerUser(this.email, this.user_password, this.main_language, this.first_name, this.second_name, this.birth_date, this.adress, this.city, this.province, this.country, this.sex, this.tel, this.user_status, this.interests, this.admin_code);
          // SI HAY LOGIN, QUE ME LLEVE AL HOME
          Swal.fire({
          icon: "success",
          title: "Registrado!",
          text: "No olvides checkear tu inbox y spam antes de loguearte",
        });
        this.$router.push('/')
        }
        } catch (error) {
          console.log(error);
        }
        }
        return;
      },
        async getLanguages(){
        try {
          this.languages = await getLang();
        } catch (error) {
          console.log(error);
        }
      },
        async isNewUser(){
        try {
          this.existingUser = await getEmail(this.email);
        } catch (error) {
          throw (error);
        }
      },
      validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      validateName(name) {
        var re = /^[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúñÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙÑ.-]+$/
        return re.test(String(name));
      }
    },
    mounted() {
      this.getLanguages();
    }
    }
</script>
<style scoped> 
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');

.flexregister {
  display: flex;
  flex-direction: row;
}

:focus {
outline:none;
}
#titulo {
  margin-bottom: 2rem;
  font-size: 3rem;
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

div #menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
#error {
  color: red;
  margin: 0;
  font-size: 1.2rem;
}
.Register {
  background-image: url("../assets/loginBackground.jpeg");
  background-size: 100%;
  background-repeat: round;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.flexsection {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.flexregister img {
  max-width: 600px;
  animation: fadein 1s;
  margin: 3rem;
}
#registerform {
  animation: fadein 2s;
  padding: 2rem;
  font-family: 'Merriweather', serif;
  background: white;
  border: 2px solid white;
  margin-top: 1rem;
  min-width: 40vw;
  min-height: 40vh;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
}
.flexsection3{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.flexsection section {
  margin: 0.5rem;
}
.flexsection3 label {
  margin-left: 2.5rem;
}
.Register select {
  background: white;
  margin: 0.5rem;
  padding: 0.6rem 1rem 0.6rem 1rem;
  min-width: 40%;
  border-radius: 20px;
}
.Register input {
  margin: 0.5rem;
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  min-width: 40%;
  border-radius: 20px;
}
.Register p {
  text-align: left;
  margin: 2rem 1rem 1rem 1rem;
  font-size: 1.1rem;
  color: #3F3D56;
  font-weight: bold;
}
/* CSS DEL BOTON */

a {
  text-decoration: none;
  color: inherit;
  margin: 1rem;
}

.cta {
  margin-top: 2rem;
  margin-bottom: 0rem;
  position: relative;
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

#regispan {
  color: black;
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