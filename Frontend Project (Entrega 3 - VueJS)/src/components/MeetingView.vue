<template>
  <div>
    <div class="meeting">
      <img id="meetimg" :src="meeting.id ? getPhoto() : null" alt="" />
      <p><span>Responsable de la charla: <router-link class="link" :to=" {name:'Profile', params:{id:meeting.id_user_host ? meeting.id_user_host : 0}} ">{{meeting.first_name + ' ' + meeting.second_name}}</router-link></span></p>
      <p><span>Titulo del evento: </span>{{ meeting.title }}</p>
      <p><span>Fecha: </span>{{ formatDate(meeting.meeting_date) }}</p>
      <p><span>Ciudad: </span>{{ meeting.city }}</p>
      <p><span>Pais: </span>{{ meeting.country }}</p>
      <p><span>Descripción: </span>{{ meeting.commentary }}</p>
      <p><span>Dirección: </span>{{ meeting.adress }}</p>
      <p><span>Nivel de la charla: </span>{{ formatLevel(meeting.lang_level) }}</p>
      <p><span>Puntuación: </span>{{ Number(meeting.vote).toFixed([2]) }}</p>
      <p><span>Gente apuntada:  </span>{{ peopleJoin.length }} </p>
      <p><span>Máximas personas permitidas:  </span>{{ meeting.max_users }} </p>
      <div v-for="comment in comments" :key="comment.id">
        <p>
          <span><router-link class="link" :to=" {name:'Profile', params:{id:comment.id ? comment.id : 0}} ">{{comment.first_name + ' ' + comment.second_name}}</router-link>:</span>
          {{ comment.commentary }}. Puntuación: {{ comment.stars }} ⭐
        </p>
      </div>
      <br/>
      <section class="joins" v-show="getIds()" v-for="join in allPeopleJoins" :key=join.id_users>
        <p><span>Asistente: </span> <router-link class="link" :to=" {name:'Profile', params:{id:join.id_users ? join.id_users : 0}} ">{{join.first_name + ' ' + join.second_name}}</router-link></p>
        <p><span>Admitido: </span>{{ join.user_admitted ? 'Sí' : 'no' }}</p>
        <p><span v-show="join.user_admitted===0">Mensaje: </span>{{ join.user_admitted ? null : join.join_message }}</p>
        <button id="peticion" v-show="join.user_admitted===0" @click="letJoin(join.id_users, join.id_meetings)">Aceptar</button>
      </section>
        <button id="editar" v-show="getIds()" @click="openModal()">Editar</button>
        <button id="borrar" v-show="getIds()" @click="eliminar()">Borrar</button>

    <!-- MODAL PARA EDITAR -->
    <div class="modal" v-show="modal">
      <div class="modalBox">
        <h3>Editar meeting:</h3>
<div>
        <label for="titulo">Titulo:</label>
        <input
          name="titulo"
          v-model="titulo"
        />
        <label for="online">¿Es online?</label>
        <select required name="online" placeholder="Online?" v-model="online">
        <option value="1">Si</option>
          <option value="0">No</option>
        </select>
</div>
<div>
        <label for="meeting-date">Elije la fecha de tu evento:</label>
        <input required type="datetime-local" id="meeting-time" name="meeting-time" value="2018-06-12T19:30" :min=fechaminimo :max=fechamaximo v-model="meeting_date">

</div>
<div>
        <label for="Language">Elije el idioma del evento:</label>
        <select name="language" required placeholder="Introduce tu lenguaje nativo" v-model="language">
        <option option v-for="lang in languages" :key="lang.lang_name" v-bind:value="lang.lang_name">
          {{lang.lang_name}}
        </option> 
        </select>
        </div>
<div>
        <label for="adresses">Direccion:</label>
        <input required minlength="3" maxlength="100" type="text"  placeholder="Introduce tu direccion" v-model="adress">
        <input required minlength="3" maxlength="100" type="text"  placeholder="Introduce tu ciudad" v-model="city">
