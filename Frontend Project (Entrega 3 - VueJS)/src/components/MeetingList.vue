<template>
  <div class="meetinglist">
    <div class="meetingCardList" v-for="meeting in meetings" :key="meeting.id">
      <a :href="path + meeting.id">
      <img :src="meeting.id ? getPhoto(meeting.id, meeting.image) : null" alt />
      <section>
      <p><span id="title">{{ meeting.title }}</span></p>
      <p><span>{{ formatDate(meeting.meeting_date) }}</span></p>
      <p id="secundary"><span >Ciudad: {{ meeting.city }}</span></p>
      <p id="secundary"><span >Idioma: {{meeting.lang_name }}</span></p>
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
      path: "http://localhost:8080/#/meeting/",
      pathimg: "http://localhost:3001/uploads/"
    };
  },
  props: {
    meetings: Array
  },
  methods: {
    getPhoto(id, image) {
      if (image) {
        return (this.pathimg + image)
      }
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
<style scoped>

.meetinglist {
  font-family: 'Merriweather', serif;
  min-width: 40vw;
  min-height: 40vh;
  border-radius: 30px;
  display: flex;
  flex-wrap: wrap;
  margin: 3rem;
  justify-content: space-around;
  padding: 0;
  animation: fadein 2s;
}
.meetingCardList a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}
.meetingCardList p {
  margin: auto;
  padding: 0 0 0 0.5rem;
  font-weight: 500;
  font-size: 1.2rem;
  max-width: 100%;
  background-color: #3F3D56;
  margin-bottom: .6rem;
}
.meetingCardList span {
  font-weight: bold;
}
#title {
  font-size: 1.5rem;
  text-align: left;
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
.meetingCardList {
  width: 380px;
  height: 280px;
  overflow: hidden;
  margin: 0.5rem;
  position: relative;
  color: white;
  font-weight: bold;
  animation: fadein 2s;
  border: 3px black solid;
}
.meetingCardList img {
  max-width: 120%;
  max-height: 120%;
}

.meetingCardList section {
  min-width: 90%;
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
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