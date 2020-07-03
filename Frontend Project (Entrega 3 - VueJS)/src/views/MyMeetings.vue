<template>
  <div class="mymeetings">
    <vue-headful title="MyMeeting" description="MyMeeting page" />

    <!-- MENU -->
    <menucustom id="menuMeetings"></menucustom>

<!--  SIMBOLO DE CARGA  -->
    <div id="spinner" v-show="loading">
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>  
    
<section class="flexmeetings">
  <section>
<img id="clock" v-show="!loading" src="../assets/calendar.svg" alt="MyMeetings image">
</section>
<section v-show="!loading" class="mymeetingsblock">
  <section class="mymeetingsblock2">
  <h1>Eventos a los que asistiré:</h1>
  <div class="meetingblocklist">
    <h2>{{ meetings[0] ? null : 'Todavía no tienes ninguna' }}</h2>
  <div class="blockmeeting" v-for="meeting in meetings" :key="meeting.id">
    <a :href="path + meeting.id">
      <img :src="meeting.id ? getPhoto(meeting.id) : null" alt />
      <section>
      <p><span>Título:</span> {{ formatTitle(meeting.title) }} <router-link v-show="meeting.title.length" :to=" {name:'meeting', params:{id:meeting.id}} ">...ver más</router-link></p>
      <p><span>Fecha:</span> {{ formatDate(meeting.meeting_date) }}</p>
      <p><span>Ciudad:</span> {{ meeting.city }}</p>
      <p><span>Nivel:</span> {{ formatLevel(meeting.lang_level) }}</p>
      <p><span>Idioma:</span> {{meeting.lang_name ? meeting.lang_name : 'English' }}</p>
    </section>
    </a>
      </div>
      </div>
  </section>
  <section class="mymeetingsblock2">
  <h1>Mis eventos organizados:</h1>
  <div class="meetingblocklist">
    <h2>{{ meetingsHosted[0] ? null : 'Todavía no tienes ninguna' }}</h2>
  <div class="blockmeeting" v-for="meeting in meetingsHosted" :key="meeting.id">
    <a :href="path + meeting.id">
      <img :src="meeting.id ? getPhoto(meeting.id) : null" alt />
      <section>
      <p><span>Título:</span> {{ formatTitle(meeting.title) }} <router-link v-show="meeting.title.length" :to=" {name:'meeting', params:{id:meeting.id}} ">...ver más</router-link></p>
      <p><span>Fecha:</span> {{ formatDate(meeting.meeting_date) }}</p>
      <p><span>Ciudad:</span> {{ meeting.city }}</p>
      <p><span>Nivel:</span> {{ formatLevel(meeting.lang_level) }}</p>
      <p><span>Idioma:</span> {{meeting.lang_name ? meeting.lang_name : 'English' }}</p>
    </section>
    </a>
    </div>
    </div>
  </section>
</section>
</section>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
//IMPORTANDO MENU
import menucustom from "@/components/MenuCustom.vue";
export default {
  name: "MyMeetings",
  components: { menucustom },
  data() {
    return {
      path: "http://localhost:8080/#/meeting/",
      loading: true,
      id: '',
      meetings: [],
      meetingsHosted: []
    };
  },
  methods: {
    getPhoto(id) {
    let lastNumber = id.toString().split('').pop();
    return `http://localhost:3001/imgbares/${lastNumber}.jpeg`
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
    getMyMeetings() {
      let self = this;
      self.id = localStorage.getItem('id')
      axios
        .get(
          "http://localhost:3001/entries/myMeetings/" + self.id
        ).then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.meetings = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    getMyMeetingsHosted() {
      let self = this;
      self.id = localStorage.getItem('id')
      axios
        .get(
          "http://localhost:3001/entries/myMeetingsHosted/" + self.id
        ).then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.meetingsHosted = response.data.data;
            console.log(response.data.data);
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
},
created() {
  this.getMyMeetings();
  this.getMyMeetingsHosted();
}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');
.blockmeeting section {
  min-width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.blockmeeting img {
  max-width: 100%;
  max-height: 100%;
  border: 2px black solid;
}
.blockmeeting {
  height: 200px;
  width: auto;
  margin: 0.334rem;
  position: relative;
  color: white;
  font-weight: bold;
}
.meetingblocklist span {
  font-weight: bold;
}
.meetingblocklist a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}
.meetingblocklist p {
  margin: auto;
  padding: 0 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  max-width: 90%;
  background-color: rgba(0, 0, 0, 0.76);
  margin-bottom: .6rem;
}
.meetingblocklist {
  font-family: 'Merriweather', serif;
  min-width: 40vw;
  min-height: 30vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.mymeetings {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100vw;
  min-height: 100vh;
}
.flexmeetings {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 80vh;
  min-width: 100vw;
}
.flexmeetings img#clock {
  max-width: 800px;
  margin-left: 10rem;
}
.mymeetingsblock2 {
background: white;
  max-width: 60%;
  min-height: 30vh;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  border-radius: 30px;
  margin: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#menuMeetings {
  min-width: 100vw;
}
.mymeetingsblock2 h1 {
  font-size: 2rem;
  margin: 1rem;
  text-decoration: underline;
}
.mymeetingsblock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  border: 1px solid #888;
  width: 80%;
  color: black;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.vote {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
#spinner {
  min-height: 40vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.lds-ring {
  width: 400px;
  height: 200px;
  border-radius: 100px;
  background: #3F3D56;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;

}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>