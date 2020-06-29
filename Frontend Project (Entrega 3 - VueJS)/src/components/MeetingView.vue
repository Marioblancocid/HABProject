<template>
  <div>
    <div class="meeting">
      <img id="meetimg" :src="meeting.id ? getPhoto() : null" alt="" />
      <p><span>ID: </span>{{ meeting.id }}</p>
      <p><span>Nombre del host: <router-link :to=" {name:'Profile', params:{id:meeting.id_user_host ? meeting.id_user_host : 0}} ">{{meeting.first_name + ' ' + meeting.second_name}}</router-link></span></p>
      <p><span>Titulo del evento: </span>{{ meeting.title }}</p>
      <p><span>Fecha: </span>{{ formatDate(meeting.meeting_date) }}</p>
      <p><span>Ciudad: </span>{{ meeting.city }}</p>
      <p><span>Pais: </span>{{ meeting.country }}</p>
      <p><span>Descripción: </span>{{ meeting.commentary }}</p>
      <p><span>Dirección: </span>{{ meeting.adress }}</p>
      <p><span>Nivel de la charla: </span>{{ formatLevel(meeting.lang_level) }}</p>
      <p><span>Score: </span>{{ Number(meeting.vote).toFixed([2]) }}</p>
      <p><span>Gente apuntada:  </span>{{ peopleJoin.length }} </p>
      <p><span>Máximas personas permitidas:  </span>{{ meeting.max_users }} </p>
      <div v-for="comment in comments" :key="comment.id">
        <p>
          <span>{{ comment.id }}:</span>
          {{ comment.commentary }}, Score: {{ comment.stars }} ⭐
        </p>
      </div>
      <br/>
      <section v-show="getIds()" v-for="join in allPeopleJoins" :key=join.id_users>
        <p>user: {{ join.first_name }} {{ join.second_name }}</p>
        <p>Admitido: {{ join.user_admitted ? 'yes' : 'no' }}</p>
        <p>{{ join.user_admitted ? null : join.join_message }}</p>
        <button v-show="join.user_admitted===0" @click="letJoin(join.id_users, join.id_meetings)">Aceptar</button>
      </section>
        <button v-show="getIds()" @click="openModal()">Editar</button>
        <button v-show="getIds()" @click="eliminar()">Borrar</button>

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
          console.log(response);
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
    let lastNumber = this.meeting.id.toString().split('').pop();
      return `http://localhost:3001/imgbares/${lastNumber}.jpeg`
    },
    getIds(){
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
      axios
        .delete(
          "http://localhost:3001/entries/" + this.meeting.id
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
  mounted() {
      this.setFechaMinimoYMaximo();
  },
}
}
</script>

<style>
.meeting {
  margin: 0
}
.meeting img#meetimg {
max-width: 90%;
}
.modalBox {
  max-width: 40%;
}
.modalBox h3 {
  margin: 0.5rem 0 1rem 0;
}
.modalBox label {
  margin-left: 1rem;
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