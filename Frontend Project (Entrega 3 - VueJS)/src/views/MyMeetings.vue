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
  <h1 id="eventtitle">Eventos a los que asistiré:</h1>
  <div class="meetingblocklist">
    <h2>{{ meetings[0] ? null : 'Todavía no tienes ninguno' }}</h2>
  <div class="blockmeeting" v-for="meeting in meetings" :key="meeting.id">
    <a :href="path + meeting.id">
      <img :src="meeting.id ? getPhoto(meeting.id) : null" alt />
      <section>
      <p id="titulo">{{ formatTitle(meeting.title) }}</p>
      <p>{{ formatDate(meeting.meeting_date) }}</p>
      <p id="secundary"><span>Ciudad:{{ meeting.city }}</span> </p>
      <p id="secundary"><span>Idioma: {{meeting.lang_name ? meeting.lang_name : 'English' }}</span> </p>
    </section>
    </a>
      </div>
      </div>
  </section>
  <section class="mymeetingsblock2">
  <h1 id="eventtitle">Mis eventos organizados:</h1>
  <div class="meetingblocklist">
    <h2>{{ meetingsHosted[0] ? null : 'Todavía no tienes ninguno' }}</h2>
  <div class="blockmeeting" v-for="meeting in meetingsHosted" :key="meeting.id">
    <a :href="path + meeting.id">
      <img :src="meeting.id ? getPhoto(meeting.id) : null" alt />
      <section>
      <p id="titulo">{{ formatTitle(meeting.title) }}</p>
      <p>{{ formatDate(meeting.meeting_date) }}</p>
      <p id="secundary"><span >Ciudad: {{ meeting.city }}</span></p>
      <p id="secundary"><span>Idioma: {{meeting.lang_name ? meeting.lang_name : 'English' }}</span></p>
    </section>
    </a>
    </div>
    </div>
  </section>
</section>
</section>
<footercustom v-show="!loading"></footercustom>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
//IMPORTANDO MENU
import menucustom from "@/components/MenuCustom.vue";
import footercustom from '@/components/FooterCustom.vue'
export default {
  name: "MyMeetings",
  components: { menucustom, footercustom },
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');
#eventtitle {
  font-size: 3rem;
}
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
  height: 300px;
  padding: 1rem;
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
  font-weight: 500;
  font-size: 1.2rem;
  max-width: 90%;
  background-color: #3F3D56;
  margin-bottom: .6rem;
}
span {
  font-weight: bold;
}
#titulo {
  font-size: 1.5rem;
}
#secundary {
  background: none;
  text-align: right;
  font-size: 1rem;
  color: #3F3D56;
}
#secundary span {
  background: white;
  padding: 0rem 0.2rem;
}
.meetingblocklist {
  font-family: 'Merriweather', serif;
  min-width: 40%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.mymeetings {
  font-family: 'Merriweather', serif;
  background-image: url("../assets/loginBackground.jpeg");
  background-repeat: no-repeat;
  background-attachment: fixed;
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
  justify-content: space-around;
  min-height: 80vh;
  min-width: 100vw;
}
.flexmeetings img#clock {
  max-width: 500px;
  margin-left: 10rem;
  animation: fadein 1s;
}
.mymeetingsblock2 {
  animation: fadein 2s;
  background: white;
  max-width: 50vw;
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
  animation: fadein 0.5s;
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
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>