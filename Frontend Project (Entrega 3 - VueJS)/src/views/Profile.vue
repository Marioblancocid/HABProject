<template>
  <div class="Perfil usuarios">
    <vue-headful title="Profile" description="Profile page" />

    <!-- MENU -->
    <menucustom id="menuProfile"></menucustom>

    <!--  SIMBOLO DE CARGA  -->
    <div v-show="loading" class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
<section class="flexprofile">
  <img v-show="!loading" src="../assets/perfil.svg" alt="profile image">
<section v-show="!loading" id="profileCard">
    <!-- PROFILE COMPONENT -->
    <ProfileComponent :profile="profile" v-show="!loading"></ProfileComponent>

<div>
  <section v-show="getIds()">
        <button @click="openModal('edit')">Editar</button>
        <button @click="openModal('pass')">Cambiar Contraseña</button>
        <button @click="eliminar()">Borrar Perfil</button>
      </section>
</div>
</section>
</section>
<!-- MODAL PARA EDITAR PERFIL -->
<div class="modal" v-show="modalEdit">
<div class="modalBox">
  <section>
    <label for="">Nombre:</label>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu nombre" v-model="first_name">
    <label for="">Apellidos:</label>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu apellido" v-model="second_name">
    </section>
    <section>
    <label for="">Fecha de Nacimiento:</label>
    <input required type="datetime-local" id="birth_date" name="birth_date" value="2018-06-12T19:30" v-model="birth_date">
    <label for="">Telefono:</label>
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu telefono" v-model="tel">
    </section>
    <section>
      <label for="">Direccion:</label>
    <input minlength="3" maxlength="100" required type="text"  placeholder="Introduce tu direccion" v-model="adress">
    <input minlength="3" maxlength="100" required type="text"  placeholder="Introduce tu ciudad" v-model="city">
    </section>
    <section>
    <input minlength="3" maxlength="100" required type="text"  placeholder="Introduce tu provincia" v-model="province">
    <input minlength="3" maxlength="100" required type="text" placeholder="Introduce tu pais" v-model="country">
    </section>
    <section>
    <label for="">Intereses:</label>
    <input minlength="3" maxlength="100" required c type="text"  placeholder="Introduce tus intereses" v-model="interests">
    <label required for="">Sexo:</label>
    <select name="sexo" required placeholder="Introduce tu sexo" v-model="sex">
      <option value="Male">Hombre</option>
      <option value="Female">Mujer</option>
      <option value="Other">Otro</option>
    </select>
    </section>
    <textarea minlength="3" maxlength="100" required type="text" placeholder="Introduce un comentario sobre ti" v-model="user_status">
    </textarea>
    <section>
    <button @click="closeModal()">Cancelar</button>
    <button @click="edite()">Enviar</button>
    </section>
</div>
</div>

<div class="modal" v-show="modalPass">
<div class="modalBox">
  <section>
    <label for="password">Antigua contraseña:</label>
    <input name="oldpassword" required type="password" minlength="6" maxlength="100" placeholder="Introduce tu contraseña" v-model="old_user_password">
    </section>
    <section>
    <label for="password">Nueva contraseña:</label>
    <input name="password" required type="password" minlength="6" maxlength="100" placeholder="Introduce tu contraseña" v-model="user_password">
    </section>
    <section>
    <label for="password">Repite la nueva contraseña:</label>
    <input name="password2" required type="password" minlength="6" maxlength="100" placeholder="Repite tu contraseña" v-model="user_password2">
    </section>
    <section>
    <button @click="closeModal()">Cancelar</button>
    <button @click="changePassword()">Cambiar Contraseña</button>
    </section>
  </div>
  </div>



</div>
</template>

<script>
import menucustom from "@/components/MenuCustom.vue";
import { clearLogin } from '../api/utils'
import ProfileComponent from "@/components/ProfileComponent.vue";

