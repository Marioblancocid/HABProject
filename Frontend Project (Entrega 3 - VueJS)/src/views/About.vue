<template>
  <div class="about">

<!-- MENU -->
<menucustom></menucustom>
<section class="aboutflex">
<vue-headful title="About" description="About page" />
  <img id="undraw" src="../assets/sobremi.svg" alt="">

<section id="card">
  <h1>Sobre mi</h1>
  <section id="images">
  <img id="mario" src="../assets/yo.png" alt="">
  <img id="logo" src="../assets/logoapp.png" alt="">
  </section>
  <p id="contact"><span id="icon" class="typcn typcn-mail"></span>marioblancocid@hotmail.es</p>
  <p id="contact"><span id="icon" class="typcn typcn-social-linkedin-circular"></span><a href="https://www.linkedin.com/in/mario-blanco-cid-62098519b/">Mario Blanco Cid</a></p>
  <p id="contact"><span id="icon" class="typcn typcn-phone-outline"></span>633254556</p>
  <hr>
  <p>Hola! Soy <span>Mario Blanco</span>, estudiante del bootcamp <span>Full-Stack</span> de <span>Hack a Boss</span>. Desde pequeño siempre me gustó el mundo de la programación y en mis ratos libres me divertía programando mis pequeños proyectos. </p>
   <p> ¡Hoy estoy aquí para demostraros lo que soy capaz de programar! </p>
  <hr>

    <p>Coffee&Talk fue íntegramente desarrollado por mí, utilizando las siguientes tecnologias:</p>

    <p><span><span id="icon" class="typcn typcn-device-desktop"></span> Tecnologías y librerías utilizadas en Front:</span></p>
    <p>Vue.js, Canva, SweetAlert2, Vue-Headful, CSSLoaderSpiner, unDraw, Typicons</p>

    <p><span><span id="icon" class="typcn typcn-device-desktop"></span> Tecnologías y librerías utilizadas en Front:</span></p>
    <p>MySQL, Node.js, Express, Axios, Sendgrid, Jwt-decode</p>

    <p><span><span id="icon" class="typcn typcn-lightbulb"></span>Actualmente me encuentro terminando una formación en React.js y Angular</span></p>
</section>
</section>
<footercustom></footercustom>
  </div>
</template>

<script>
import menucustom from "@/components/MenuCustom.vue"; 
import footercustom from '@/components/FooterCustom.vue'
import typicons from 'typicons.font'

export default {
  name: "About",
  components: { menucustom, footercustom },
  data() {
}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,300&display=swap');

hr {
  min-width: 100%;
  margin: 1rem;
}
#images {
  animation: fadein 2s;
  min-width: 100%;
  display: flex;
  overflow: hidden;
  max-height: 350px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
#logo {
  animation: fadein 3s;
  max-width: 490px;
}
h1 {
  font-size: 3rem;
  text-decoration: underline;
}
a {
  color: black;
}
img#mario {
  max-width: 300px;
  border-radius: 50%;
  border: 6px solid rgb(117, 114, 114);
  margin-left: 5rem;
}
.about {
    font-family: 'Merriweather', serif;
  background-image: url("../assets/loginBackground.jpeg");
}
.aboutflex {
  display: flex;
  min-height: 85vh;
  align-items: center;
  justify-content: space-around;
}
p {
  font-size: 1.3rem;
  text-align: left;
  margin-bottom: 0.5rem;
  min-width: 100%;
}
#contact {
  text-align: left;
  min-width: 100%;
}
span {
  font-weight: bold;
  text-align: left;
  color: #3F3D56;
}
span#icon {
  font-size: 2rem;
}
.about #card {
  animation: fadein 2s;
  background: white;
  max-width: 50%;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.125);
  border-radius: 30px;
  margin: 2rem;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#undraw {
  max-width: 600px;
  animation: fadein 2s;
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