</div>
<div>
        <input required minlength="3" maxlength="100" type="text"  placeholder="Introduce tu provincia" v-model="province">
        <input required minlength="3" maxlength="100" type="text" placeholder="Introduce tu pais" v-model="country">
</div>
<div>
        <label for="minusers">Mínimos asistentes:</label>
        <select required name="minusers" placeholder="Usuarios minimos" v-model="minusers">
        <option>2</option>
        <option>3</option>
        <option>4</option>
        </select>
</div>
<div>
        <label for="minusers" v-show="minusers">Máximos asistentes:</label>
        <select required name="maxusers"  placeholder="Usuarios maximos" v-model="maxusers" v-show="minusers">
        <option>{{parseInt(minusers) + 1}}</option>
        <option>{{parseInt(minusers) + 2}}</option>
        <option>{{parseInt(minusers) + 3}}</option>
        </select>

        <label for="">Duración (en minutos):</label>
        <input required type="number" name="duracionminutos" min="10" max="120" v-model="duracionminutos">
</div>
<div>
        <label for="langlevel">Nivel de la charla:</label>
        <select required name="langlevel"  placeholder="Introduce el nivel del idioma" v-model="langlevel">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
        <option value="senior">Senior</option>
        </select>

        <label for="minusers">Usuarios admitidos:</label>
        <select required name="minusers" placeholder="Usuarios minimos" v-model="sex">
              <option value="Unrestricted">Todos</option>
              <option value="Female">Solo mujeres</option>
              <option value="Male">Solo hombres</option>
        </select>
</div>
        <div>
          <button @click="closeModal()">Cancel</button>
          <button @click="edite()">Enviar</button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getLang } from '../api/utils'