import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "Profile",
  components: {
    menucustom,
    ProfileComponent
  },
  data() {
    return {
      old_user_password: '',
      user_password: '',
      user_password2: '',
      profile: {},
      loading: true,
      modalEdit: false,
      modalPass: false,
      first_name: '',
      second_name: '',
      main_language: '',
      email: '',
      role: '',
      birth_date: '',
      adress: '',
      city: '',
      province: '',
      tel: '',
      country: '',
      sex: '',
      user_status: '',
      interests: '',
      id: '',
      id_viewer: ''
    };
  },
  watch: {
    "$route.params.id"(val) {
      // call the method which loads your initial state
      this.getProfile();
    },
},
  methods: {
    formatDate(param){
      const date = new Date(param);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
      return date.toLocaleString('es-ES', options); 
    },
    logoutUser(){
      clearLogin();
      this.$router.push('/');
      return
    },
    eliminar() {
      Swal.fire({
        title: 'Estas seguro de que quieres borrar tu perfil?',
        text: "Despues de hacerlo no podras volver atrás!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borra mi perfil!'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Has borrado tu perfil!',
            'Seras redirigido al Landing.',
            'success'
          )
          this.deleteUser();
          clearLogin();
          this.$router.push('/');
        }
      })
    },
    deleteUser() {
      let self = this;
      axios
        .delete(
          "http://localhost:3001/users/" + this.profile.id,
        )
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    changePassword() {
      if (this.user_password !== this.user_password2) {
        alert('Las contraseñas no coinciden');
        return
      };
      let self = this;
      axios
        .post(
          `http://localhost:3001/users/${self.profile.id}/password`,
          { 
            oldPassword: self.old_user_password,
            newPassword: self.user_password
          }
        )
        .then(function(response) {
          console.log(response);
          Swal.fire(
            'Has cambiado tu contraseña!',
            'Seras redirigido al Login.',
            'success'
          )
            self.logoutUser();     
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    edite() {
      let self = this;
      axios
        .put(
          "http://localhost:3001/users/" + this.profile.id,
          { 
            email: this.email,
            first_name: this.first_name,
            second_name: this.second_name,
            birth_date: this.birth_date,
            adress: this.adress,
            province: this.province,
            city: this.city,
            country: this.country,
            sex: this.sex,
            tel: this.tel,
            user_status: this.user_status,
            interests: this.interests
          }
        )
        .then(function(response) {
          console.log(response);
          location.reload();
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    closeModal() {
      this.modalEdit = false;
      this.modalPass = false;
    },
    getIds(){
      if (this.profile.id) {
      this.id = this.profile.id;
      this.id_viewer = localStorage.getItem('id');
      if (this.id.toString() === this.id_viewer) {
        return true
      } else {
        return false
      }
      }
    },
    saveDataToModal() {
      this.first_name = this.profile.first_name
      this.second_name = this.profile.second_name
      this.main_language = this.profile.main_language
      this.email = this.profile.email
      this.role = this.profile.role
      this.tel = this.profile.tel
      this.birth_date = this.profile.birth_date.slice(0, 16);
      this.adress = this.profile.adress
      this.city = this.profile.city
      this.province = this.profile.province
      this.country = this.profile.country
      this.sex = this.profile.sex
      this.user_status = this.profile.user_status
      this.interests = this.profile.interests
    },
    getProfile() {
      let self = this;
      axios
        .get("http://localhost:3001/users/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.profile = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
            /*   self.$router.push({ path: "/error" }); */
          }
        });
    },
    openModal(param) {
      if (param === 'edit') {
        this.saveDataToModal();
        this.modalEdit = true;
      } else {
        this.modalPass = true;
      }

    }
  },
  created() {
    this.getProfile();
  }
};
</script>
<style>
.flexprofile {
  display: flex;
  flex-direction: row;  
}
#profileCard {
  background: white;
  max-width: 60%;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  border-radius: 30px;
  margin: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#menuProfile {
  min-width: 100vw;
}
.Perfil {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100vw;
  min-height: 100vh;
}
.Perfil button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin-left: 1rem;
}

.Perfil p {
  margin-bottom: 0.3rem;
  text-align: center;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}
.modalBox {
  background: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border-radius: 40px;;
  border: 1px solid #888;
  width: 40%;
  color: black;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.modalBox input {
  font-family: 'Merriweather', serif;
  margin: 0.5rem;
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  max-width: 25%;
  border-radius: 20px;
  border: 1px solid #3F3D56;
}

.modalBox textarea {
  min-width: 50%;
  min-height: 6rem;
  align-self: center;
  margin-bottom: 1rem;
  border-radius: 10px;
  padding: 0.5rem;
}

.modalBox select {
  background: white;
  margin: 0.5rem;
  padding: 0.6rem 1rem 0.6rem 1rem;
  min-width: 10%;
  border-radius: 20px;
}

.modalBox button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin-left: 1rem;
  max-width: 30%;
  margin-top: 0.5rem;
}

.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: cadetblue;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>