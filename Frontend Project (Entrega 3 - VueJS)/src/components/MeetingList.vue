<template>
  <div class="meetinglist">
    <div class="meeting" v-for="meeting in meetings" :key="meeting.id">
      <a :href="path + meeting.id">
      <img :src="meeting.id ? getPhoto(meeting.id) : null" alt />
      <section>
      <p><span>Título:</span> {{ formatTitle(meeting.title) }}</p>
      <p><span>Fecha:</span> {{ formatDate(meeting.meeting_date) }}</p>
      <p><span>Ciudad:</span> {{ meeting.city }}</p>
      <p><span>Nivel:</span> {{ formatLevel(meeting.lang_level) }}</p>
      <p><span>Idioma:</span> {{meeting.lang_name }}</p>
    </section>
    </a>
    </div>
    </div>
</template>

<script>
export default {
  name: "Listameetings",
  data() {
    return {
      path: "http://localhost:8080/#/meeting/"
    };
  },
  props: {
    meetings: Array
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
        param = param.slice(0, 20) + '...'
      }
      return param;
    }
  }
};
</script>
<style>

.meetinglist {
  font-family: 'Merriweather', serif;
  min-width: 40vw;
  min-height: 40vh;
  border-radius: 30px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  display: flex;
  flex-wrap: wrap;
  margin: 3rem;
  justify-content: space-around;
  padding: 0;
}
.meeting a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}
.meeting p {
  margin: auto;
  padding: 0 0 0 0.5rem;
  font-weight: 500;
  max-width: 100%;
  background-color: rgba(0, 0, 0, 0.76);
  margin-bottom: .6rem;
}
.meeting span {
  font-weight: bold;
}
.meeting {
  width: 350px;
  height: auto;
  margin: 0.5rem;
  position: relative;
  color: white;
  font-weight: bold;
}
.meeting img {
  max-width: 100%;
  max-height: 100%;
  border: 2px black solid;
}

.meeting section {
  min-width: 90%;
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
}
</style>