import Swal from "sweetalert2"
export default {
  name: "MeetingView",
  data() {
    return {
      meeting_date: '',
      language: '',
      titulo: '',
      sex: '',
      online: '',
      adress: '',
      city: '',
      province: '',
      country: '',
      commentary: '',
      minusers: '',
      maxusers: '',
      duracionminutos: '',
      langlevel: '',
      path: "http://localhost:3001/uploads/",
      id_host: 0,
      id_viewer: '',
      isHost: false,
      modal: false,
      fechamaximo: '',
      fechaminimo: '',
      languages: [],
      freeTickets: ''
    };
  },
  props: {
    peopleJoin: Array,
    meeting: Object,
    comments: Array,
    allPeopleJoins: Array
  },
  methods: {
    letJoin(id, id_meeting) {
      let self = this;
      axios
        .put(
          `http://localhost:3001/entries/join/` + id_meeting,
          {
            id_user_join: id
          }
        )
        .then(function(response) {
          Swal.fire(
            'Has aceptado al usuario!',
            'Recibirá un correo electronico con esta informacion',
            'success'
          ).then(() => {
          location.reload();
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    formatDate(param){
      const date = new Date(param);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
      return date.toLocaleString('es-ES', options); 
    },
    formatLevel(param){
      if (param === 'intermediate') {
        return 'Intermedio'
      }
      if (param === 'beginner') {
        return 'Principiante'
      }
      if (param === 'expert') {
        return 'Experto'
      }
      if (param === 'senior') {
        return 'Nativo'
      }
    },
    formatTitle(param) {
      if (param.length > 20) {
        param = param.slice(0, 20);
      }
      return param;
    },
    getPhoto() {
      if (this.meeting.image) {
        return (this.path + this.meeting.image)
      }
    let lastNumber = this.meeting.id.toString().split('').pop();
      return `http://localhost:3001/imgbares/${lastNumber}.jpeg`
    },
    getIds(){
      if (localStorage.getItem('role')==='admin') {
        return true
      };  
      if (this.meeting.id_user_host) {
      this.id_host = this.meeting.id_user_host;
      this.id_viewer = localStorage.getItem('id');
      if (this.id_host.toString() === this.id_viewer) {
        return true
      } else {
        return false
      }
    }
  },
    setFechaMinimoYMaximo() {
      let dateToday = new Date();
      this.fechaminimo = dateToday.toISOString().slice(0, 16);
      var date = new Date();
      date.setDate(date.getDate() + 31);
      this.fechamaximo = date.toISOString().slice(0, 16);
    },
    closeModal() {
      this.modal = false;
    },
    edite() {
      let self = this;
      axios
        .put(
          "http://localhost:3001/entries/" + this.meeting.id,
          {
            language: this.language,
            meeting_date: this.meeting_date,
            title: this.titulo,
            online_meeting: this.online,
            adress: this.adress,
            city: this.city,
            province: this.province,
            country: this.country,
            min_users: this.minusers,
            max_users: this.maxusers,
            sex: this.sex,
            commentary: this.commentary,
            duration_minutes: this.duracionminutos,
            lang_level: this.langlevel
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
    async userNameFunction(id){
        try {
          // INTENTO HACER LOGIN
          const userName = await getUserName(id);
          return userName;
        } catch (error) {
          alert(error)
        }
    },
    capitalize() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    saveDataToModal() {
      this.language = this.meeting.lang_name
      this.titulo = this.meeting.title;
      this.meeting_date = this.meeting.meeting_date.slice(0, 16);
      this.sex = this.meeting.sex,
      this.online = this.meeting.online_meeting,
      this.adress = this.meeting.adress,
      this.city = this.meeting.city,
      this.province = this.meeting.province,
      this.country = this.meeting.country,
      this.commentary = this.meeting.commentary,
      this.minusers = this.meeting.min_users,
      this.maxusers = this.meeting.max_users,
      this.duracionminutos = this.meeting.duration_minutes,
      this.langlevel = this.meeting.lang_level
    },
    openModal(data) {
      this.saveDataToModal();
      this.getLanguages();
      this.modal = true;
    },
    async getLanguages(){
        try {
          this.languages = await getLang();
        } catch (error) {
          console.log(error);
        }
      },
    eliminar(){
      let self = this;
      Swal.fire({
        title: '¿Estas seguro de que quieres borrar este evento?',
        text: "Despues de hacerlo no podras volver atrás!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borra el evento!'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Has borrado el evento!',
            'Seras redirigido al Landing.',
            'success'
          );
          axios
        .delete(
          "http://localhost:3001/entries/" + this.meeting.id
        )
        .then(function(response) {
          self.$router.push('/home')
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
          self.$router.push('/home');
        }
      })
  },
  mounted() {
      this.setFechaMinimoYMaximo();
  },
}
}
</script>

<style scoped>
.joins {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: flex-start;
  border: 1px black solid;
  padding: 1rem;
  max-width: 50%;
  margin-bottom: 1rem;
}
:focus {
outline:none;
}
button {
  padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin: 0 0 1rem 1rem;

}
button#peticion{
    padding: 0.6rem 0rem 0.6rem 1.5rem;
  border-radius: 20px;
  background: white;
  padding-right: 2rem;
  margin-left: 1rem;
  background: green;
  align-self: center;
  margin-top: 0.5rem;
}
#editar {
  background: rgb(255, 208, 0);
}

#borrar {
  background: rgb(252, 17, 17);
}
a {
  color: #3F3D56
}

a:visited {
  color: #3F3D56
}
span {
  font-weight: bold;
}
.meeting {
  margin: 0
}
.meeting p {
  text-align: left;
  margin: 0.5rem;
  font-size: 1.3rem;
}
.meeting img#meetimg {
max-width: 100%;
border: 4px solid black;
margin-bottom: 1rem;
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
.modal h3 {
  font-size: 2rem;
  margin: 1rem;
}
.modalBox input#file {
  border: none;
  max-width: 50%;
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
  background: #3F3D56;
  color: white;
  padding-right: 2rem;
  margin-left: 1rem;
  max-width: 30%;
  margin-top: 1rem;
}
.vote {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
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